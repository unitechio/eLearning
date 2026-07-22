FROM golang:1.22 AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /api ./cmd/api

FROM debian:12-slim
WORKDIR /root/

# Install system dependencies (ffmpeg, wget, tar, ca-certificates)
RUN apt-get update && apt-get install -y ffmpeg wget tar ca-certificates && rm -rf /var/lib/apt/lists/*

# Install Piper TTS Offline Engine (Linux x86_64)
RUN wget -q https://github.com/rhasspy/piper/releases/download/2023.11.14-2/piper_linux_x86_64.tar.gz -O /tmp/piper.tar.gz && \
    tar -xzf /tmp/piper.tar.gz -C /opt && \
    rm /tmp/piper.tar.gz

# Download voice models (Vietnamese & English)
RUN mkdir -p /opt/piper/models && \
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx -O /opt/piper/models/vi_VN-vais1000-medium.onnx && \
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/vi/vi_VN/vais1000/medium/vi_VN-vais1000-medium.onnx.json -O /opt/piper/models/vi_VN-vais1000-medium.onnx.json && \
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx -O /opt/piper/models/en_US-lessac-medium.onnx && \
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/v1.0.0/en/en_US/lessac/medium/en_US-lessac-medium.onnx.json -O /opt/piper/models/en_US-lessac-medium.onnx.json

COPY --from=builder /api .

EXPOSE 8080
ENV PIPER_PATH=/opt/piper/piper
ENV PIPER_MODEL_VI=/opt/piper/models/vi_VN-vais1000-medium.onnx
ENV PIPER_MODEL_EN=/opt/piper/models/en_US-lessac-medium.onnx

CMD ["./api"]
