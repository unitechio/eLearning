import os
import re
import asyncio
import io
import subprocess
from pydub import AudioSegment

# =========================================================================
# CẤU HÌNH MẶC ĐỊNH
# =========================================================================
AM_GOC_PERCENT = 5        # Mặc định 25% âm lượng video gốc
AM_LONG_TIENG_PERCENT = 180   # Mặc định 180% âm lượng thuyết minh (to, rõ)
BAT_SUB_DEFAULT = 1         # Mặc định 1: BẬT SUB tiếng Việt (0: TẮT SUB)
MAX_CONCURRENT_TASKS = os.cpu_count() or 4  # Số tác vụ xử lý song song tối đa (theo nhân CPU)
# =========================================================================

def time_to_ms(minutes, seconds, milliseconds):
    return (int(minutes) * 60 + int(seconds)) * 1000 + int(milliseconds)

def ms_to_ass_time(ms):
    hours = ms // 3600000
    minutes = (ms % 3600000) // 60000
    seconds = (ms % 60000) // 1000
    centiseconds = (ms % 1000) // 10
    return f"{hours}:{minutes:02d}:{seconds:02d}.{centiseconds:02d}"

async def generate_tts_bytes(text, sem):
    """
    Sinh giọng thuyết minh hoàn toàn IN-MEMORY (trả về tệp WAV lưu trên RAM).
    Sử dụng Semaphore để giới hạn tác vụ đồng thời tránh nghẽn CPU.
    """
    clean_text = text.strip()
    if not clean_text or not any(c.isalnum() for c in clean_text):
        return AudioSegment.silent(duration=500)

    async with sem:
        piper_path = '/opt/piper/piper'
        model_path = '/opt/piper/models/vi_VN-vais1000-medium.onnx'

        # Cho Piper xuất thẳng ra stdout (-) để hứng dữ liệu bằng RAM
        process = await asyncio.create_subprocess_exec(
            piper_path, '--model', model_path, '--output_file', '-',
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate(input=clean_text.encode('utf-8'))
        
        if process.returncode != 0:
            raise Exception(f"Piper error: {stderr.decode('utf-8').strip()}")
        
        return AudioSegment.from_file(io.BytesIO(stdout), format="wav")

async def adjust_audio_speed_bytes(audio_segment, speed_factor):
    """
    Sử dụng FFmpeg co giãn âm thanh trực tiếp trong RAM (Sử dụng Pipes stdin/stdout).
    """
    temp_buffer = io.BytesIO()
    audio_segment.export(temp_buffer, format="wav")
    input_bytes = temp_buffer.getvalue()

    filters = []
    temp_factor = speed_factor
    while temp_factor > 2.0:
        filters.append("atempo=2.0")
        temp_factor /= 2.0
    filters.append(f"atempo={temp_factor:.4f}")
    filter_str = ",".join(filters)
    
    # FFmpeg nhận dữ liệu từ pipe:0 và trả kết quả qua pipe:1
    process = await asyncio.create_subprocess_exec(
        'ffmpeg', '-y',
        '-i', 'pipe:0',
        '-filter:a', filter_str,
        '-f', 'wav', 'pipe:1',
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    
    stdout, stderr = await process.communicate(input=input_bytes)
    
    if process.returncode != 0:
        raise Exception(f"FFmpeg speedup error: {stderr.decode('utf-8').strip()}")
        
    return AudioSegment.from_file(io.BytesIO(stdout), format="wav")

async def process_single_segment(seg, i, total, sem):
    """
    Xử lý song song khép kín: TTS -> Đo đạc -> Co giãn tốc độ.
    """
    allowed_duration_ms = seg['end'] - seg['start']
    
    try:
        # 1. Sinh giọng trong RAM
        audio_chunk = await generate_tts_bytes(seg['text'], sem)
        raw_duration_ms = len(audio_chunk)
        
        target_duration_ms = allowed_duration_ms - 100
        if target_duration_ms <= 0:
            target_duration_ms = allowed_duration_ms

        # 2. Co giãn tốc độ nếu bị lấn mốc thời gian
        if raw_duration_ms > target_duration_ms:
            speed_factor = raw_duration_ms / target_duration_ms
            if speed_factor > 2.5:
                speed_factor = 2.5
            
            # Co giãn trực tiếp trên RAM
            audio_chunk = await adjust_audio_speed_bytes(audio_chunk, speed_factor)
            
        print(f" -> Xử lý xong câu {i+1}/{total} (Mốc: {seg['start']/1000:.1f}s - Tốc độ gốc: {raw_duration_ms/1000:.1f}s)")
        return i, audio_chunk, seg['start']
        
    except Exception as e:
        print(f"   -> Lỗi xử lý câu {i+1}: {e}")
        return i, AudioSegment.silent(duration=allowed_duration_ms), seg['start']

def write_ass_subtitles(segments, ass_path):
    header = """[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,34,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,1,0,0,0,100,100,0,0,3,4,0,2,20,20,50,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    with open(ass_path, "w", encoding="utf-8") as f:
        f.write(header)
        for seg in segments:
            start_str = ms_to_ass_time(seg['start'])
            end_str = ms_to_ass_time(seg['end'])
            text = seg['text'].replace('{', '').replace('}', '')
            f.write(f"Dialogue: 0,{start_str},{end_str},Default,,0,0,0,,{text}\n")

async def main():
    txt_path = "vn.txt"
    video_path = "video.mp4"
    output_audio_path = "tts_voice_timeline.wav"
    final_video_path = "output.mp4"
    ass_sub_path = "temp_sub.ass"

    bg_pct = int(os.environ.get("AM_GOC", AM_GOC_PERCENT))
    voice_pct = int(os.environ.get("AM_LONG_TIENG", AM_LONG_TIENG_PERCENT))
    bat_sub_val = os.environ.get("BAT_SUB", str(BAT_SUB_DEFAULT)).lower()
    bat_sub = bat_sub_val in ("1", "on", "true", "yes")

    bg_volume = bg_pct / 100.0
    voice_volume = voice_pct / 100.0

    if not os.path.exists(txt_path) or not os.path.exists(video_path):
        print("Lỗi: Không tìm thấy file vn.txt hoặc video.mp4 ở thư mục hiện tại!")
        return

    pattern = re.compile(r'\[(\d+):(\d+)\.(\d+)\s*-->\s*(\d+):(\d+)\.(\d+)\]\s*(.*)')
    
    segments = []
    max_end_ms = 0

    with open(txt_path, 'r', encoding='utf-8') as f:
        for line in f:
            match = pattern.match(line.strip())
            if match:
                g = match.groups()
                start_ms = time_to_ms(g[0], g[1], g[2])
                end_ms = time_to_ms(g[3], g[4], g[5])
                text = g[6].strip()
                segments.append({'start': start_ms, 'end': end_ms, 'text': text})
                if end_ms > max_end_ms:
                    max_end_ms = end_ms

    total_segments = len(segments)
    print(f"Đã đọc được {total_segments} câu thoại từ file cấu trúc.")
    print(f"Cấu hình âm lượng sử dụng: Âm gốc = {bg_pct}%, Lồng tiếng = {voice_pct}%")
    print(f"Trạng thái Subtitle tiếng Việt: {'BẬT (Khung đen đặc, Cỡ lớn)' if bat_sub else 'TẮT'}")
    print(f"Khởi chạy xử lý TTS SONG SONG hoàn toàn trên RAM ({MAX_CONCURRENT_TASKS} luồng)...")

    # Giới hạn số luồng xử lý song song để tránh làm treo đơ máy tính của bạn
    sem = asyncio.Semaphore(MAX_CONCURRENT_TASKS)

    # Kích hoạt toàn bộ các câu thoại chạy đồng thời
    tasks = [process_single_segment(seg, i, total_segments, sem) for i, seg in enumerate(segments)]
    results = await asyncio.gather(*tasks)

    # Tạo timeline nền trống
    print("Mọi câu thoại đã được xử lý xong. Đang dựng timeline thuyết minh...")
    base_audio = AudioSegment.silent(duration=max_end_ms + 5000)

    # Sắp xếp và ráp nối các đoạn âm thanh từ RAM
    results_sorted = sorted(results, key=lambda x: x[0])
    for _, chunk, start_pos in results_sorted:
        base_audio = base_audio.overlay(chunk, position=start_pos)

    base_audio.export(output_audio_path, format="wav")

    print("Đang tiến hành trộn giọng thuyết minh và render video...")
    
    filter_complex_parts = [
        f"[0:a]volume={bg_volume}[bg]",
        f"[1:a]volume={voice_volume}[voice]",
        "[bg][voice]amix=inputs=2:duration=first:dropout_transition=2[a]"
    ]
    
    video_args = []
    if bat_sub:
        write_ass_subtitles(segments, ass_sub_path)
        filter_complex_parts.append(f"[0:v]subtitles={ass_sub_path}[v]")
        # Sử dụng preset 'ultrafast' giúp FFmpeg render video nhanh gấp 3 lần bản cũ
        video_args = ['-map', '[v]', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '22']
    else:
        video_args = ['-map', '0:v', '-c:v', 'copy']

    filter_str = ";".join(filter_complex_parts)
    
    cmd = [
        'ffmpeg', '-y',
        '-i', video_path,
        '-i', output_audio_path,
        '-filter_complex', filter_str
    ] + video_args + [
        '-map', '[a]',
        '-c:a', 'aac',
        final_video_path
    ]

    ffmpeg_proc = await asyncio.create_subprocess_exec(*cmd)
    await ffmpeg_proc.wait()
    
    if os.path.exists(output_audio_path):
        os.remove(output_audio_path)
    if os.path.exists(ass_sub_path):
        os.remove(ass_sub_path)
        
    print("Hoàn thành! File kết quả đã được lưu tại: ./output.mp4")

if __name__ == '__main__':
    asyncio.run(main())
