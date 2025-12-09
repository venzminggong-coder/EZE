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
  icon: string; // Emoji or Lucide icon name
  color: string;
  quizItems: QuizItem[];
}

export interface PlayerStats {
  totalSecondsPlayed: number;
  quizzesCompleted: number;
  quizzesWon: number;
  questionsAnswered: number;
  totalAnswerTime: number; // in seconds, to calc average
  modulesRead: string[]; // unique IDs
  dailyQuestsCleared: number;
  highestRank: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: (stats: PlayerStats, progress: UserProgress) => boolean;
  rewardType: 'xp' | 'avatar' | 'border';
  rewardValue: string | number;
}

export interface CosmeticItem {
  id: string;
  type: 'avatar' | 'border';
  content: string; // Emoji char or CSS class for border
  name: string;
  unlockDesc: string;
}

export interface UserProgress {
  userId: string;
  username: string;
  bio: string;
  profileImage?: string; // Base64
  album: string[]; // Array of Base64 strings
  
  xp: number;
  level: number;
  completedModules: string[];
  highScores: Record<string, number>; // moduleID -> score
  dailyStreak: number;
  lastLoginDate: string;
  
  stats: PlayerStats;
  unlockedAchievements: string[];
  unlockedCosmetics: string[];
  currentAvatar: string;
  currentBorder: string;
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
  timePerQuestion: number; // in seconds
}

export interface Rank {
  id: string;
  name: string;
  minXp: number;
  icon: string;
}
