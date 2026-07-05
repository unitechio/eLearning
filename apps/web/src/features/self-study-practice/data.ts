export type PracticeCard = {
  title: string;
  meta: string;
  image: string;
  badge?: string;
  status?: string;
  href: string;
  action: string;
};

export type PracticeSection = {
  title: string;
  href: string;
  items: PracticeCard[];
};

export const recentPractices: PracticeCard[] = [
  {
    title: '[CAM20 - T4] The football stadium',
    meta: 'Chép Chính Tả · 0/42 câu',
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop',
    href: '/chep-chinh-ta/cam20-t4-the-football-stadium',
    action: 'Chép tiếp',
  },
  {
    title: 'CAM 19 - Reading Test 2',
    meta: 'IELTS Online Test · 0/40 câu',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop',
    href: '/luyen-thi-ielts/ielts-reading-practice/urban-farming',
    action: 'Làm tiếp',
  },
  {
    title: 'CAM 19 - Reading Test 3',
    meta: 'IELTS Online Test · 0/40 câu',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?q=80&w=600&auto=format&fit=crop',
    href: '/luyen-thi-ielts/ielts-reading-practice/urban-farming',
    action: 'Làm tiếp',
  },
];

export const courseBanners = [
  {
    title: 'IELTS Reading Practice',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=800&auto=format&fit=crop',
    href: '/luyen-thi-ielts/ielts-reading-practice',
  },
  {
    title: 'Chép Chính Tả',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=800&auto=format&fit=crop',
    href: '/chep-chinh-ta/cam20-t4-the-football-stadium',
  },
  {
    title: 'IELTS Writing Sample',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop',
    href: '/ielts-writing-sample/general-task-1',
  },
  {
    title: 'IELTS Speaking Sample',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=800&auto=format&fit=crop',
    href: '/ielts-speaking-sample/part-1',
  },
];

export const practiceSections: PracticeSection[] = [
  {
    title: 'IELTS Online Test',
    href: '/luyen-thi-ielts/ielts-reading-practice',
    items: [
      ['CAM IELTS 20', '8 bài tests · 308K lượt làm', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'],
      ['CAM IELTS 19', '8 bài tests · 105K lượt làm', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop'],
      ['CAM IELTS 18', '8 bài tests · 199K lượt làm', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop'],
    ].map(([title, meta, image]) => ({ title, meta, image, href: '/luyen-thi-ielts/ielts-reading-practice', action: 'Xem bài test' })),
  },
  {
    title: 'IELTS Listening Practice',
    href: '/luyen-thi-ielts/ielts-listening-practice',
    items: [
      ['Music therapy for surgical patients', '0 lượt làm', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=600&auto=format&fit=crop', '10 câu'],
      ['Presentation on houses of the future', '0 lượt làm', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop', 'Đang làm 1/10'],
      ["James Craig's business exhibition", '0 lượt làm', 'https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=600&auto=format&fit=crop', '10 câu'],
      ['Survey about shopping in Broadbeach', '0 lượt làm', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop', '10 câu'],
    ].map(([title, meta, image, badge]) => ({ title, meta, image, badge, href: '/luyen-thi-ielts/ielts-listening-practice/presentation-on-houses-of-the-future', action: badge?.startsWith('Đang') ? 'Làm tiếp' : 'Làm bài' })),
  },
  {
    title: 'IELTS Reading Practice',
    href: '/luyen-thi-ielts/ielts-reading-practice',
    items: [
      ['The Globemakers: The Curious Story of an Ancient Craft', '0 lượt làm', 'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=600&auto=format&fit=crop', '14 câu'],
      ['How could multilingualism benefit India’s poorest schoolchildren?', '0 lượt làm', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop', '13 câu'],
      ['Rethinking the Past', '0 lượt làm', 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=600&auto=format&fit=crop', '14 câu'],
      ['The problems of getting around the city of Dar es Salaam', '0 lượt làm', 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=600&auto=format&fit=crop', '13 câu'],
    ].map(([title, meta, image, badge]) => ({ title, meta, image, badge, href: '/luyen-thi-ielts/ielts-reading-practice/urban-farming', action: 'Làm bài' })),
  },
  {
    title: 'Chép chính tả',
    href: '/chep-chinh-ta/cam20-t4-the-football-stadium',
    items: [
      ['[CAM12 - T1] Family Excursions', 'Audio · 54 lượt chép', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', '50 câu'],
      ['[CAM12 - T1] Paper on Public Libraries', 'Audio · 8K lượt chép', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop', '53 câu'],
      ['[CAM12 - T1] Talk to new kitchen assistants', 'Audio · 8K lượt chép', 'https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=600&auto=format&fit=crop', '31 câu'],
      ['[CAM12 - T1] Four business values', 'Audio · 5K lượt chép', 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop', '54 câu'],
    ].map(([title, meta, image, badge]) => ({ title, meta, image, badge, href: '/chep-chinh-ta/cam20-t4-the-football-stadium', action: 'Chép bài' })),
  },
  {
    title: 'IELTS Writing Sample',
    href: '/ielts-writing-sample/general-task-1',
    items: [
      ['Real IELTS Writing 2 - Topic Entertainment', 'Task 2: 10/2/2026 đề thi thật IELTS Writing Task 2', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop'],
      ['Real IELTS Writing 2 - Topic Government', 'Task 2: 10/2/2026 đề thi thật IELTS Writing Task 2', 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=600&auto=format&fit=crop'],
      ['Real IELTS Writing 2 - Topic Transport', 'Task 2: 10/2/2026 đề thi thật IELTS Writing Task 2', 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?q=80&w=600&auto=format&fit=crop'],
      ['Real IELTS Writing 2 - Topic Art', 'Task 2: 10/2/2026 đề thi thật IELTS Writing Task 2', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop'],
    ].map(([title, meta, image]) => ({ title, meta, image, href: '/ielts-writing-sample/general-task-1/letter-of-advice-3', action: 'Đọc bài' })),
  },
  {
    title: 'IELTS Speaking Sample',
    href: '/ielts-speaking-sample/part-1',
    items: [
      ['Bài mẫu IELTS Speaking part 2: Describe a person who makes plans a lot', 'Bài mẫu 8.0+ IELTS Speaking part 2', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop'],
      ['Bài mẫu IELTS Speaking part 2: Describe a time when the electricity suddenly went off', 'Bài mẫu 8.0+ IELTS Speaking part 2', 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop'],
      ['Bài mẫu IELTS Speaking part 2: Describe an important decision made with help of other people', 'Bài mẫu 8.0+ IELTS Speaking part 2', 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=600&auto=format&fit=crop'],
      ['Bài mẫu IELTS Speaking part 2: Describe a great dinner you and your friends or family members enjoyed', 'Bài mẫu 8.0+ IELTS Speaking part 2', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop'],
    ].map(([title, meta, image]) => ({ title, meta, image, href: '/ielts-speaking-sample/part-1/topic-life-stages', action: 'Đọc bài' })),
  },
];

export const popularSearches = [
  'Từ Vựng IELTS Online Test CAM IELTS 20 - Reading Test 1',
  'Advice On Surfing Holidays IELTS Listening Answers With Audio, Transcript, And Explanation',
  'Urban Farming IELTS Reading Answers with Explanation',
];
