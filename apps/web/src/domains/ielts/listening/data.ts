export type ListeningChoiceQuestion = {
  id: number;
  prompt: string;
  options: string[];
  answer?: string;
};

export type ListeningMatchQuestion = {
  id: number;
  prompt: string;
  selectedOptionId?: string;
};

export type ListeningMatchOption = {
  id: string;
  text: string;
};

export type ListeningPracticeTest = {
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  audioUrl?: string;
  multipleChoice: ListeningChoiceQuestion[];
  matchingQuestions: ListeningMatchQuestion[];
  matchingOptions: ListeningMatchOption[];
};

export const listeningPracticeTest: ListeningPracticeTest = {
  slug: 'presentation-on-houses-of-the-future',
  title: 'Presentation on houses of the future',
  subtitle: 'IELTS Listening Practice Test - Presentation on houses of the future',
  duration: '06:00',
  multipleChoice: [
    {
      id: 1,
      prompt: 'Which aspect of their presentation are Mia and Leo both concerned about?',
      options: ['meeting the deadline', 'finding suitable examples', 'including original ideas'],
    },
    {
      id: 2,
      prompt: 'The students decide to focus their assignment on housing for',
      options: ['family groups', 'old people', 'single people'],
    },
    {
      id: 3,
      prompt: 'The students agree that demand for accommodation in urban areas should be met by',
      options: ['repurposing offices and factories', 'constructing tall buildings', 'developing creative ideas for smaller homes'],
    },
  ],
  matchingQuestions: [
    { id: 4, prompt: 'use of roof space for gardens' },
    { id: 5, prompt: 'shared working spaces' },
    { id: 6, prompt: 'moveable internal walls' },
    { id: 7, prompt: 'smart mirrors in bathrooms' },
    { id: 8, prompt: 'bike sheds with charging points' },
    { id: 9, prompt: 'restriction of cars to certain areas' },
    { id: 10, prompt: 'communal vegetable plots' },
  ],
  matchingOptions: [
    { id: 'A', text: 'This could cause unnecessary anxiety' },
    { id: 'B', text: 'This would be especially beneficial for city residents' },
    { id: 'C', text: 'This would be challenging for young people' },
    { id: 'D', text: 'This would have environmental benefits' },
    { id: 'E', text: 'This could encourage creativity' },
    { id: 'F', text: 'This could lead to social problems' },
    { id: 'G', text: 'This could enable retired people to share a project' },
    { id: 'H', text: 'This would help some people but cause problems for others' },
    { id: 'I', text: 'This would suit both existing and new members of a household' },
  ],
};
