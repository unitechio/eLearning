export type ReadingTest = {
  id: string;
  slug: string;
  title: string;
  image: string;
  questions: number;
  attempts: string;
  status?: 'new' | 'in-progress' | 'completed';
  tags: string[];
};

export type ReadingAnswer = {
  question: number;
  type: 'Sentence Completion' | 'Table Completion' | 'True/False/Not Given';
  userAnswer?: string;
  correctAnswer: string;
  alternativeAnswers?: string[];
  status: 'correct' | 'incorrect' | 'missed';
  prompt: string;
  quote: string;
  paragraph: number;
  explanation: string[];
  linearLocked?: boolean;
};

export type VocabularyItem = {
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  image: string;
};

export const readingTests: ReadingTest[] = [
  {
    id: 'urban-farming',
    slug: 'urban-farming',
    title: 'Urban farming',
    image: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '61K lượt làm',
    status: 'in-progress',
    tags: ['Summary Completion', 'True/False/Not Given'],
  },
  {
    id: 'forest-management',
    slug: 'forest-management-in-pennsylvania-usa',
    title: 'Forest management in Pennsylvania, USA',
    image: 'https://images.unsplash.com/photo-1503435980610-a51f3ddfee50?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '29K lượt làm',
    tags: ['Matching Paragraph', 'Multiple Choice'],
  },
  {
    id: 'space-junk',
    slug: 'conquering-earths-space-junk-problem',
    title: "Conquering Earth's space junk problem",
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=900&auto=format&fit=crop',
    questions: 14,
    attempts: '27K lượt làm',
    tags: ['Matching Name', 'True/False/Not Given'],
  },
  {
    id: 'stonehenge',
    slug: 'stonehenge',
    title: 'Stonehenge',
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '20K lượt làm',
    tags: ['Multiple Choice'],
  },
  {
    id: 'artificial-intelligence',
    slug: 'living-with-artificial-intelligence',
    title: 'Living with artificial intelligence',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '24K lượt làm',
    tags: ['Summary Completion'],
  },
  {
    id: 'ideal-city',
    slug: 'an-ideal-city',
    title: 'An ideal city',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=900&auto=format&fit=crop',
    questions: 14,
    attempts: '25K lượt làm',
    tags: ['Matching Paragraph'],
  },
  {
    id: 'materials-concrete',
    slug: 'materials-to-take-us-beyond-concrete',
    title: 'Materials to take us beyond concrete',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '11K lượt làm',
    tags: ['Matching Name'],
  },
  {
    id: 'mixed-ability',
    slug: 'the-case-for-mixed-ability-classes',
    title: 'The case for mixed-ability classes',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=900&auto=format&fit=crop',
    questions: 14,
    attempts: '10K lượt làm',
    tags: ['True/False/Not Given'],
  },
  {
    id: 'green-roofs',
    slug: 'green-roofs',
    title: 'Green roofs',
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '15K lượt làm',
    tags: ['Summary Completion'],
  },
  {
    id: 'continental-drift',
    slug: 'alfred-wegener-science-exploration-and-the-theory-of-continental-drift',
    title: 'Alfred Wegener: science, exploration and the theory of continental drift',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=900&auto=format&fit=crop',
    questions: 14,
    attempts: '9K lượt làm',
    tags: ['Multiple Choice'],
  },
  {
    id: 'tennis-rackets',
    slug: 'how-tennis-rackets-have-changed',
    title: 'How tennis rackets have changed',
    image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '11K lượt làm',
    tags: ['Matching Paragraph'],
  },
  {
    id: 'ancient-mediterranean',
    slug: 'the-pirates-of-the-ancient-mediterranean',
    title: 'The pirates of the ancient Mediterranean',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '6K lượt làm',
    tags: ['Matching Name'],
  },
];

export const suggestedReadingTests = [
  {
    id: 'kakapo',
    slug: 'the-kakapo',
    title: 'The kakapo',
    image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '0 lượt làm',
    tags: ['Summary Completion'],
  },
  {
    id: 'to-britain',
    slug: 'to-britain',
    title: 'To Britain',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '0 lượt làm',
    tags: ['Multiple Choice'],
  },
  {
    id: 'stress-judgement',
    slug: 'how-stress-affects-our-judgement',
    title: 'How stress affects our judgement',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop',
    questions: 14,
    attempts: '0 lượt làm',
    tags: ['True/False/Not Given'],
  },
  {
    id: 'manatees',
    slug: 'manatees',
    title: 'Manatees',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop',
    questions: 13,
    attempts: '0 lượt làm',
    tags: ['Summary Completion'],
  },
];

export const urbanFarmingPassage = [
  `On top of a striking new exhibition hall in southern Paris, the world's largest urban rooftop farm has started to bear fruit. Strawberries that are small, intensely flavoured and resplendently red sprout abundantly from large plastic tubes. Peer inside and you see the tubes are completely hollow, the roots of dozens of strawberry plants dangling down inside them. From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs, such as basil, sage and peppermint. Opposite, in narrow, horizontal trays packed not with soil but with coconut fibre, grow cherry tomatoes, shiny aubergines and brightly coloured chards.`,
  `Pascal Hardy, an engineer and sustainable development consultant, began experimenting with vertical farming and aeroponic growing towers - as the soil-free plastic tubes are known - on his Paris apartment block roof five years ago. The urban rooftop space above the exhibition hall is somewhat bigger: 14,000 square metres and almost exactly the size of a couple of football pitches. Already, the team of young urban farmers who tend it have picked, in one day, 3,000 lettuces and 150 punnets of strawberries. When the remaining two thirds of the vast open area are in production, 20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day. 'We're not ever, obviously, going to feed the whole city this way,' cautions Hardy. 'In the urban environment you're working with very significant practical constraints, clearly, on what you can do and where. But if enough unused space can be developed like this, there's no reason why you shouldn't eventually target maybe between 5% and 10% of consumption.'`,
  `Perhaps most significantly, however, this is a real-life showcase for the work of Hardy's flourishing urban agriculture consultancy, Agripolis, which is currently fielding enquiries from around the world to design, build and equip a new breed of soil-free inner-city farm. 'The method's advantages are many,' he says. 'First, I don't much like the fact that most of the fruit and vegetables we eat have been treated with something like 17 different pesticides, or that the intensive farming techniques that produced them are such huge generators of greenhouse gases. I don't much like the fact, either, that they've travelled an average of 2,000 refrigerated kilometres to my plate, that their quality is so poor, because the varieties are selected for their capacity to withstand such substantial journeys, or that 80% of the price I pay goes to wholesalers and transport companies, not the producers.'`,
  `Produce grown using this soil-free method, on the other hand - which relies solely on a small quantity of water, enriched with organic nutrients, pumped around a closed circuit of pipes, towers and trays - is produced up here, and sold locally, just down there. It barely travels at all,' Hardy says. 'You can select crop varieties for their flavour, not their resistance to the transport and storage chain, and you can pick them when they're really at their best, and not before.' No soil is exhausted, and the water that gently showers the plants' roots every 12 minutes is recycled, so the method uses 90% less water than a classic intensive farm for the same yield.`,
  `Urban farming is not, of course, a new phenomenon. Inner-city agriculture is booming from Shanghai to Detroit and Tokyo to Bangkok. Strawberries are being grown in disused shipping containers, mushrooms in underground carparks. Aeroponic farming, he says, is 'virtuous'. The equipment weighs little, can be installed on almost any flat surface and is cheap to buy: roughly €100 to €150 per square metre. It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.`,
  `Produce grown this way typically sells at prices that, while generally higher than those of classic intensive agriculture, are lower than soil-based organic growers. There are limits to what farmers can grow this way, of course, and much of the produce is suited to the summer months. 'Root vegetables we cannot do, at least not yet,' he says. 'Radishes are OK, but carrots, potatoes, that kind of thing - the roots are simply too long. Fruit trees are obviously not an option. And beans tend to take up a lot of space for not much return.' Nevertheless, urban farming of the kind being practised in Paris is one part of a bigger and fast-changing picture that is bringing food production closer to our lives.`,
];

export const urbanFarmingAnswers: ReadingAnswer[] = [
  {
    question: 1,
    type: 'Sentence Completion',
    userAnswer: 'lettuces',
    correctAnswer: 'lettuces',
    status: 'correct',
    prompt: 'Vertical tubes are used to grow strawberries, ____ and herbs.',
    quote: 'From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs.',
    paragraph: 1,
    explanation: [
      'Câu hỏi yêu cầu điền loại cây trồng được trồng trong vertical tubes cùng với strawberries và herbs.',
      'Bài đọc nêu rõ lettuces xuất hiện cùng ngữ cảnh vertical tubes và đứng giữa strawberries, herbs.',
      'Vì vậy đáp án đúng là lettuces.',
    ],
  },
  {
    question: 2,
    type: 'Sentence Completion',
    userAnswer: '1,000 kg',
    correctAnswer: '1,000 kg',
    status: 'correct',
    prompt: 'There will eventually be a daily harvest of as much as ____ in weight of fruit and vegetables.',
    quote: '20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day.',
    paragraph: 2,
    explanation: [
      'Cụm daily harvest trong câu hỏi tương ứng với harvest ... every day trong đoạn 2.',
      'Giới hạn khối lượng được nêu là up to 1,000 kg.',
      'Đáp án giữ nguyên số và đơn vị là 1,000 kg.',
    ],
  },
  {
    question: 3,
    type: 'Sentence Completion',
    userAnswer: 'consumption',
    correctAnswer: 'consumption',
    status: 'correct',
    prompt: "The farm's produce may account for as much as 10% of the city's ____ overall.",
    quote: "there's no reason why you shouldn't eventually target maybe between 5% and 10% of consumption.",
    paragraph: 2,
    explanation: [
      'Câu hỏi paraphrase target maybe between 5% and 10%.',
      'Danh từ đứng sau phần trăm trong bài là consumption.',
      'Vì vậy đáp án là consumption.',
    ],
  },
  {
    question: 4,
    type: 'Table Completion',
    userAnswer: 'techniques',
    correctAnswer: 'pesticides',
    alternativeAnswers: ['techniques'],
    status: 'incorrect',
    prompt: 'Intensive farming uses a wide range of ____.',
    quote: 'most of the fruit and vegetables we eat have been treated with something like 17 different pesticides',
    paragraph: 3,
    explanation: [
      'Chỗ trống cần một danh từ số nhiều sau cụm wide range of.',
      'Thông tin liên quan là 17 different pesticides, diễn đạt một loạt nhiều loại thuốc trừ sâu.',
      'Từ techniques xuất hiện sau đó nhưng nói về nguyên nhân gây ô nhiễm, không hoàn thành ý wide range of used.',
    ],
  },
  {
    question: 5,
    type: 'Table Completion',
    correctAnswer: 'journeys',
    status: 'missed',
    prompt: 'Varieties are chosen that can survive long ____.',
    quote: 'the varieties are selected for their capacity to withstand such substantial journeys',
    paragraph: 3,
    explanation: [
      'Câu hỏi đổi selected for their capacity to withstand thành chosen that can survive.',
      'Danh từ cần điền là journeys.',
      'Từ này mô tả quãng đường vận chuyển dài mà rau quả phải chịu được.',
    ],
  },
  {
    question: 6,
    type: 'Table Completion',
    correctAnswer: 'producers',
    status: 'missed',
    prompt: '____ receive very little of overall income.',
    quote: '80% of the price I pay goes to wholesalers and transport companies, not the producers.',
    paragraph: 3,
    explanation: [
      'Nếu 80% giá tiền thuộc về wholesalers và transport companies thì phần còn lại của tổng thu nhập không thuộc về producers.',
      'Câu hỏi yêu cầu đối tượng nhận rất ít income.',
      'Đáp án là producers.',
    ],
  },
  {
    question: 7,
    type: 'Table Completion',
    correctAnswer: 'flavour',
    alternativeAnswers: ['flavor'],
    status: 'missed',
    prompt: 'Produce is chosen because of its ____.',
    quote: 'You can select crop varieties for their flavour, not their resistance to the transport and storage chain.',
    paragraph: 4,
    explanation: [
      'Aeroponic farming cho phép chọn giống theo hương vị thay vì khả năng chịu vận chuyển.',
      'Từ cần điền sau because of its là một danh từ.',
      'Đáp án chấp nhận flavour hoặc flavor.',
    ],
  },
  ...[
    ['True', 'Urban farming can take place above or below ground.'],
    ['Not Given', 'Some of the equipment used in aeroponic farming can be made by hand.'],
    ['False', 'Urban farming relies more on electricity than some other types of farming.'],
    ['True', 'Fruit and vegetables grown on an aeroponic urban farm are cheaper than traditionally grown organic produce.'],
    ['False', 'Most produce can be grown on an aeroponic urban farm at any time of the year.'],
    ['Not Given', 'Aeroponic urban farming has already been tested in several countries.'],
  ].map(([answer, prompt], index) => ({
    question: index + 8,
    type: 'True/False/Not Given' as const,
    correctAnswer: answer,
    status: 'missed' as const,
    prompt,
    quote: index === 2 ? 'It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.' : 'Relevant evidence is found in the final paragraphs of the passage.',
    paragraph: index === 2 ? 5 : 6,
    explanation: [
      'Đối chiếu statement với thông tin trong bài thay vì suy luận ngoài văn bản.',
      `Đáp án đúng của câu ${index + 8} là ${answer}.`,
    ],
    linearLocked: index > 1,
  })),
];

export const urbanFarmingVocabulary: VocabularyItem[] = [
  {
    word: 'vertical',
    ipa: '/ˈvɜːtɪkl/',
    partOfSpeech: 'adj.',
    meaning: 'dọc',
    example: 'The flagpole stood tall and vertical in the breeze.',
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=300&auto=format&fit=crop',
  },
  {
    word: 'strawberry',
    ipa: '/ˈstrɔːberi/',
    partOfSpeech: 'noun',
    meaning: 'dâu tây',
    example: 'She enjoyed the juicy sweetness of a ripe strawberry.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=300&auto=format&fit=crop',
  },
  {
    word: 'herb',
    ipa: '/hɜːb/',
    partOfSpeech: 'noun',
    meaning: 'thảo dược',
    example: 'He added fresh herbs like basil and thyme to the pasta sauce.',
    image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=300&auto=format&fit=crop',
  },
  {
    word: 'eventually',
    ipa: '/ɪˈventʃuəli/',
    partOfSpeech: 'adv.',
    meaning: 'cuối cùng',
    example: 'With practice, she eventually learned how to ride a bike.',
    image: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=300&auto=format&fit=crop',
  },
  {
    word: 'harvest',
    ipa: '/ˈhɑːvɪst/',
    partOfSpeech: 'noun',
    meaning: 'thu hoạch',
    example: 'The farmers gathered the ripe crops during the autumn harvest.',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=300&auto=format&fit=crop',
  },
  {
    word: 'weight',
    ipa: '/weɪt/',
    partOfSpeech: 'noun',
    meaning: 'trọng lượng',
    example: 'The weight of the bag was heavy to carry.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=300&auto=format&fit=crop',
  },
];
