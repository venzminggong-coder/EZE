import React, { useState, useEffect } from 'react';
import { MODULES, PH_REGIONS, RANDOM_FACTS } from './constants';
import { DisasterModule, QuizItem, AppProgress, DisasterType, QuizConfig, DifficultyLevel } from './types';
import { generateExplanation, generateDailyTrivia } from './services/geminiService';
import { 
  BookOpen, 
  Trophy, 
  Map as MapIcon, 
  Home, 
  ChevronLeft, 
  CheckCircle, 
  XCircle, 
  Brain, 
  AlertTriangle,
  Flame,
  Microscope,
  Leaf,
  Info,
  Lightbulb,
  Timer,
  Pause,
  Play,
  RotateCcw,
  LogOut,
  Zap,
  Clock
} from 'lucide-react';

// --- Services & Utils ---
const STORAGE_KEY = 'readyph_progress_v2';

const saveProgress = (progress: AppProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const loadProgress = (): AppProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
      return JSON.parse(stored);
  }
  return {
    xp: 0,
    level: 1,
    completedModules: [],
    highScores: {},
    dailyStreak: 0,
    lastLoginDate: new Date().toISOString().split('T')[0],
    stats: {
        totalSecondsPlayed: 0,
        quizzesCompleted: 0,
        quizzesWon: 0,
        questionsAnswered: 0,
        totalAnswerTime: 0,
        modulesRead: [],
    }
  };
};

// Fisher-Yates Shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getLevel = (xp: number) => {
    return Math.floor(xp / 1000) + 1;
}

// --- Philippines SVG Map Component ---
const getHazardIcon = (type: DisasterType) => {
  switch (type) {
    case DisasterType.Earthquake: return '📉';
    case DisasterType.Typhoon: return '🌀';
    case DisasterType.Volcano: return '🌋';
    case DisasterType.Landslide: return '⛰️';
    case DisasterType.StormSurge: return '🌊';
    case DisasterType.Industrial: return '🏭';
    case DisasterType.Epidemic: return '🦠';
    default: return '⚠️';
  }
};

const PhilippinesMap = ({ onSelectRegion, selectedRegionId }: { onSelectRegion: (id: string) => void, selectedRegionId: string | null }) => {
    const regions = [
        { id: 'CAR', cx: 130, cy: 80, r: 15, label: 'CAR' },
        { id: 'R1', cx: 100, cy: 100, r: 15, label: 'I' },
        { id: 'R2', cx: 160, cy: 90, r: 18, label: 'II' },
        { id: 'R3', cx: 130, cy: 140, r: 15, label: 'III' },
        { id: 'NCR', cx: 130, cy: 170, r: 10, label: 'NCR' },
        { id: 'R4A', cx: 150, cy: 180, r: 15, label: 'IV-A' },
        { id: 'R4B', cx: 100, cy: 250, r: 20, label: 'IV-B' }, 
        { id: 'R5', cx: 190, cy: 230, r: 18, label: 'V' },
        { id: 'R6', cx: 150, cy: 300, r: 18, label: 'VI' },
        { id: 'R7', cx: 190, cy: 320, r: 15, label: 'VII' },
        { id: 'R8', cx: 230, cy: 280, r: 18, label: 'VIII' },
        { id: 'R9', cx: 130, cy: 400, r: 15, label: 'IX' },
        { id: 'R10', cx: 180, cy: 380, r: 15, label: 'X' },
        { id: 'R11', cx: 220, cy: 430, r: 15, label: 'XI' },
        { id: 'R12', cx: 170, cy: 430, r: 15, label: 'XII' },
        { id: 'R13', cx: 220, cy: 370, r: 15, label: 'XIII' },
        { id: 'BARMM', cx: 160, cy: 410, r: 15, label: 'BA' },
    ];

    return (
        <svg viewBox="0 0 300 500" className="w-full h-full drop-shadow-2xl">
            <defs>
              <filter id="shadow">
                  <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            <rect width="300" height="500" fill="#3b82f6" rx="20" opacity="0.1" />

            <path d="M130,50 L180,70 L190,130 L160,200 L240,260 L240,300 L200,350 L230,450 L150,480 L100,420 L100,300 L50,250 L80,200 L110,150 Z" fill="#86efac" stroke="#166534" strokeWidth="2" filter="url(#shadow)" />
            
            {regions.map((r) => {
                const isSelected = selectedRegionId === r.id;
                const regionData = PH_REGIONS.find(d => d.id === r.id);
                const primaryHazardIcon = regionData ? getHazardIcon(regionData.commonHazards[0]) : '';

                return (
                    <g key={r.id} onClick={() => onSelectRegion(r.id)} className="cursor-pointer hover:opacity-80">
                        <circle cx={r.cx} cy={r.cy+4} r={r.r} fill="#14532d" /> 
                        
                        <circle 
                            cx={r.cx} 
                            cy={r.cy} 
                            r={isSelected ? r.r + 5 : r.r} 
                            fill={isSelected ? '#2563eb' : '#fff'} 
                            stroke={isSelected ? '#fff' : '#15803d'}
                            strokeWidth="2"
                            className="transition-all duration-300 shadow-sm"
                        />
                        <circle cx={r.cx + 10} cy={r.cy - 10} r="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                        <text x={r.cx + 10} y={r.cy - 10} dy="0.3em" textAnchor="middle" fontSize="10">{primaryHazardIcon}</text>
                        
                        <text 
                            x={r.cx} 
                            y={r.cy} 
                            dy="0.3em" 
                            textAnchor="middle" 
                            className={`text-[8px] font-bold pointer-events-none ${isSelected ? 'fill-white' : 'fill-slate-800'}`}
                        >
                            {r.label}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

const GuideCharacter = ({ onClick, message }: { onClick: () => void, message: string }) => (
  <div className="absolute top-20 right-2 flex flex-col items-end cursor-pointer z-50 group" onClick={onClick}>
     <div className="bg-white p-2 rounded-xl rounded-br-none shadow-lg mb-1 max-w-[140px] text-[10px] border border-blue-100 relative animate-fade-in">
        <Lightbulb className="w-3 h-3 text-yellow-500 absolute -top-1.5 -left-1.5 bg-white rounded-full border" />
        <p className="text-gray-700 leading-tight font-medium italic">"{message}"</p>
     </div>
     <div className="text-3xl drop-shadow-md hover:scale-110 transition-transform">
        🧑‍🚒
     </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'menu' | 'moduleList' | 'learning' | 'difficultySelect' | 'quiz' | 'map'>('menu');
  const [activeModule, setActiveModule] = useState<DisasterModule | null>(null);
  const [appProgress, setAppProgress] = useState<AppProgress>(loadProgress());
  
  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [dailyTrivia, setDailyTrivia] = useState<QuizItem | null>(null);
  const [quizStartTime, setQuizStartTime] = useState(0); 

  // New Quiz Logic State
  const [activeQuestions, setActiveQuestions] = useState<QuizItem[]>([]);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({ difficulty: 'Medium', questionCount: 10, timePerQuestion: 20 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    saveProgress(appProgress);
  }, [appProgress]);

  // Screen Time Tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setAppProgress(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          totalSecondsPlayed: prev.stats.totalSecondsPlayed + 1
        }
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Daily Check
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (appProgress.lastLoginDate !== today) {
        setAppProgress(prev => ({
          ...prev, 
          lastLoginDate: today,
          dailyStreak: prev.dailyStreak + 1
        }));
        loadDailyTrivia();
    }
  }, []);

  // Timer Logic
  useEffect(() => {
    let timer: any;
    if (view === 'quiz' && !isPaused && !showResult && !quizFeedback && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && view === 'quiz' && !quizFeedback && !showResult) {
      handleAnswer(-1);
    }
    return () => clearInterval(timer);
  }, [view, isPaused, showResult, quizFeedback, timeLeft]);

  const loadDailyTrivia = async () => {
      const q = await generateDailyTrivia();
      if(q) {
          setDailyTrivia({
              id: 'daily', 
              question: q.question, 
              choices: q.choices, 
              correctIndex: q.correctIndex, 
              explanation: q.explanation
          });
      }
  }

  const startModule = (module: DisasterModule) => {
    setActiveModule(module);
    setAppProgress(prev => {
        const newRead = prev.stats.modulesRead.includes(module.id) 
            ? prev.stats.modulesRead 
            : [...prev.stats.modulesRead, module.id];
        return {
            ...prev,
            stats: { ...prev.stats, modulesRead: newRead }
        };
    });
    setView('learning');
  };

  const selectDifficulty = () => {
    setView('difficultySelect');
  };

  const initQuiz = (difficulty: DifficultyLevel) => {
    if (!activeModule) return;
    
    let config: QuizConfig = { difficulty, questionCount: 10, timePerQuestion: 20 };
    switch(difficulty) {
        case 'Easy': config = { difficulty, questionCount: 5, timePerQuestion: 30 }; break;
        case 'Medium': config = { difficulty, questionCount: 10, timePerQuestion: 20 }; break;
        case 'Hard': config = { difficulty, questionCount: 15, timePerQuestion: 15 }; break;
        case 'Intense': config = { difficulty, questionCount: 20, timePerQuestion: 10 }; break;
        case 'Impossible': config = { difficulty, questionCount: activeModule.quizItems.length, timePerQuestion: 5 }; break;
    }

    let questions = shuffleArray(activeModule.quizItems);
    config.questionCount = Math.min(config.questionCount, questions.length);
    const finalQuestions = questions.slice(0, config.questionCount);

    setQuizConfig(config);
    setActiveQuestions(finalQuestions);
    setCurrentQuizIndex(0);
    setScore(0);
    setShowResult(false);
    setQuizFeedback(null);
    setAiExplanation('');
    setTimeLeft(config.timePerQuestion);
    setQuizStartTime(Date.now());
    setIsPaused(false);
    setView('quiz');
  };

  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleQuit = () => setView('moduleList');
  const handleRestart = () => initQuiz(quizConfig.difficulty);

  const handleAnswer = async (choiceIndex: number) => {
    if (!activeModule) return;
    const currentQuestion = activeQuestions[currentQuizIndex];
    const timeTaken = (Date.now() - quizStartTime) / 1000;
    
    setAppProgress(prev => ({
        ...prev,
        stats: {
            ...prev.stats,
            questionsAnswered: prev.stats.questionsAnswered + 1,
            totalAnswerTime: prev.stats.totalAnswerTime + timeTaken
        }
    }));

    const isTimeout = choiceIndex === -1;
    const isCorrect = !isTimeout && choiceIndex === currentQuestion.correctIndex;

    setQuizFeedback(isTimeout ? 'timeout' : (isCorrect ? 'correct' : 'wrong'));
    
    if (isCorrect) {
      setScore(s => s + 10);
      setAiExplanation(currentQuestion.explanation);
    } else {
      if (!isTimeout) {
        setLoadingAi(true);
        const expl = await generateExplanation(
          currentQuestion.question, 
          currentQuestion.choices[currentQuestion.correctIndex], 
          activeModule.title
        );
        setAiExplanation(expl);
        setLoadingAi(false);
      } else {
        setAiExplanation("Time's up! Speed and knowledge are key to survival.");
      }
    }
  };

  const nextQuestion = () => {
    setQuizFeedback(null);
    setAiExplanation('');
    setQuizStartTime(Date.now());
    
    if (currentQuizIndex < activeQuestions.length - 1) {
      setCurrentQuizIndex(p => p + 1);
      setTimeLeft(quizConfig.timePerQuestion);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeModule) return;
    setShowResult(true);
    
    const maxScore = activeQuestions.length * 10;
    const isWin = score >= (maxScore * 0.6);
    
    setAppProgress(prev => {
      const newCompleted = new Set(prev.completedModules);
      if (isWin) newCompleted.add(activeModule.id);
      
      const newHighScores = { ...prev.highScores };
      const currentHigh = newHighScores[activeModule.id] || 0;
      if (score > currentHigh) newHighScores[activeModule.id] = score;

      const newXP = prev.xp + score;
      
      return {
        ...prev,
        xp: newXP,
        level: getLevel(newXP),
        completedModules: Array.from(newCompleted),
        highScores: newHighScores,
        stats: {
            ...prev.stats,
            quizzesCompleted: prev.stats.quizzesCompleted + 1,
            quizzesWon: isWin ? prev.stats.quizzesWon + 1 : prev.stats.quizzesWon,
        }
      };
    });
  };

  const nextFact = () => {
      setFactIndex(prev => (prev + 1) % RANDOM_FACTS.length);
  };

  // --- Views ---

  const renderMainMenu = () => (
    <div className="flex flex-col h-full p-6 space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">READYPH</h1>
          <p className="text-sm text-gray-500">Science-based preparedness.</p>
        </div>
        <div className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-2">
             <Zap size={14} className="text-yellow-500" />
             <span className="text-sm font-bold text-gray-700">LVL {appProgress.level} • {appProgress.xp} XP</span>
        </div>
      </header>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-2">Daily Trivia</h2>
          <p className="text-indigo-100 text-sm mb-4">Keep your {appProgress.dailyStreak} day streak alive!</p>
          <button 
            onClick={() => {
                if(dailyTrivia) {
                    const tempModule: DisasterModule = {
                        id: 'daily',
                        type: DisasterType.Earthquake,
                        title: 'Daily Trivia',
                        description: 'Daily Challenge',
                        learningContent: 'Quick test!',
                        icon: '📅',
                        color: 'bg-purple-500',
                        quizItems: [dailyTrivia]
                    }
                    setActiveModule(tempModule);
                    setActiveQuestions([dailyTrivia]);
                    setQuizConfig({ difficulty: 'Medium', questionCount: 1, timePerQuestion: 30 });
                    setCurrentQuizIndex(0);
                    setScore(0);
                    setShowResult(false);
                    setQuizFeedback(null);
                    setAiExplanation('');
                    setTimeLeft(30);
                    setQuizStartTime(Date.now());
                    setIsPaused(false);
                    setView('quiz');
                } else {
                   loadDailyTrivia().then(() => alert("Trivia loaded! Click again."));
                }
            }}
            className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-50 active:scale-95 transition-transform"
          >
            {dailyTrivia ? "Play Now" : "Loading Trivia..."}
          </button>
        </div>
        <Brain className="absolute -bottom-4 -right-4 text-white opacity-20 w-32 h-32" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setView('moduleList')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <BookOpen size={24} />
          </div>
          <span className="font-semibold text-gray-700">Learning</span>
        </button>

        <button 
          onClick={() => setView('map')}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <MapIcon size={24} />
          </div>
          <span className="font-semibold text-gray-700">Hazard Map</span>
        </button>
      </div>

      {/* Stats Summary Panel */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Trophy size={16} className="text-yellow-500" />
              Game Statistics
          </h3>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto no-scrollbar">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">Modules Won</span>
                  <span className="text-xl font-bold">{appProgress.stats.quizzesWon}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">Time Played</span>
                  <span className="text-xl font-bold">{(appProgress.stats.totalSecondsPlayed / 60).toFixed(0)}m</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">Avg Speed</span>
                  <span className="text-xl font-bold">{appProgress.stats.questionsAnswered > 0 ? (appProgress.stats.totalAnswerTime / appProgress.stats.questionsAnswered).toFixed(1) : 0}s</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">Streak</span>
                  <span className="text-xl font-bold flex items-center gap-1">{appProgress.dailyStreak} <Flame size={14} className="text-orange-500" /></span>
              </div>
          </div>
      </div>
    </div>
  );

  const renderModuleList = () => (
    <div className="p-4 space-y-4 pb-20">
        <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setView('menu')} className="p-2 hover:bg-gray-200 rounded-full"><ChevronLeft /></button>
            <h2 className="text-xl font-bold">Science Modules</h2>
        </div>
      {MODULES.map(module => (
        <div 
          key={module.id}
          onClick={() => startModule(module)}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
        >
          <div className={`w-14 h-14 ${module.color} rounded-lg flex items-center justify-center text-2xl shadow-inner shrink-0`}>
            {module.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">{module.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-1">{module.description}</p>
          </div>
          <div className="text-gray-400">
            <ChevronLeft className="rotate-180" size={18} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLearning = () => {
    if (!activeModule) return null;
    return (
      <div className="flex flex-col h-full bg-white">
        <div className={`p-6 ${activeModule.color} text-white`}>
           <button onClick={() => setView('moduleList')} className="mb-4 p-1 hover:bg-white/20 rounded-full"><ChevronLeft /></button>
           <h1 className="text-2xl font-bold flex items-center gap-2">
             {activeModule.icon} {activeModule.title}
           </h1>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
            <div className="prose prose-sm max-w-none text-gray-700">
                {activeModule.learningContent.split('\n').map((line, i) => {
                    if (line.startsWith('###')) return <h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3 border-b pb-1 border-gray-100">{line.replace('###', '')}</h3>
                    if (line.startsWith('•')) return <li key={i} className="ml-4 mb-2 list-disc pl-1">{line.replace('•', '').replace('**', '').replace('**', ': ')}</li>
                    if (line.startsWith('*')) return <li key={i} className="ml-4 mb-2 list-disc pl-1">{line.replace('*', '')}</li>
                    if (line.trim() === '') return <br key={i}/>
                    return <p key={i} className="mb-3 leading-relaxed">{line}</p>
                })}
            </div>
            <div className="h-20"></div>
        </div>
        <div className="p-4 border-t bg-white absolute bottom-0 w-full">
          <button 
            onClick={selectDifficulty}
            className={`w-full ${activeModule.color} text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all`}
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  };

  const renderDifficultySelect = () => {
    const difficulties: {level: DifficultyLevel, color: string, desc: string, time: string}[] = [
        { level: 'Easy', color: 'bg-green-100 text-green-700 border-green-200', desc: 'Relaxed pace.', time: '30s' },
        { level: 'Medium', color: 'bg-blue-100 text-blue-700 border-blue-200', desc: 'Standard challenge.', time: '20s' },
        { level: 'Hard', color: 'bg-orange-100 text-orange-700 border-orange-200', desc: 'Fast timer.', time: '15s' },
        { level: 'Intense', color: 'bg-red-100 text-red-700 border-red-200', desc: 'Rapid fire.', time: '10s' },
        { level: 'Impossible', color: 'bg-purple-900 text-white border-purple-950', desc: 'Master level.', time: '5s' },
    ];

    return (
        <div className="flex flex-col h-full bg-white p-6">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setView('learning')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
                <h2 className="text-xl font-bold">Select Difficulty</h2>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                {difficulties.map((d) => (
                    <button 
                        key={d.level}
                        onClick={() => initQuiz(d.level)}
                        className={`w-full p-4 rounded-xl border-2 flex flex-col items-start gap-1 transition-transform active:scale-[0.98] ${d.color}`}
                    >
                        <div className="flex justify-between w-full items-center">
                            <span className="font-bold text-lg">{d.level}</span>
                            <span className="text-xs font-mono bg-white/30 px-2 py-1 rounded">{d.time} / q</span>
                        </div>
                        <p className="text-sm opacity-90">{d.desc}</p>
                    </button>
                ))}
            </div>
        </div>
    );
  };

  const renderQuiz = () => {
    if (!activeModule) return null;
    
    if (showResult) {
      const maxScore = activeQuestions.length * 10;
      const percentage = (score / maxScore) * 100;
      const passed = percentage >= 60;

      return (
        <div className="flex flex-col h-full items-center justify-center p-8 text-center animate-fade-in bg-white">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {passed ? <Trophy size={48} /> : <AlertTriangle size={48} />}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{passed ? 'Success!' : 'Study More'}</h2>
          <p className="text-gray-500 mb-2">You earned {score} XP</p>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase mb-8 bg-gray-100 text-gray-600`}>{quizConfig.difficulty} Mode</span>
          
          <div className="w-full space-y-3">
            <button 
              onClick={() => setView('menu')}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200"
            >
              Back Home
            </button>
            <button 
              onClick={() => initQuiz(quizConfig.difficulty)}
              className={`w-full ${activeModule.color} text-white py-3 rounded-xl font-semibold shadow-md`}
            >
              Retry Quiz
            </button>
          </div>
        </div>
      );
    }

    const currentQ = activeQuestions[currentQuizIndex];
    const timerPercent = (timeLeft / quizConfig.timePerQuestion) * 100;
    const timerColor = timerPercent > 50 ? 'bg-green-500' : timerPercent > 20 ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
        {isPaused && (
            <div className="absolute inset-0 z-50 backdrop-blur-md bg-white/30 flex flex-col items-center justify-center p-8 animate-fade-in">
                <h2 className="text-4xl font-bold text-gray-800 mb-8">PAUSED</h2>
                <div className="flex flex-col w-full gap-4 max-w-xs">
                    <button onClick={handleResume} className="bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Play size={20}/> Resume</button>
                    <button onClick={handleQuit} className="bg-gray-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><LogOut size={20}/> Quit</button>
                </div>
            </div>
        )}
        
        <div className={`p-6 bg-white shadow-sm z-10 transition-all ${isPaused ? 'blur-sm' : ''}`}>
          <div className="flex justify-between items-center mb-4">
             <button onClick={handlePause} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Pause size={16}/></button>
             <div className="flex items-center gap-2">
                 <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded uppercase">{quizConfig.difficulty}</span>
                 <span className="text-sm font-bold text-blue-600">{score} XP</span>
             </div>
          </div>
          
          <div className="flex gap-2 mb-2 items-center">
             <div className="flex-1 bg-gray-200 rounded-full h-2">
                 <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${((currentQuizIndex + 1) / activeQuestions.length) * 100}%` }}></div>
             </div>
             <span className="text-xs font-mono text-gray-500">{currentQuizIndex + 1}/{activeQuestions.length}</span>
          </div>

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
             <div className={`h-full ${timerColor} transition-all duration-1000 ease-linear`} style={{ width: `${timerPercent}%` }}></div>
          </div>
          
          <h2 className="text-xl font-bold text-gray-800 leading-tight mt-4 min-h-[3.5rem]">{currentQ.question}</h2>
        </div>

        <div className={`flex-1 p-6 overflow-y-auto space-y-3 transition-all ${isPaused ? 'blur-sm' : ''}`}>
          {currentQ.choices.map((choice, idx) => {
            let btnClass = "w-full p-4 rounded-xl text-left border-2 transition-all font-medium text-gray-700 ";
            if (quizFeedback) {
              if (idx === currentQ.correctIndex) btnClass += "bg-green-100 border-green-500 text-green-800 ";
              else if (idx !== currentQ.correctIndex && quizFeedback === 'wrong') btnClass += "opacity-50 border-transparent bg-white ";
              else btnClass += "bg-white border-transparent shadow-sm ";
            } else {
              btnClass += "bg-white border-transparent shadow-sm hover:border-blue-300 active:scale-[0.99] ";
            }

            return (
              <button
                key={idx}
                disabled={!!quizFeedback}
                onClick={() => handleAnswer(idx)}
                className={btnClass}
              >
                {choice}
              </button>
            );
          })}

          {quizFeedback && (
            <div className="mt-6 animate-fade-in pb-20">
              <div className={`p-4 rounded-xl border-l-4 shadow-sm ${quizFeedback === 'correct' ? 'bg-green-50 text-green-800 border-green-500' : 'bg-red-50 text-red-800 border-red-500'}`}>
                <div className="flex items-center gap-2 font-bold mb-2 text-lg">
                  {quizFeedback === 'correct' ? <CheckCircle size={24} /> : (quizFeedback === 'timeout' ? <Timer size={24} /> : <XCircle size={24} />)}
                  {quizFeedback === 'correct' ? 'Correct!' : (quizFeedback === 'timeout' ? 'Time Up!' : 'Wrong Answer')}
                </div>
                
                <div className="bg-white/60 p-3 rounded-lg text-sm leading-relaxed mb-2">
                    <span className="font-bold block mb-1">Explanation:</span>
                    {loadingAi ? "Loading AI analysis..." : aiExplanation}
                </div>
              </div>
              <button 
                onClick={nextQuestion}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                {currentQuizIndex === activeQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMap = () => {
      const regionInfo = selectedRegionId ? PH_REGIONS.find(r => r.id === selectedRegionId) : null;

      return (
    <div className="flex flex-col h-full bg-blue-50 animate-fade-in relative overflow-hidden">
      <div className="p-4 border-b flex items-center gap-2 z-10 bg-white/90 backdrop-blur-sm shadow-sm absolute w-full top-0">
         <button onClick={() => setView('menu')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft /></button>
         <div>
            <h2 className="text-xl font-bold leading-none">Hazard Map</h2>
            <p className="text-xs text-gray-500">Tap regions for regional analysis</p>
         </div>
      </div>
      
      <div className="flex-1 relative flex items-center justify-center p-4 bg-gradient-to-b from-blue-200 to-blue-300" style={{ perspective: '1000px' }}>
        <div style={{ transform: 'rotateX(25deg) scale(0.9)', transformStyle: 'preserve-3d', transition: 'transform 0.5s' }}>
            <PhilippinesMap onSelectRegion={setSelectedRegionId} selectedRegionId={selectedRegionId} />
        </div>
        <GuideCharacter onClick={nextFact} message={RANDOM_FACTS[factIndex]} />
      </div>

      <div className="max-h-[40%] overflow-y-auto p-6 bg-white border-t rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 relative no-scrollbar">
             {regionInfo ? (
                 <div className="animate-slide-up pb-10">
                     <div className="flex justify-between items-start mb-4">
                         <h3 className="text-2xl font-bold text-gray-800 w-3/4">{regionInfo.name}</h3>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${regionInfo.riskLevel === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            {regionInfo.riskLevel} Risk
                         </span>
                     </div>
                     
                     <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {regionInfo.commonHazards.map(h => (
                                <span key={h} className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold border border-gray-200 uppercase tracking-wide">
                                    {getHazardIcon(h)} {h}
                                </span>
                            ))}
                        </div>
                     </div>
                     
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-900 text-sm leading-relaxed flex gap-3">
                        <AlertTriangle className="shrink-0 mt-1 text-blue-500" size={18} />
                        <div>
                            {regionInfo.info.split('\n').map((line, i) => (
                                <p key={i} className="mb-2">{line.replace('•', '').trim()}</p>
                            ))}
                        </div>
                     </div>
                 </div>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center pb-6">
                     <MapIcon size={48} className="mb-2 opacity-20"/>
                     <p className="text-sm">Select a region to view<br/>specific hazard data.</p>
                 </div>
             )}
      </div>
    </div>
  )};

  const BottomNav = () => (
    <div className="bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-safe absolute bottom-0 w-full z-20">
      <button onClick={() => setView('menu')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${view === 'menu' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home size={22} />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button onClick={() => setView('moduleList')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${['moduleList','learning','difficultySelect', 'quiz'].includes(view) ? 'text-blue-600' : 'text-gray-400'}`}>
        <BookOpen size={22} />
        <span className="text-[10px] font-medium">Learn</span>
      </button>
      <button onClick={() => setView('map')} className={`p-2 rounded-xl flex flex-col items-center gap-1 ${view === 'map' ? 'text-blue-600' : 'text-gray-400'}`}>
        <MapIcon size={22} />
        <span className="text-[10px] font-medium">Map</span>
      </button>
    </div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative font-sans text-gray-900 flex flex-col">
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
        {view === 'menu' && renderMainMenu()}
        {view === 'moduleList' && renderModuleList()}
        {view === 'learning' && renderLearning()}
        {view === 'difficultySelect' && renderDifficultySelect()}
        {view === 'quiz' && renderQuiz()}
        {view === 'map' && renderMap()}
      </div>

      {view !== 'quiz' && view !== 'learning' && view !== 'difficultySelect' && <BottomNav />}
    </div>
  );
}
