export enum DisasterType {
  Earthquake = 'Earthquake',
  Typhoon = 'Typhoon',
  Volcano = 'Volcanic Eruption',
  Landslide = 'Landslide',
  StormSurge = 'Storm Surge',
  Industrial = 'Industrial Hazard',
  Epidemic = 'Epidemic'
}

export interface QuizItem {
  id: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export interface DisasterModule {
  id: string;
  type: DisasterType;
  title: string;
  description: string;
  learningContent: string;
  icon: string;
  color: string;
  quizItems: QuizItem[];
}

export interface PlayerStats {
  totalSecondsPlayed: number;
  quizzesCompleted: number;
  quizzesWon: number;
  questionsAnswered: number;
  totalAnswerTime: number;
  modulesRead: string[];
}

export interface AppProgress {
  xp: number;
  level: number;
  completedModules: string[];
  highScores: Record<string, number>;
  dailyStreak: number;
  lastLoginDate: string;
  stats: PlayerStats;
}

export interface RegionData {
  id: string;
  name: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  commonHazards: DisasterType[];
  info: string;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Intense' | 'Impossible';

export interface QuizConfig {
  difficulty: DifficultyLevel;
  questionCount: number;
  timePerQuestion: number;
}
