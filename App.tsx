
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MODULES, PH_REGIONS, RANDOM_FACTS, CHARACTERS, CHARACTER_QUOTES } from './constants';
import { DisasterModule, QuizItem, AppProgress, DisasterType, QuizConfig, DifficultyLevel, Character, RegionData } from './types';
import { generateDailyTrivia, generateExplanation } from './services/geminiService';
import { 
  BookOpen, 
  Map as MapIcon, 
  Home, 
  ChevronLeft, 
  CheckCircle, 
  Brain, 
  Zap, 
  MessageCircle, 
  ShieldAlert, 
  Loader2,
  Info,
  Search,
  Users,
  AlertTriangle,
  Pause,
  Play,
  Clock,
  RotateCcw
} from 'lucide-react';

// --- Services & Utils ---
const STORAGE_KEY = 'readyph_v7_state';

const saveProgress = (progress: AppProgress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const loadProgress = (): AppProgress => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
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

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const getLevel = (xp: number) => Math.floor(xp / 1000) + 1;

const getModuleBorderClass = (type: DisasterType) => {
  switch (type) {
    case DisasterType.Earthquake: return 'border-earthquake';
    case DisasterType.Typhoon: return 'border-typhoon';
    case DisasterType.Volcano: return 'border-volcano';
    case DisasterType.Fire: return 'border-fire';
    case DisasterType.Landslide: return 'border-landslide';
    case DisasterType.StormSurge: return 'border-stormsurge';
    case DisasterType.Industrial: return 'border-industrial';
    case DisasterType.Epidemic: return 'border-epidemic';
    default: return 'border-slate-200 border-4 rounded-3xl';
  }
};

const getDifficultyTimer = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case 'Easy': return 30;
    case 'Medium': return 20;
    case 'Hard': return 15;
    case 'Intense': return 10;
    case 'Impossible': return 5;
    default: return 20;
  }
};

// --- Components ---

const FiremanCharacter: React.FC<{ active: boolean, onTalk: () => void, quote: string, showQuote: boolean }> = ({ active, onTalk, quote, showQuote }) => {
  const char = CHARACTERS[0]; // Chief Ramos
  return (
    <div className="flex flex-col items-center cursor-pointer transition-all duration-300 relative" onClick={onTalk}>
      {/* Fixed: Moved chat bubble outside the fireman image container and added z-index fix */}
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${showQuote ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white p-4 rounded-2xl text-[11px] font-bold text-center w-60 shadow-2xl relative mb-2">
          {quote}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
        </div>
      </div>
      
      <div className="relative animate-float">
        <div className="absolute -inset-2 bg-orange-400 rounded-full blur opacity-20 group-hover:opacity-40 transition"></div>
        <div className="relative bg-white p-5 rounded-full shadow-xl border-4 border-slate-50 flex items-center justify-center text-6xl select-none">
           {char.emoji}
        </div>
        <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-1.5 rounded-full animate-bounce shadow-lg">
          <MessageCircle size={14} />
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full shadow-sm">{char.name}</p>
        <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Chief Safety Bot</p>
      </div>
    </div>
  );
};

const CharacterCard: React.FC<{ character: Character, onClick?: () => void }> = ({ character, onClick }) => (
  <div onClick={onClick} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all cursor-pointer">
    <div className={`w-12 h-12 ${character.color} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
      {character.emoji}
    </div>
    <div className="flex-1">
      <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none">{character.name}</h5>
      <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{character.role}</p>
    </div>
  </div>
);

const DetailedPHMap: React.FC<{ onSelectRegion: (id: string) => void, selectedId: string | null }> = ({ onSelectRegion, selectedId }) => {
  return (
    <div className="relative w-full h-full bg-sky-50 rounded-[2rem] overflow-hidden border border-sky-100 shadow-inner flex flex-col">
      <div className="p-4 pb-2 flex justify-between items-center bg-white/60 backdrop-blur-sm border-b border-sky-100 shrink-0">
         <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-widest">Digital Hazard Atlas</h3>
         <div className="flex gap-1">
            <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
         </div>
      </div>
      <div className="flex-1 overflow-hidden relative p-2 flex items-center justify-center">
        {/* Scaled for better mobile view */}
        <svg viewBox="0 0 300 550" className="max-h-full max-w-full drop-shadow-xl overflow-visible">
           <defs>
             <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
               <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
               <feOffset dx="0" dy="2" result="offsetblur" />
               <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
               <feMerge>
                 <feMergeNode /><feMergeNode in="SourceGraphic" />
               </feMerge>
             </filter>
           </defs>
           
           {/* Detailed Mapping Shapes */}
           <path d="M70,30 L90,20 L110,30 L130,50 L140,80 L120,130 L90,140 L70,100 Z" fill="#2ecc71" className="map-path" stroke="#27ae60" strokeWidth="1" onClick={() => onSelectRegion('R1')} />
           <path d="M100,40 L130,50 L140,90 L120,120 L100,90 Z" fill="#1e8449" className="map-path" stroke="#145a32" strokeWidth="1" onClick={() => onSelectRegion('CAR')} />
           <path d="M130,50 L180,60 L195,110 L160,145 L130,120 Z" fill="#2ecc71" className="map-path" stroke="#27ae60" strokeWidth="1" onClick={() => onSelectRegion('R2')} />
           <path d="M90,140 L135,155 L150,190 L120,200 L85,175 Z" fill="#229954" className="map-path" stroke="#196f3d" strokeWidth="1" onClick={() => onSelectRegion('R3')} />
           <circle cx="115" cy="190" r="10" fill="#e74c3c" className="map-path animate-pulse" onClick={() => onSelectRegion('NCR')} />
           <path d="M120,200 L165,210 L175,250 L140,270 L110,240 Z" fill="#c0392b" className="map-path" stroke="#922b21" strokeWidth="1" onClick={() => onSelectRegion('R4A')} />
           <path d="M50,220 L100,240 L105,300 L40,280 Z" fill="#27ae60" className="map-path" stroke="#1e8449" strokeWidth="1" onClick={() => onSelectRegion('R4B')} />
           <path d="M175,240 L220,260 L205,320 L165,300 Z" fill="#a93226" className="map-path" stroke="#7b241c" strokeWidth="1" onClick={() => onSelectRegion('R5')} />
           <path d="M90,310 L135,320 L145,370 L105,380 Z" fill="#2ecc71" className="map-path" stroke="#27ae60" strokeWidth="1" onClick={() => onSelectRegion('R6')} />
           <path d="M145,360 L180,370 L170,410 L135,400 Z" fill="#d35400" className="map-path" stroke="#a04000" strokeWidth="1" onClick={() => onSelectRegion('R7')} />
           <path d="M185,310 L225,330 L210,390 L175,370 Z" fill="#e67e22" className="map-path" stroke="#d35400" strokeWidth="1" onClick={() => onSelectRegion('R8')} />
           <path d="M70,420 L130,430 L120,480 L65,470 Z" fill="#27ae60" className="map-path" stroke="#1e8449" strokeWidth="1" onClick={() => onSelectRegion('R9')} />
           <path d="M140,420 L195,430 L185,470 L135,460 Z" fill="#2ecc71" className="map-path" stroke="#27ae60" strokeWidth="1" onClick={() => onSelectRegion('R10')} />
           <path d="M210,440 L260,450 L245,520 L200,510 Z" fill="#ba4a00" className="map-path" stroke="#935116" strokeWidth="1" onClick={() => onSelectRegion('R11')} />
           <path d="M150,470 L210,480 L200,540 L140,530 Z" fill="#28b463" className="map-path" stroke="#1d8348" strokeWidth="1" onClick={() => onSelectRegion('R12')} />
           <path d="M220,400 L265,410 L255,460 L210,450 Z" fill="#1d8348" className="map-path" stroke="#145a32" strokeWidth="1" onClick={() => onSelectRegion('R13')} />
           <path d="M125,460 L155,470 L145,510 L115,500 Z" fill="#145a32" className="map-path" stroke="#0b3b17" strokeWidth="1" onClick={() => onSelectRegion('BARMM')} />

           {/* Precision Markers */}
           {PH_REGIONS.map(r => (
             <g key={r.id} onClick={() => onSelectRegion(r.id)} className="cursor-pointer">
               <circle cx={r.coordinates.x} cy={r.coordinates.y} r={selectedId === r.id ? 8 : 4} fill={selectedId === r.id ? '#3b82f6' : '#fff'} stroke="#1e293b" strokeWidth="1" className="transition-all" />
               {selectedId === r.id && <circle cx={r.coordinates.x} cy={r.coordinates.y} r="12" fill="none" stroke="#3b82f6" strokeWidth="1" className="animate-ping" />}
             </g>
           ))}
        </svg>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'menu' | 'moduleList' | 'learning' | 'difficultySelect' | 'quiz' | 'map'>('menu');
  const [activeModule, setActiveModule] = useState<DisasterModule | null>(null);
  const [appProgress, setAppProgress] = useState<AppProgress>(loadProgress());
  
  // UI State
  const [charQuote, setCharQuote] = useState(CHARACTER_QUOTES['Fireman'][0]);
  const [showQuote, setShowQuote] = useState(false);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  
  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | 'timeout' | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<DifficultyLevel>('Medium');
  
  // Fix: Replaced NodeJS.Timeout with 'any' to avoid the "Namespace 'global.NodeJS' has no exported member 'Timeout'" error.
  const timerRef = useRef<any>(null);

  useEffect(() => { saveProgress(appProgress); }, [appProgress]);

  // Global app timer for total seconds played
  useEffect(() => {
    const interval = setInterval(() => {
      setAppProgress(prev => ({
        ...prev,
        stats: { ...prev.stats, totalSecondsPlayed: prev.stats.totalSecondsPlayed + 1 }
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Quiz Timer Effect
  useEffect(() => {
    if (view === 'quiz' && !isPaused && !showResult && !quizFeedback && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    if (timeLeft === 0 && view === 'quiz' && !quizFeedback && !showResult && !isPaused) {
      handleAnswer(-1); // Timeout
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [view, isPaused, showResult, quizFeedback, timeLeft]);

  const cycleQuote = () => {
    const quotes = CHARACTER_QUOTES['Fireman'];
    setCharQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    setShowQuote(true);
    setTimeout(() => setShowQuote(false), 4000);
  };

  const handleAnswer = async (choiceIndex: number) => {
    if (!activeModule) return;
    const currentQuestion = activeQuestions[currentQuizIndex];
    const isTimeout = choiceIndex === -1;
    const isCorrect = !isTimeout && choiceIndex === currentQuestion.correctIndex;
    
    setQuizFeedback(isTimeout ? 'timeout' : (isCorrect ? 'correct' : 'wrong'));
    
    if (isCorrect) {
      setScore(s => s + 10);
      setAiExplanation(currentQuestion.explanation);
    } else {
      setIsAiLoading(true);
      const userChoiceText = isTimeout ? "Ran out of time" : currentQuestion.choices[choiceIndex];
      const explanation = await generateExplanation(
        currentQuestion.question,
        currentQuestion.choices[currentQuestion.correctIndex],
        `Disaster Study: ${activeModule.type}. The user's answer: "${userChoiceText}". Briefly explain the mistake as a supportive fireman.`
      );
      setAiExplanation(explanation);
      setIsAiLoading(false);
    }
  };

  const initQuiz = (difficulty: DifficultyLevel) => {
    if (!activeModule) return;
    let questions = shuffleArray(activeModule.quizItems);
    const countMap = { 'Easy': 5, 'Medium': 8, 'Hard': 12, 'Intense': 15, 'Impossible': 20 };
    setActiveQuestions(questions.slice(0, countMap[difficulty] || 5));
    setCurrentQuizIndex(0);
    setScore(0);
    setShowResult(false);
    setQuizFeedback(null);
    setAiExplanation('');
    setQuizDifficulty(difficulty);
    setTimeLeft(getDifficultyTimer(difficulty));
    setIsPaused(false);
    setView('quiz');
  };

  // --- Views ---

  const renderMainMenu = () => (
    <div className="flex flex-col h-full p-6 space-y-6 animate-fade-in no-scrollbar overflow-y-auto pb-32">
      <header className="flex justify-between items-center shrink-0">
        <h1 className="text-3xl animate-logo">READYPH</h1>
        <div className="bg-white px-3 py-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
             <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-black text-[10px]">L{appProgress.level}</div>
             <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{appProgress.xp} XP</span>
        </div>
      </header>

      {/* FIREMAN INTERACTIVE BOX */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col items-center relative group shrink-0">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-rose-600 rounded-t-[2.5rem]"></div>
        <FiremanCharacter 
          active={showQuote} 
          onTalk={cycleQuote} 
          quote={charQuote} 
          showQuote={showQuote}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 shrink-0">
        <button onClick={() => setView('moduleList')} className="bg-indigo-600 p-8 rounded-[2rem] shadow-lg text-white flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
          <BookOpen size={32} />
          <span className="font-black text-[10px] uppercase tracking-widest">Training</span>
        </button>
        <button onClick={() => setView('map')} className="bg-emerald-600 p-8 rounded-[2rem] shadow-lg text-white flex flex-col items-center justify-center gap-3 active:scale-95 transition-all">
          <MapIcon size={32} />
          <span className="font-black text-[10px] uppercase tracking-widest">Atlas</span>
        </button>
      </div>

      <div className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shrink-0">
         <div className="flex items-center gap-3 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="text-[9px] font-black uppercase tracking-widest text-amber-400">Readiness Pulse</h3>
         </div>
         <p className="text-[12px] font-bold text-slate-300 leading-relaxed z-10">
           {RANDOM_FACTS[appProgress.level % RANDOM_FACTS.length]}
         </p>
      </div>
    </div>
  );

  const renderMap = () => {
    const region = selectedRegionId ? PH_REGIONS.find(r => r.id === selectedRegionId) : null;
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
         <header className="p-4 flex items-center gap-4 border-b bg-white shrink-0">
            <button onClick={() => setView('menu')} className="p-2 bg-slate-50 rounded-xl"><ChevronLeft size={20}/></button>
            <h2 className="text-xl font-black tracking-tighter">Philippine Atlas</h2>
         </header>

         <div className="flex-1 overflow-hidden flex flex-col">
            <div className="h-[55%] p-4">
              <DetailedPHMap onSelectRegion={setSelectedRegionId} selectedId={selectedRegionId} />
            </div>
            
            <div className="h-[45%] overflow-y-auto no-scrollbar p-4 pt-0">
              {region ? (
                <div className="animate-slide-up space-y-4 pb-8">
                   <div className="p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden" style={{ backgroundColor: region.color }}>
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h4 className="text-2xl font-black tracking-tighter leading-none">{region.name}</h4>
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1 block">{region.islandGroup}</span>
                         </div>
                         <div className="bg-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                            {region.riskLevel} Risk
                         </div>
                      </div>
                      <p className="text-[12px] font-bold leading-relaxed mb-4 opacity-90">{region.info}</p>
                      <div className="flex flex-wrap gap-2">
                         {region.commonHazards.map(h => (
                           <div key={h} className="bg-white/10 p-1.5 px-3 rounded-full flex items-center gap-1.5 border border-white/5">
                              <ShieldAlert size={10} className="text-white" />
                              <span className="text-[8px] font-black uppercase tracking-widest">{h}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                         <Info size={12} /> Detailed Diagnostics
                      </h5>
                      <ul className="space-y-3">
                         {region.details.map((d, i) => (
                           <li key={i} className="flex gap-3 text-[11px] font-bold text-slate-600 leading-tight">
                              <span className="text-emerald-500">•</span> {d}
                           </li>
                         ))}
                      </ul>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-8 bg-white rounded-[2rem] border border-slate-100 h-full justify-center">
                   <Search size={40} className="text-slate-100 mb-4" />
                   <h4 className="text-sm font-black text-slate-800 mb-1 uppercase tracking-tight">Interactive Atlas</h4>
                   <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">Select a region marker on the map.</p>
                </div>
              )}
            </div>
         </div>
      </div>
    );
  };

  const renderModuleList = () => (
    <div className="flex flex-col h-full bg-slate-50 animate-fade-in">
        <header className="p-6 flex items-center gap-4 border-b bg-white shrink-0">
            <button onClick={() => setView('menu')} className="p-3 bg-slate-50 rounded-2xl"><ChevronLeft size={20}/></button>
            <h2 className="text-2xl font-black tracking-tighter">Calamity Files</h2>
        </header>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-32">
          {MODULES.map(m => (
            <div key={m.id} onClick={() => { setActiveModule(m); setView('learning'); }} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-5 cursor-pointer active:scale-95 transition-all group">
              <div className={`w-14 h-14 ${m.color} rounded-2xl flex items-center justify-center text-3xl shadow-inner`}>{m.icon}</div>
              <div className="flex-1">
                <h3 className="font-black text-slate-800 text-sm tracking-tight leading-none">{m.title}</h3>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Study Drill Available</p>
              </div>
              <div className="text-slate-200"><ChevronLeft className="rotate-180" size={16} /></div>
            </div>
          ))}
        </div>
    </div>
  );

  const renderLearning = () => {
    if (!activeModule) return null;
    const borderClass = getModuleBorderClass(activeModule.type);
    return (
      <div className="flex flex-col h-full bg-white animate-fade-in relative">
        <div className={`p-8 ${activeModule.color} text-white shrink-0 rounded-b-[2rem] shadow-lg`}>
           <button onClick={() => setView('moduleList')} className="mb-6 p-3 bg-white/20 rounded-2xl backdrop-blur-md"><ChevronLeft size={20}/></button>
           <div className="flex items-center gap-5">
              <div className="text-6xl drop-shadow-lg">{activeModule.icon}</div>
              <h1 className="text-2xl font-black tracking-tighter leading-tight">{activeModule.title}</h1>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
            <div className={`p-6 bg-white ${borderClass} mb-8`}>
                <div className="space-y-8">
                    {activeModule.learningContent.split('###').map((section, i) => {
                        if (!section.trim()) return null;
                        const lines = section.trim().split('\n');
                        const title = lines[0];
                        const content = lines.slice(1);
                        return (
                          <div key={i} className="animate-slide-up">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                               <ShieldAlert size={14} className="text-rose-500" /> {title}
                            </h4>
                            <div className="text-[13px] font-bold text-slate-700 leading-relaxed space-y-2">
                                {content.map((l, j) => (
                                  <div key={j} className="bg-slate-50/50 p-3 rounded-xl border-l-4 border-slate-200">
                                    {l.replace('•', '').trim()}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                    })}
                </div>
            </div>
        </div>
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
            <button onClick={() => setView('difficultySelect')} className={`w-full ${activeModule.color} text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-transform`}>Initiate Quiz Simulation</button>
        </div>
      </div>
    );
  };

  const renderDifficultySelect = () => (
    <div className="flex flex-col h-full bg-slate-50 p-8 animate-fade-in">
        <button onClick={() => setView('learning')} className="mb-10 p-3 bg-white rounded-2xl self-start shadow-sm"><ChevronLeft size={20}/></button>
        <h2 className="text-4xl font-black tracking-tighter mb-2">Set Simulation</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Timer decreases as difficulty rises.</p>
        <div className="space-y-3 overflow-y-auto no-scrollbar pb-10">
            {(['Easy', 'Medium', 'Hard', 'Intense', 'Impossible'] as DifficultyLevel[]).map(d => {
              const seconds = getDifficultyTimer(d);
              return (
                <button key={d} onClick={() => initQuiz(d)} className="w-full bg-white p-5 rounded-[1.5rem] border-2 border-slate-100 flex items-center justify-between group active:scale-95 transition-all hover:border-indigo-500 shadow-sm">
                    <div className="text-left">
                      <span className="font-black text-[12px] uppercase tracking-widest text-slate-800 block">{d}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Timer: {seconds}s per item</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ChevronLeft className="rotate-180" size={16} />
                    </div>
                </button>
              );
            })}
        </div>
    </div>
  );

  const renderQuiz = () => {
    if (!activeModule || !activeQuestions[currentQuizIndex]) return null;
    if (showResult) {
       return (
         <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white animate-fade-in">
            <div className="w-48 h-48 bg-emerald-50 rounded-[3rem] flex items-center justify-center text-7xl mb-10 shadow-inner">🏆</div>
            <h2 className="text-4xl font-black tracking-tighter mb-4">Mission Success</h2>
            <div className="bg-slate-50 p-8 rounded-[2rem] w-full mb-10 border border-slate-100">
               <span className="text-6xl font-black text-indigo-600 tracking-tighter">{score} XP</span>
            </div>
            <button onClick={() => setView('menu')} className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest shadow-xl">Complete debriefing</button>
         </div>
       );
    }

    const q = activeQuestions[currentQuizIndex];
    const progress = ((currentQuizIndex + 1) / activeQuestions.length) * 100;

    return (
      <div className="flex flex-col h-full bg-white relative">
        <header className="p-6 border-b shrink-0 bg-white z-10">
           <div className="flex justify-between items-center mb-6">
              <button onClick={() => setIsPaused(true)} className="p-2 bg-slate-100 rounded-lg text-slate-600"><Pause size={18}/></button>
              <div className="flex items-center gap-4">
                 <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${timeLeft <= 5 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'}`}>
                    <Clock size={12} /> {timeLeft}s
                 </div>
                 <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                    {currentQuizIndex + 1}/{activeQuestions.length}
                 </div>
              </div>
           </div>
           <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
           <h2 className="text-[17px] font-black text-slate-800 leading-snug mt-6 min-h-[4rem]">{q.question}</h2>
        </header>

        <div className="flex-1 p-6 space-y-3 overflow-y-auto no-scrollbar pb-32">
           {q.choices.map((choice, idx) => {
              const isSelected = quizFeedback && idx === q.correctIndex;
              let choiceClass = "w-full p-5 rounded-[1.2rem] text-left border-2 transition-all font-black text-[12px] uppercase tracking-tight flex items-center justify-between ";
              if (quizFeedback) {
                  if (idx === q.correctIndex) choiceClass += "bg-emerald-50 border-emerald-500 text-emerald-800 scale-[1.02] ";
                  else choiceClass += "opacity-40 border-slate-100 bg-white ";
              } else {
                  choiceClass += "bg-white border-transparent shadow-sm active:scale-[0.98] ";
              }
              return (
                <button key={idx} disabled={!!quizFeedback || isPaused} onClick={() => handleAnswer(idx)} className={choiceClass}>
                  <span>{choice}</span>
                  {isSelected && <CheckCircle className="text-emerald-500" size={18} />}
                </button>
              );
           })}

           {quizFeedback && (
             <div className="mt-6 animate-slide-up pb-20">
                <div className="p-6 rounded-[2rem] bg-slate-900 text-white shadow-xl relative border-t-4 border-amber-500">
                  <div className="flex items-center gap-2 font-black mb-4 text-[9px] uppercase tracking-widest text-amber-400">
                    {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <Brain size={14} />} 
                    AI Protocol Briefing
                  </div>
                  <div className="text-[13px] font-bold leading-relaxed text-slate-200">
                    {isAiLoading ? "Consulting HQ database..." : aiExplanation}
                  </div>
                  {!isAiLoading && (
                    <button onClick={() => { 
                      setQuizFeedback(null); 
                      if (currentQuizIndex < activeQuestions.length - 1) {
                        setCurrentQuizIndex(prev => prev + 1);
                        setTimeLeft(getDifficultyTimer(quizDifficulty));
                      } else {
                        setShowResult(true);
                      }
                    }} className="w-full mt-6 bg-white text-slate-900 py-4 rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest shadow-lg">Proceed</button>
                  )}
                </div>
             </div>
           )}
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-10 text-center animate-fade-in">
             <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Pause size={48} />
             </div>
             <h3 className="text-3xl font-black tracking-tighter mb-2 uppercase italic text-slate-800">Simulation Paused</h3>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Hazard assessment temporarily suspended.</p>
             <div className="w-full space-y-4">
                <button onClick={() => setIsPaused(false)} className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                   <Play size={18} fill="currentColor" /> Resume Drill
                </button>
                <button onClick={() => setView('difficultySelect')} className="w-full bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3">
                   <RotateCcw size={18} /> Abort & Restart
                </button>
             </div>
          </div>
        )}
      </div>
    );
  };

  const BottomNav = () => (
    <div className="bg-white/95 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center p-4 pb-8 absolute bottom-0 w-full z-40 rounded-t-[2.5rem] shadow-2xl shrink-0">
      <button onClick={() => setView('menu')} className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${view === 'menu' ? 'text-indigo-600 bg-indigo-50 scale-105' : 'text-slate-400'}`}>
        <Home size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Base</span>
      </button>
      <button onClick={() => setView('moduleList')} className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${['moduleList','learning','difficultySelect', 'quiz'].includes(view) ? 'text-indigo-600 bg-indigo-50 scale-105' : 'text-slate-400'}`}>
        <BookOpen size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Learn</span>
      </button>
      <button onClick={() => setView('map')} className={`p-3 rounded-2xl flex flex-col items-center gap-1 transition-all ${view === 'map' ? 'text-indigo-600 bg-indigo-50 scale-105' : 'text-slate-400'}`}>
        <MapIcon size={22} /><span className="text-[8px] font-black uppercase tracking-widest">Atlas</span>
      </button>
    </div>
  );

  return (
    <div className="h-full w-full max-w-md mx-auto bg-slate-50 shadow-2xl overflow-hidden relative font-sans text-slate-900 flex flex-col antialiased">
      <div className="flex-1 overflow-hidden relative flex flex-col">
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
