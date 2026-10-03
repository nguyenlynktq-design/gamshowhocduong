export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: OptionKey;
  rationale: string;
  levelLabel?: string;
  aiHint: string;
}

export type GameMode = 10 | 15;

export interface LifelinesState {
  '5050': boolean;
  audience: boolean;
  ai: boolean;
  switch: boolean;
}

export interface ExternalWebsiteConfig {
  url: string;
  title: string;
}
