export type SampleKind = 'speaking' | 'writing';

export type SampleListItem = {
  slug: string;
  kind: SampleKind;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
};

export type VocabularyEntry = {
  phrase: string;
  ipa: string;
  meaning: string;
  example: string;
  image: string;
};

export const speakingSamples: SampleListItem[] = [
  ['topic-scenery', 'Nature', 'IELTS Speaking part 1 - Topic Scenery: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop'],
  ['topic-reading', 'Hobby', 'IELTS Speaking part 1 - Topic Reading: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=600&auto=format&fit=crop'],
  ['topic-sports-team', 'Hobby', 'IELTS Speaking part 1 - Topic Sports Team: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=600&auto=format&fit=crop'],
  ['topic-walking', 'Routine', 'IELTS Speaking part 1 - Topic Walking: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=600&auto=format&fit=crop'],
  ['topic-life-stages', 'Talk about yourself', 'IELTS Speaking part 1 - Topic Life Stages: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop'],
  ['topic-dream-job', 'Work & Study', 'IELTS Speaking part 1 - Topic Dream Job: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=600&auto=format&fit=crop'],
  ['topic-doing-well', 'Work & Study', 'IELTS Speaking part 1 - Topic Doing Well: Bài mẫu và từ vựng', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop'],
  ['topic-museum', 'Routine', 'IELTS Speaking part 1 - Topic Museum: Bài mẫu và từ vựng - Bài 2', 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=600&auto=format&fit=crop'],
  ['topic-having-a-break', 'Routine', 'IELTS Speaking part 1 - Topic Having a Break: Bài mẫu và từ vựng - Bài 2', 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop'],
].map(([slug, category, title, image]) => ({
  slug,
  kind: 'speaking',
  title,
  category,
  date: 'Quí 2 2026',
  image,
  excerpt: 'Bài mẫu 8.0+ IELTS Speaking part 1 kèm dàn ý, từ vựng, và bài tập. Những câu hỏi này được xuất hiện trong đề thi IELTS Speaking thật vào quý 2 năm 2026.',
}));

export const writingSamples: SampleListItem[] = [
  ['letter-of-advice-3', 'Advice Seeking Letter', 'Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 3', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop'],
  ['letter-of-advice-2', 'Advice Seeking Letter', 'Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 2', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'],
  ['letter-of-advice-1', 'Advice Seeking Letter', 'Thư cho lời khuyên (Letter of Advice) - IELTS General Writing Task 1 - Đề 1', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop'],
  ['application-letter-1', 'Application letter', 'Thư đăng ký (Application Letter) - IELTS General Writing Task 1 - Đề 3', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600&auto=format&fit=crop'],
  ['job-application-letter-2', 'Application letter', 'Thư xin việc (Job Application Letter) - IELTS General Writing Task 1 - Đề 2', 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop'],
].map(([slug, category, title, image]) => ({
  slug,
  kind: 'writing',
  title,
  category,
  date: 'Quí 2 2021',
  image,
  excerpt: 'Đề thi IELTS General Writing Task 1 yêu cầu viết một lá thư. Dưới đây, UNI sẽ cung cấp cho bạn một bài làm mẫu của đề này, các bạn có thể tham khảo.',
}));

export const speakingLifeStagesQuestions = [
  'What did you often do with your friends in your childhood?',
  'Do you have any plans for the next five years?',
  'How do people remember each stage of their lives?',
  'At what age do you think people are the happiest?',
  'Do you enjoy being the age you are now?',
];

export const speakingAnswers = [
  {
    question: speakingLifeStagesQuestions[0],
    answer:
      'Well, back in primary school, we spent most afternoons playing “cướp cờ” or hide-and-seek in the small alleys around our block, and laughing until our sides hurt. On weekends we’d pool our pocket money for a bag of iced chè or those cheap plastic toys from the street vendors, then race bikes or draw chalk hopscotch on the footpath.',
  },
  {
    question: speakingLifeStagesQuestions[1],
    answer:
      'Yeah, I’ve got a loose roadmap. I’d love to level up in my career, maybe shift toward something more creative like content creation or community projects that actually make a difference in Saigon. On the personal side, I’m aiming to travel more within Southeast Asia, build a solid savings cushion, and keep nurturing hobbies.',
  },
  {
    question: speakingLifeStagesQuestions[2],
    answer:
      'It seems like we tend to remember each stage through a mix of big milestones and tiny emotional details, like first friendships, family rituals, or that carefree feeling of endless playtime during school holidays.',
  },
];

export const speakingVocabulary: VocabularyEntry[] = [
  ['Laugh until our sides hurt', "/læf ənˈtɪl aʊər saɪdz hɜːrt/", '(verb). Cười đến đau cả bụng', 'My old friends were laughing until their sides hurt over silly stories.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300&auto=format&fit=crop'],
  ['Pool our pocket money for', "/puːl aʊər ˈpɑːkɪt ˈmʌni fɔːr/", '(verb). Góp tiền lẻ lại để mua', 'The kids pooled their pocket money for a big cake.', 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=300&auto=format&fit=crop'],
  ['Draw chalk hopscotch on the footpath', "/drɔː tʃɔːk ˈhɑːpskɑːtʃ ɑːn ðə ˈfʊtpæθ/", '(verb). Vẽ ô nhảy lò cò bằng phấn trên vỉa hè', 'The children drew chalk hopscotch on the footpath and played all afternoon.', 'https://images.unsplash.com/photo-1504151932400-72d4384f04b3?q=80&w=300&auto=format&fit=crop'],
  ['Level up in my career', "/ˈlevl ʌp ɪn maɪ kəˈrɪr/", '(verb). Thăng tiến trong sự nghiệp', 'After finishing the course, he started to level up in his career.', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=300&auto=format&fit=crop'],
  ['Build a solid savings cushion', "/bɪld ə ˈsɑːlɪd ˈseɪvɪŋz ˈkʊʃən/", '(verb). Xây dựng một khoản tiết kiệm vững chắc', 'She took on extra work to build a solid savings cushion.', 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=300&auto=format&fit=crop'],
  ['Grow roots while still chasing a few adventures', '/ɡroʊ ruːts waɪl stɪl ˈtʃeɪsɪŋ ə fjuː ədˈventʃərz/', '(verb). Ổn định cuộc sống nhưng vẫn theo đuổi một vài trải nghiệm', 'He wants to grow roots while still chasing a few adventures.', 'https://images.unsplash.com/photo-1523528283115-9bf9b1699245?q=80&w=300&auto=format&fit=crop'],
].map(([phrase, ipa, meaning, example, image]) => ({ phrase, ipa, meaning, example, image }));

export const writingSample = {
  title: 'Advice) - IELTS General Writing Task 1 - Đề 3',
  prompt:
    'Recently you saw an article in a newspaper/journal about a city/town you know and some of the information in the article was incorrect. Write a letter to the editor regarding this. In your letter, you should tell: how you know about this city/town; what information was incorrect; what the editor should do about this.',
  sample:
    'Dear Sir/Madam,\n\nI am an avid reader of The Guardian and I happened to read your article about Hoi An City, which was published on the 24th issue. There is some incorrect information in your article and I would like to suggest corrections for it.\n\nIn your article, you wrote that Hoi An City does not have a distinctive cuisine and that most of its food supply comes from other areas. I have to say that this information is indeed incorrect. We have a variety of specialty dishes in our hometown that cannot be found anywhere else in Vietnam. I have been living in Hoi An City for over 24 years so I know about this city like the back of my hand.\n\nI think it is imperative that you correct this information as soon as possible as it may confuse readers and lead to a lopsided view about Hoi An.\n\nBest regards,\n...',
  translation:
    'Thưa ông/bà,\n\nTôi là một độc giả trung thành của tờ The Guardian và tôi tình cờ đọc được bài viết của ông/bà về Thành phố Hội An, được xuất bản trong đợt phát hành thứ 24. Có một số thông tin không chính xác trong bài viết và tôi muốn đề xuất sửa chữa cho nó.',
};
