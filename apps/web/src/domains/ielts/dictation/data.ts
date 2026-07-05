export type DictationSentence = {
  id: number;
  english: string;
  vietnamese: string;
  wordCount: number;
  duration: string;
  difficulty: 'easy' | 'hard';
};

export type DictationVocabulary = {
  id: number;
  term: string;
  ipa: string;
  meaning: string;
};

export const dictationLesson = {
  slug: 'cam20-t4-the-football-stadium',
  title: '[CAM20 - T4] The football stadium',
  subtitle: 'Audio · 42 câu',
  sentenceCount: 42,
};

const starterSentences: DictationSentence[] = [
  {
    id: 1,
    english: 'Good morning and welcome to City Football Club.',
    vietnamese: 'Chào buổi sáng và chào mừng đến với Câu lạc bộ Bóng đá City.',
    wordCount: 8,
    duration: '00:03',
    difficulty: 'easy',
  },
  {
    id: 2,
    english: "I'd like to give you some useful information about your visit to the stadium today",
    vietnamese: 'Tôi muốn cung cấp cho các bạn một số thông tin hữu ích về chuyến thăm sân vận động hôm nay',
    wordCount: 15,
    duration: '00:05',
    difficulty: 'easy',
  },
  {
    id: 3,
    english: "and then we'll start the tour of the areas of the stadium that are open to visitors.",
    vietnamese: 'sau đó chúng ta sẽ bắt đầu chuyến tham quan các khu vực mở cửa cho khách.',
    wordCount: 16,
    duration: '00:06',
    difficulty: 'easy',
  },
  {
    id: 4,
    english: 'I can see lots of children here today, so just to let mums and dads know a few things before we start.',
    vietnamese: 'Tôi thấy hôm nay có rất nhiều trẻ em ở đây, nên tôi muốn nói vài điều với các bậc cha mẹ trước khi bắt đầu.',
    wordCount: 22,
    duration: '00:07',
    difficulty: 'hard',
  },
  {
    id: 5,
    english: "The stadium has lots of stairs and the players' tunnel is very dark.",
    vietnamese: 'Sân vận động có rất nhiều bậc thang và đường hầm của cầu thủ thì khá tối.',
    wordCount: 12,
    duration: '00:05',
    difficulty: 'easy',
  },
  {
    id: 6,
    english: "Please don't let your children wander off on their own, even for a minute.",
    vietnamese: 'Vui lòng không để trẻ em đi lạc một mình, dù chỉ trong một phút.',
    wordCount: 13,
    duration: '00:05',
    difficulty: 'hard',
  },
  {
    id: 7,
    english: "We don't want any accidents or anyone getting frightened.",
    vietnamese: 'Chúng tôi không muốn có tai nạn hay làm ai sợ hãi.',
    wordCount: 8,
    duration: '00:04',
    difficulty: 'easy',
  },
  {
    id: 8,
    english: 'Cameras are permitted everywhere and you can take pictures of your child shooting a penalty.',
    vietnamese: 'Máy ảnh được phép sử dụng ở mọi nơi và bạn có thể chụp ảnh con mình sút phạt đền.',
    wordCount: 14,
    duration: '00:06',
    difficulty: 'hard',
  },
];

export const dictationSentences: DictationSentence[] = [
  ...starterSentences,
  ...Array.from({ length: 34 }, (_, index) => {
    const source = starterSentences[index % starterSentences.length];
    return {
      ...source,
      id: index + 9,
      english: source.english.replace('.', index % 2 === 0 ? '.' : ''),
      difficulty: (index % 3 === 0 ? 'hard' : 'easy') as DictationSentence['difficulty'],
    };
  }),
];

export const dictationVocabulary: DictationVocabulary[] = [
  { id: 1, term: 'wander off', ipa: "'wɑːn.dər ɒf", meaning: 'đi lạc, đi lang thang' },
  { id: 2, term: 'shoot a penalty', ipa: "ʃuːt ə 'pen.əl.ti", meaning: 'sút phạt đền (trong bóng đá)' },
  { id: 3, term: 'pitch', ipa: 'pɪtʃ', meaning: 'Sân bóng' },
  { id: 4, term: 'self-guided', ipa: "'self'gaɪ.dɪd", meaning: 'tự định hướng, tự dẫn dắt, tự hướng dẫn' },
  { id: 5, term: "at one's own speed", ipa: 'æt wʌnz əʊn spiːd', meaning: 'theo tốc độ của riêng ai đó, theo khả năng của bản thân' },
  { id: 6, term: 'send someone off', ipa: "send 'sʌm.wʌn ɒf", meaning: 'đuổi ai đó ra khỏi sân' },
  { id: 7, term: 'commit an offence', ipa: "kə'mɪt ən ə'fens", meaning: 'phạm tội, thực hiện hành vi phạm pháp' },
  { id: 8, term: 'swap ends', ipa: 'swɒp endz', meaning: 'đổi chỗ, đổi vị trí, đổi đầu' },
  { id: 9, term: 'solid', ipa: "'sɒl.ɪd", meaning: 'Vững chắc, kiên cố' },
  { id: 10, term: 'crossbar', ipa: "'krɒs.bɑːr", meaning: 'xà ngang' },
  { id: 11, term: 'football league', ipa: "'fʊt.bɔːl liːg", meaning: 'giải bóng đá' },
  { id: 12, term: 'players tunnel', ipa: "'pleɪ.ərz 'tʌn.əl", meaning: 'đường hầm cầu thủ' },
  { id: 13, term: 'club shop', ipa: 'klʌb ʃɒp', meaning: 'cửa hàng câu lạc bộ' },
];
