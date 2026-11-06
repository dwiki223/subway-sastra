export type GameState = 'start' | 'playing' | 'checkpoint' | 'paused' | 'gameover';

export type PoemType = 'pantun' | 'syair' | 'gurindam';

export interface Question {
  id: string;
  category: PoemType | 'perbandingan';
  poemText?: string[]; // lines of the poem
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  topic: string; // e.g., 'Ciri-Ciri', 'Amanat', 'Rima', 'Melengkapi Larik'
  difficulty: 'mudah' | 'sedang' | 'sulit';
}

export interface PlayerStats {
  score: number;
  highScore: number;
  distance: number; // in meters
  coins: number;
  lives: number; // starts with 3
  checkpointInterval: number; // every X meters (default 100m)
  nextCheckpointAt: number; // distance of upcoming checkpoint
  checkpointsCleared: number;
  correctAnswersCount: number;
  totalQuestionsAnswered: number;
  speed: number;
  multiplier: number;
  hasShield: boolean;
  magnetTimeLeft: number;
  doublePointsTimeLeft: number;
}

export type CharacterOutfit = 'smp' | 'street' | 'batik' | 'cyber';

export interface SkinOption {
  id: CharacterOutfit;
  name: string;
  description: string;
  shirtColor: string;
  pantsColor: string;
  accentColor: string;
  unlocked: boolean;
  cost: number;
}

export interface AnswerHistory {
  question: Question;
  selectedOption: number;
  isCorrect: boolean;
  checkpointDistance: number;
}
