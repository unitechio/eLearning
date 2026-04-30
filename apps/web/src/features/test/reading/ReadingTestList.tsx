// ══════════════════════════════════════════════════════════════════════════════
// Reading Test Page
// ══════════════════════════════════════════════════════════════════════════════
const READING_SECTIONS = [
  { id: 1, label: "Passage 1", score: "0/13" },
  { id: 2, label: "Passage 2", score: "0/13" },
  { id: 3, label: "Passage 3", score: "0/14" },
];

const KAKAPO_PASSAGE = `The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures.

The kakapo, also known as the owl parrot, is a large, forest-dwelling bird, with a pale owl-like face. Up to 64 cm in length, it has predominantly yellow-green feathers, forward-facing eyes, a large grey beak, large blue feet, and relatively short wings and tail. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years.

Kakapo are solitary birds and tend to occupy the same home range for many years. They forage on the ground and climb high into trees. They often leap from trees and flap their wings, but at best manage a controlled descent to the ground. They are entirely vegetarian, with their diet including the leaves, roots and bark of trees as well as bulbs, and fern fronds.

Kakapo breed in summer and autumn, but only in years when food is plentiful. Males play no part in incubation or chick-rearing – females alone incubate eggs and feed the chicks. The 1-4 eggs are laid in soil, which is repeatedly turned over before and during incubation. The female kakapo has to spend long periods away from the nest searching for food, which leaves the unattended eggs and chicks particularly vulnerable to predators.

Before humans arrived, kākāpō were common throughout New Zealand's forests. However, this all changed with the arrival of the first Polynesian settlers about 700 years ago. For the early settlers, the flightless kakapo was easy prey. They ate its meat and used its feathers to make soft cloaks. With them came the Polynesian dog and rat, which also preyed on kakapo. By the time European colonisers arrived in the early 1800s, kākāpō had become confined to the central North Island and forested parts of the South Island.`;

const TFNG_QS = [
  { id: 3, text: "Adult male kakapo bring food back to nesting females." },
  { id: 4, text: "The Polynesian rat was a greater threat to the kakapo than Polynesian settlers." },
  { id: 5, text: "Kakapo were transferred from Rakiura Island to other locations because they were at risk from feral cats." },
];

function ReadingTestPage() {
  const [answers,  setAnswers]  = useState({});
  const [passage,  setPassage]  = useState(1);
  const [question, setQuestion] = useState(7);
  const totalPages = 13;

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <IELTSTestHeader
        subtitle="IELTS Online Test · CAM 20 · Reading Test 1"
        timeLeft="58:52"
      />

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 112px)" }}>
        {/* Passage */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-gray-200 bg-white">
          <h2 className="text-xl font-extrabold mb-1">The kākāpō</h2>
          <p className="text-xs text-gray-400 mb-3 italic">
            The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures.
          </p>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {KAKAPO_PASSAGE}
          </p>
        </div>

        {/* Questions */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-4">
          {TFNG_QS.map((q) => (
            <div key={q.id} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-800 mb-3">
                <span className="text-red-600 font-bold mr-1">{q.id}</span>
                {q.text}
              </p>
              <div className="space-y-2">
                {["True", "False", "Not given"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name={`rq${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((p) => ({ ...p, [q.id]: opt }))}
                      className="accent-red-600"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between z-40">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>⋮⋮</span>
          <span>Passage {passage}</span>
          <span className="text-gray-300 mx-1">·</span>
          <span>Đã làm 0/13</span>
        </div>

        {/* Question number pills */}
        <div className="flex gap-1 overflow-x-auto max-w-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => setQuestion(n)}
              className={`w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-all ${
                n === question
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <button className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
          7 → 13
        </button>
      </div>
    </div>
  );
}
