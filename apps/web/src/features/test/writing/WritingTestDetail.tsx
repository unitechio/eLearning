
// ══════════════════════════════════════════════════════════════════════════════
// Writing Detail Page
// ══════════════════════════════════════════════════════════════════════════════
const UNDERLINED_PARAGRAPHS = [
  {
    parts: [
      { text: "I am an " },
      { text: "avid reader", u: true },
      { text: " of The Guardian and I " },
      { text: "happened to read", u: true },
      { text: " your article about Hoi An City which was " },
      { text: "published", u: true },
      { text: " on the 15th issue. There is some " },
      { text: "incorrect information", u: true },
      { text: " in your article and I would like to " },
      { text: "suggest corrections", u: true },
      { text: " for it." },
    ],
  },
  {
    parts: [
      { text: "In your article, you note that Hoi An City does not have a " },
      { text: "distinctive cuisine", u: true },
      { text: " and that most of its " },
      { text: "food variety", u: true },
      { text: " comes from other areas. I have to say that this information is indeed incorrect. We have a variety of " },
      { text: "speciality dishes", u: true },
      { text: " to our hometown that cannot be found anywhere else in Vietnam. I have been living in Hoi An City for over 18 years so I know " },
      { text: "this city like the back of my hand", u: true },
      { text: "." },
    ],
  },
  {
    parts: [
      { text: "I hope it is possible that you can correct this information as soon as possible as it may " },
      { text: "confuse readers", u: true },
      { text: " and " },
      { text: "lead to a biased view about Hoi An", u: true },
      { text: " which can affect the image of my hometown." },
    ],
  },
];

const EXERCISE_ITEMS = [
  { q: "Tôi là độc giả thân thiết của báo:", fill: "I am an ___ reader" },
  { q: "Tôi muốn đề xuất:",                   fill: "I would like to ___" },
  { q: "Tôi đã sống ở đây kể từ khi sinh:",   fill: "I have been living here since I was born as ___" },
];

function WritingDetailPage() {
  const [showAnswer, setShowAnswer] = useState(false);
  const [inputs,     setInputs]     = useState({});

  return (
    <div className="min-h-screen bg-white font-sans">
      <DolHeader active="Bài mẫu IELTS ▾" />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 py-3 text-xs text-gray-400 flex gap-1 flex-wrap">
        {["Trang chủ", "IELTS Bài mẫu", "IELTS Writing General Task 1"].map((b) => (
          <span key={b} className="flex items-center gap-1">
            <button className="hover:text-red-600 cursor-pointer">{b}</button>
            <span className="text-gray-300">›</span>
          </span>
        ))}
        <span className="text-gray-600">Thư cho lời khuyên - Đề 3</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 flex gap-8">
        {/* Main */}
        <article className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 3
          </h1>

          {/* Prompt */}
          <div className="mt-5 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
            <p className="italic mb-3">
              Recently you saw an article in a newspaper/journal about a city/town you know.
              Some of the information in the article was incorrect. Write a letter to the editor regarding this.
            </p>
            <p className="font-semibold mb-1">In your letter, you should tell:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>how you know about this city/town</li>
              <li>what information was incorrect</li>
              <li>what the editor should do about this.</li>
            </ul>
          </div>

          {/* DOL badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
              DOL IELTS Đình Lực
            </span>
            <span className="text-xs text-gray-400">· 39 phút trước</span>
          </div>

          {/* Bài mẫu */}
          <section className="mt-7">
            <div className="flex items-center gap-2 mb-3">
              <span>✍️</span>
              <h2 className="font-extrabold text-gray-900">Bài mẫu</h2>
              <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                <span>Band 7.0+</span>
                <span className="mx-1">|</span>
                <span>168 words</span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 text-sm text-gray-800 leading-relaxed space-y-3">
              <p>Dear Mr/Ms Madam,</p>
              {UNDERLINED_PARAGRAPHS.map((para, pi) => (
                <p key={pi}>
                  {para.parts.map((part, i) =>
                    part.u ? (
                      <span key={i} className="underline decoration-red-400">{part.text}</span>
                    ) : (
                      <span key={i}>{part.text}</span>
                    )
                  )}
                </p>
              ))}
              <p>I am looking forward to hearing back from you.</p>
              <p>Yours sincerely,</p>
              <p className="italic text-gray-400 text-xs">(168 words)</p>
            </div>
          </section>

          {/* Phân dịch */}
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <span>🌐</span>
              <h2 className="font-extrabold text-gray-900">Phân dịch</h2>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-sm text-gray-700 leading-relaxed space-y-2">
              <p>Thưa Ngài,</p>
              <p>
                Tôi là một độc giả thường xuyên của tờ The Guardian và tôi tình cờ đọc bài viết
                về Thành phố Hội An. Bài viết đó có một số thông tin không chính xác và tôi muốn
                đề xuất chỉnh sửa cho nó.
              </p>
              <p>
                Trong bài báo, bạn lưu ý rằng Thành phố Hội An không có ẩm thực đặc trưng và phần
                lớn sự đa dạng thực phẩm đến từ các khu vực khác. Tôi phải nói rằng thông tin này
                thực sự không đúng.
              </p>
            </div>
          </section>

          {/* Exercise */}
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <span>🔥</span>
              <h2 className="font-extrabold text-gray-900">Bài tập Exercise</h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-3">
              <p className="font-semibold text-gray-800">Exercise 1:</p>
              <p className="text-gray-500 text-xs mb-2">
                Dịch các câu sau đây từ Tiếng Anh sang Tiếng Việt:
              </p>
              {EXERCISE_ITEMS.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5 shrink-0">ℹ</span>
                  <div className="flex-1">
                    <p className="text-gray-600 text-xs">{item.q}</p>
                    <input
                      value={inputs[i] || ""}
                      onChange={(e) => setInputs((p) => ({ ...p, [i]: e.target.value }))}
                      placeholder={item.fill}
                      className="mt-1 border-b-2 border-gray-300 focus:border-red-600 outline-none text-sm w-56 bg-transparent text-gray-700 placeholder-gray-300"
                    />
                  </div>
                </div>
              ))}

              {showAnswer && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800 space-y-1">
                  <p><b>1.</b> avid</p>
                  <p><b>2.</b> suggest</p>
                  <p><b>3.</b> born</p>
                </div>
              )}

              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
              >
                {showAnswer ? "Ẩn đáp án" : "Check đáp án"}
              </button>
            </div>
          </section>

          {/* Tip */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-gray-700">
            <p className="font-bold text-gray-900 mb-1">💡 Lời khuyên</p>
            <p>
              Sau khi xem mẫu này, DOL muốn bạn không chỉ đơn giản đọc và hiểu mà còn thực sự
              luyện tập. Hãy thử viết lại bài theo cách của bạn và so sánh với bài mẫu.
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-60 hidden lg:block shrink-0">
          <div className="sticky top-20 space-y-4">
            <div className="bg-red-600 text-white rounded-xl p-4 text-center">
              <p className="font-bold text-sm">Tìm hiểu DOL English</p>
              <p className="text-xs mt-1 text-red-100">Học IELTS hiệu quả cùng Linearthinking</p>
              <button className="mt-3 bg-white text-red-600 text-xs font-bold px-4 py-1.5 rounded-full">
                Tìm hiểu ngay
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Bài viết khác</p>
              {["Thư xin việc - Đề 1", "Thư xin việc - Đề 2", "Thư yêu cầu - Đề 1", "Thư yêu cầu - Đề 2"].map((t) => (
                <p key={t} className="text-xs text-gray-600 hover:text-red-600 cursor-pointer py-1.5 border-b border-gray-100 last:border-0 transition-colors">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <CTABanner />
      </div>
      <DolFooter />
    </div>
  );
}
