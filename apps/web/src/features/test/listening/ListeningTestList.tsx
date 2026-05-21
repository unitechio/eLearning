
// ─── shared data ──────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 1, label: "Section 1", score: "0/10" },
  { id: 2, label: "Section 2", score: "0/10" },
  { id: 3, label: "Section 3", score: "0/10" },
  { id: 4, label: "Section 4", score: "0/10" },
];

// ─── Q11-16 data ──────────────────────────────────────────────────────────────
const Q11_16 = [
  { id: 11, text: "Walking around the town centre" },
  { id: 12, text: "Helping at concerts" },
  { id: 13, text: "Getting involved with community groups" },
  { id: 14, text: "Helping with a magazine" },
  { id: 15, text: "Participating at lunches for retired people" },
  { id: 16, text: "Helping with the website" },
];
const OPTIONS_AI = [
  { key: "A", text: "Providing entertainment" },
  { key: "B", text: "Providing publicity about a council service" },
  { key: "C", text: "Contacting local businesses" },
  { key: "D", text: "Giving advice to visitors" },
  { key: "E", text: "Collecting feedback on events" },
  { key: "F", text: "Selling tickets" },
  { key: "G", text: "Introducing guest speakers at an event" },
  { key: "H", text: "Encouraging cooperation between local organisations" },
  { key: "I", text: "Helping people find their seats" },
];

// ─── Q17-20 data ──────────────────────────────────────────────────────────────
const Q17_20 = [
  { id: 17, q: "Which event requires the largest number of volunteers?",
    opts: ["the music festival", "the science festival", "the book festival"] },
  { id: 18, q: "What is the most important requirement for volunteers at the festivals?",
    opts: ["interpersonal skills", "personal interest in the event", "flexibility"] },
  { id: 19, q: "New volunteers will start working in the week beginning",
    opts: ["2 September.", "9 September.", "23 September."] },
  { id: 20, q: "What is the next annual event for volunteers?",
    opts: ["a boat trip", "a barbecue", "a party"] },
];

// ─── Q31-40 data ──────────────────────────────────────────────────────────────
const Q31_40 = [
  {
    heading: "Developing food trends",
    items: [
      { id: 31, pre: "The growth in interest in food fashions started with", post: "of food being shared on social media." },
      { id: 32, pre: "Sales of", post: "food brands have grown rapidly this way." },
      { id: 33, pre: "Famous", post: "are influential." },
    ],
  },
  {
    heading: "Marketing campaigns",
    subsections: [
      {
        title: "The avocado:",
        items: [
          { id: 34, pre: "", post: "were invited to visit growers in South Africa." },
          { id: 35, pre: "Advertising focused on its", post: "benefits." },
        ],
      },
      {
        title: "Oat milk:",
        items: [
          { id: null, pre: "A Swedish brand's media campaign received publicity by upsetting competitors.", post: "" },
          { id: 36, pre: "Promotion in the USA through", post: "shops reduced the need for advertising." },
          { id: 37, pre: "It appealed to consumers who are concerned about the", post: "." },
        ],
      },
      {
        title: "Norwegian salmon:",
        items: [
          { id: 38, pre: "Was helped strengthen the", post: "of Norwegian seafood." },
        ],
      },
    ],
  },
  {
    heading: "Ethical concerns",
    subsections: [
      {
        title: "Quinoa:",
        items: [
          { id: 39, pre: "Its success led to an increase in its", post: "." },
          { id: 40, pre: "Overuse of resources resulted in poor", post: "." },
        ],
      },
    ],
  },
];

// ─── sub-components ───────────────────────────────────────────────────────────
function FillInput({ id, value, onChange }) {
  return (
    <>
      {" "}
      <span className="text-red-600 font-bold">{id}</span>
      <input
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        className="mx-1 border-b-2 border-gray-300 focus:border-red-600 outline-none text-sm w-24 text-center bg-transparent"
      />
    </>
  );
}

function GridMatch({ gridAnswers, toggleGrid }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="w-6" />
            <th className="text-left font-normal text-gray-500 pb-2 pr-4 text-xs" />
            {OPTIONS_AI.map((o) => (
              <th key={o.key} className="text-center font-bold text-gray-700 w-8 pb-2 text-xs">
                {o.key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Q11_16.map((q) => (
            <tr key={q.id} className="border-t border-gray-100">
              <td className="text-red-600 font-bold py-2 pr-2">{q.id}.</td>
              <td className="pr-4 py-2 text-gray-800 whitespace-nowrap text-xs">{q.text}</td>
              {OPTIONS_AI.map((o) => (
                <td key={o.key} className="text-center py-2">
                  <button
                    onClick={() => toggleGrid(q.id, o.key)}
                    className={`w-5 h-5 rounded border text-xs transition-all ${
                      gridAnswers[`${q.id}-${o.key}`]
                        ? "bg-red-600 border-red-600 text-white"
                        : "border-gray-300 text-gray-300 hover:border-red-400"
                    }`}
                  >
                    ✓
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">List of Options</p>
        {OPTIONS_AI.map((o) => (
          <p key={o.key} className="text-sm text-gray-700">
            <span className="font-bold text-gray-900 mr-1">{o.key}</span>{o.text}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Listening Test Page ──────────────────────────────────────────────────────
function ListeningTestPage() {
  const [section,      setSection]      = useState(2);
  const [gridAnswers,  setGridAnswers]  = useState({});
  const [mcAnswers,    setMcAnswers]    = useState({});
  const [fillAnswers,  setFillAnswers]  = useState({});

  const toggleGrid = (row, col) =>
    setGridAnswers((p) => ({ ...p, [`${row}-${col}`]: !p[`${row}-${col}`] }));

  const setFill = (id, val) =>
    setFillAnswers((p) => ({ ...p, [id]: val }));

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      <IELTSTestHeader
        subtitle="IELTS Online Test · CAM 20 · Listening Test 2"
        timeLeft="25:00"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

          {/* Section 2 — Q11-16 + Q17-20 */}
          {section === 2 && (
            <>
              {/* Q11-16 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                  Question 11 – 16 &nbsp; Match each role of the volunteers,{" "}
                  <b>A–I</b>, with the correct activity.
                </div>
                <div className="p-4">
                  <GridMatch gridAnswers={gridAnswers} toggleGrid={toggleGrid} />
                </div>
              </div>

              {/* Q17-20 */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                  Question 17 – 20 &nbsp; Choose appropriate options{" "}
                  <b>A</b>, <b>B</b>, or <b>C</b>.
                </div>
                <div className="p-4 space-y-4">
                  {Q17_20.map((item) => (
                    <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-800 mb-3">
                        <span className="text-red-600 font-bold mr-1">{item.id}</span>
                        {item.q}
                      </p>
                      <div className="space-y-2">
                        {item.opts.map((opt) => (
                          <label key={opt} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`q${item.id}`}
                              value={opt}
                              checked={mcAnswers[item.id] === opt}
                              onChange={() => setMcAnswers((p) => ({ ...p, [item.id]: opt }))}
                              className="accent-red-600"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Section 4 — Q31-40 */}
          {section === 4 && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-red-600 text-white px-4 py-3 text-sm font-semibold">
                Question 31 – 40 &nbsp; Complete the notes below using{" "}
                <span className="underline font-bold">ONE WORD ONLY</span>.
              </div>
              <div className="p-5 text-sm text-gray-800 space-y-6">
                {Q31_40.map((block) => (
                  <div key={block.heading}>
                    <h3 className="font-bold mb-2">{block.heading}</h3>

                    {/* flat items */}
                    {block.items && (
                      <ul className="space-y-2 list-disc list-inside">
                        {block.items.map((it) => (
                          <li key={it.id ?? it.pre}>
                            {it.pre}
                            {it.id && (
                              <FillInput id={it.id} value={fillAnswers[it.id] || ""} onChange={setFill} />
                            )}
                            {it.post && ` ${it.post}`}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* subsections */}
                    {block.subsections?.map((sub) => (
                      <div key={sub.title} className="mt-3">
                        <p className="font-semibold mb-1">{sub.title}</p>
                        <ul className="space-y-2 list-disc list-inside">
                          {sub.items.map((it) => (
                            <li key={it.id ?? it.pre}>
                              {it.pre}
                              {it.id && (
                                <FillInput id={it.id} value={fillAnswers[it.id] || ""} onChange={setFill} />
                              )}
                              {it.post && ` ${it.post}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other sections placeholder */}
          {section !== 2 && section !== 4 && (
            <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm">
              Section {section} — click section tabs below to switch
            </div>
          )}
        </div>
      </div>

      <IELTSTestBottomNav
        sections={SECTIONS}
        active={section}
        onSelect={setSection}
        leftSlot={
          <span>⋮⋮&nbsp; Section {section} &nbsp;<span className="text-gray-300">Đã làm 0/10</span></span>
        }
      />
    </div>
  );
}
