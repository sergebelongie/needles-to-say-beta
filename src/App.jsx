import React, { useState, useEffect, useCallback } from 'react';

// Simple ROT13 decoder for mild obfuscation
const decode = (str) => str.replace(/[a-zA-Z]/g, c => 
  String.fromCharCode((c <= 'Z' ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
);

// 21 days of puzzles, keyed by date
const PUZZLE_DATA = {
  "2026-05-13": { hint: "Unnecessary sewing tools", a: "ARRQYRFF" },
  "2026-05-14": { hint: "Flat surface strategy", a: "CYNAR" },
  "2026-05-15": { hint: "Metallic underwear", a: "OENFF" },
  "2026-05-16": { hint: "Unadorned celestial body", a: "FGNEX" },
  "2026-05-17": { hint: "A burning deception", a: "SYNZR" },
  "2026-05-18": { hint: "Seat for a spiced tea", a: "PUNVE" },
  "2026-05-19": { hint: "Vise for a bivalve", a: "PYNZC" },
  "2026-05-20": { hint: "Royal headgear for a black bird", a: "PEBJA" },
  "2026-05-21": { hint: "Kick a clever bit of wordplay", a: "CHAG" },
  "2026-05-22": { hint: "Money set aside for enjoyment", a: "SHAQ" },
  "2026-05-23": { hint: "A victory for the breeze", a: "JVAQ" },
  "2026-05-24": { hint: "A fleeting wheel of French cheese", a: "OEVRS" },
  "2026-05-25": { hint: "House covering for an Aussie marsupial", a: "EBBS" },
  "2026-05-26": { hint: "Practice boxing at a health resort", a: "FCNE" },
  "2026-05-27": { hint: "A pleasantly chubby purple fruit", a: "CYHZC" },
  "2026-05-28": { hint: "A light baseball tap to advance a hot dog roll", a: "OHAG" },
  "2026-05-29": { hint: "A brewed drink for a pollinator", a: "ORRE" },
  "2026-05-30": { hint: "A pedestal for an overzealous fan", a: "FGNAQ" },
  "2026-05-31": { hint: "Brag about large constrictors", a: "OBNFG" },
  "2026-06-01": { hint: "A daring trick to shock an audience", a: "FGHAG" },
  "2026-06-02": { hint: "A musical group's prohibition", a: "ONAQ" }
};

const getDailyPuzzle = (offset = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + offset);
  // Format as YYYY-MM-DD local time
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Fallback to the first puzzle if today's date isn't in our dataset
  const puzzleData = PUZZLE_DATA[dateStr] || PUZZLE_DATA["2026-05-13"];
  const displayDate = PUZZLE_DATA[dateStr] 
    ? today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) 
    : "May 13, 2026";
  
  const answer1 = decode(puzzleData.a);
  
  return {
    dateStr: displayDate,
    hint: puzzleData.hint,
    answer1: answer1,
    answer2: answer1.slice(0, -1)
  };
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference on initial load
    if (typeof window !== 'undefined') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [dayOffset, setDayOffset] = useState(0);
  const [dailyPuzzle, setDailyPuzzle] = useState(() => getDailyPuzzle(0));
  const [guess, setGuess] = useState("");
  const [status, setStatus] = useState("playing"); // "playing" | "solved" | "failed"
  const [guessesLeft, setGuessesLeft] = useState(3);
  const [isShaking, setIsShaking] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [hintUsed, setHintUsed] = useState(false);

  const handleSkipDay = useCallback(() => {
    const newOffset = dayOffset + 1;
    setDayOffset(newOffset);
    setDailyPuzzle(getDailyPuzzle(newOffset));
    setGuess("");
    setStatus("playing");
    setGuessesLeft(3);
    setIsShaking(false);
    setHintUsed(false);
  }, [dayOffset]);

  const handleReveal = useCallback(() => {
    if (status !== "playing" || hintUsed) return;
    setHintUsed(true);
    // Lock in the first letter and clear any wrong guesses that follow it
    setGuess(dailyPuzzle.answer1[0]);
  }, [status, hintUsed, dailyPuzzle]);

  const handleKeyPress = useCallback((key) => {
    if (status !== "playing" || showHelp) return;

    if (key === 'Enter') {
      if (guess.length === dailyPuzzle.answer1.length) {
        if (guess === dailyPuzzle.answer1) {
          setStatus("solved");
        } else {
          // Incorrect - Shake!
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
          
          const newGuesses = guessesLeft - 1;
          setGuessesLeft(newGuesses);
          
          if (newGuesses === 0) {
            setStatus("failed");
            setGuess(dailyPuzzle.answer1); // Reveal the right answer
          } else {
            setGuess(""); // Clear the incorrect guess so they can try again easily
          }
        }
      }
    } else if (key === 'Backspace') {
      if (hintUsed && guess.length === 1) return; // Prevent deleting the revealed letter
      setGuess(prev => prev.slice(0, -1));
    } else if (/^[a-zA-Z]$/.test(key)) {
      if (guess.length < dailyPuzzle.answer1.length) {
        setGuess(prev => prev + key.toUpperCase());
      }
    }
  }, [guess, status, dailyPuzzle, guessesLeft, showHelp, hintUsed]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore modifier combinations
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      if (e.key === 'Enter') {
        e.preventDefault(); // CRITICAL FIX: Stops the Enter key from triggering focused buttons
        handleKeyPress('Enter');
      } else if (e.key === 'Backspace') {
        handleKeyPress('Backspace');
      } else if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  const handleShare = () => {
    // Calculate the number of guesses used to build the emoji grid
    const usedGuesses = status === "solved" ? (3 - guessesLeft + 1) : 3;
    let emojiGrid = "";
    
    for (let i = 0; i < usedGuesses; i++) {
      if (i === usedGuesses - 1 && status === "solved") {
        emojiGrid += "🟩🟩🟩🟩🟩\n";
      } else {
        emojiGrid += "🟥🟥🟥🟥🟥\n";
      }
    }
    
    const textToShare = `Needles to Say\n${dailyPuzzle.dateStr}\n\n${emojiGrid.trim()}`;
    
    // Fallback clipboard method for better browser/iframe compatibility
    const textArea = document.createElement("textarea");
    textArea.value = textToShare;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setToastMessage("Copied to clipboard!");
      setTimeout(() => setToastMessage(""), 2500);
    } catch (err) {
      console.error("Copy failed", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-sans selection:bg-transparent flex flex-col items-center pt-8 pb-4 transition-colors duration-300">
        
        {/* Header */}
        <header className="w-full max-w-lg px-4 mb-8 border-b border-gray-200 dark:border-slate-800 pb-4 flex items-center justify-between">
          <div className="w-16"></div> {/* Spacer to keep title centered */}
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold tracking-tight">Needles to Say</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 font-medium">{dailyPuzzle.dateStr}</p>
          </div>
          <div className="flex gap-2 w-16 justify-end">
            <button 
              onClick={(e) => { e.currentTarget.blur(); setIsDarkMode(!isDarkMode); }}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-gray-600 dark:hover:border-slate-300 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
            <button 
              onClick={(e) => { e.currentTarget.blur(); setShowHelp(true); }}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-gray-600 dark:hover:border-slate-300 hover:text-gray-800 dark:hover:text-slate-200 transition-colors"
              aria-label="How to play"
            >
              <span className="font-bold font-serif leading-none">?</span>
            </button>
          </div>
        </header>

        {/* Main Game Area */}
        <main className="w-full max-w-lg px-4 flex-1 flex flex-col items-center justify-center gap-10 mb-8">
          <div className="text-center px-4">
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-800 dark:text-slate-200">
              {dailyPuzzle.hint}
            </h2>
          </div>

          <div className={`flex flex-col items-center gap-3 ${isShaking ? 'animate-shake' : ''}`}>
            {/* Row 1 (Full Word) */}
            <div className="flex gap-1.5 sm:gap-2">
              {Array.from({ length: dailyPuzzle.answer1.length }).map((_, i) => {
                const letter = guess[i] || "";
                return (
                  <Tile 
                    key={`r1-${i}`} 
                    letter={letter} 
                    status={status} 
                    isActive={status === "playing" && guess.length === i}
                    isFilled={!!letter}
                    index={i}
                  />
                );
              })}
            </div>

            {/* Row 2 (Word minus last letter) */}
            <div className="flex gap-1.5 sm:gap-2">
              {Array.from({ length: dailyPuzzle.answer2.length }).map((_, i) => {
                // Magically pull the letter from the first row's guess!
                const letter = guess[i] || "";
                return (
                  <Tile 
                    key={`r2-${i}`} 
                    letter={letter} 
                    status={status} 
                    isFilled={!!letter}
                    isSecondary={true}
                    index={i}
                  />
                );
              })}
            </div>
          </div>

          {/* Status / Messages */}
          <div className="h-24 flex flex-col items-center justify-center mt-4 gap-3 relative">
            {toastMessage && (
              <div className="absolute -top-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm px-4 py-2 rounded-lg shadow-lg font-medium animate-pulse whitespace-nowrap z-10">
                {toastMessage}
              </div>
            )}

            {status === "solved" && (
              <div key={`solved-${dailyPuzzle.answer1}`} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold shadow-md animate-bounce">
                Genius!
              </div>
            )}
            {status === "failed" && (
              <div key={`failed-${dailyPuzzle.answer1}`} className="bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-md">
                Out of guesses
              </div>
            )}
            
            {(status === "solved" || status === "failed") && (
              <button 
                onClick={(e) => { e.currentTarget.blur(); handleShare(); }}
                className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white px-5 py-2 rounded-full font-bold shadow-sm transition-colors"
              >
                Share
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </button>
            )}

            {status === "playing" && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-gray-500 dark:text-slate-400 font-medium transition-opacity duration-200">
                  {guessesLeft} {guessesLeft === 1 ? 'guess' : 'guesses'} remaining
                </div>
                {!hintUsed && guessesLeft < 3 && (
                  <button 
                    onClick={(e) => { e.currentTarget.blur(); handleReveal(); }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.829 1.58-2.083a4.5 4.5 0 10-7.66 0c.922.254 1.58 1.1 1.58 2.083v.192" />
                    </svg>
                    Reveal 1st letter
                  </button>
                )}
              </div>
            )}
          </div>
        </main>

        {/* Virtual Keyboard */}
        <Keyboard onKeyPress={handleKeyPress} />

        {/* Debug skip button */}
        <div className="w-full text-center pb-2">
          <button 
            onClick={(e) => { e.currentTarget.blur(); handleSkipDay(); }}
            className="text-xs text-gray-200 dark:text-slate-800 hover:text-gray-400 dark:hover:text-slate-600 transition-colors"
            tabIndex="-1"
          >
            skip to next day
          </button>
        </div>

        {/* How to Play Modal */}
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

        {/* CSS for custom shake animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
          }
          .animate-shake {
            animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
          }
          @keyframes flip {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(-90deg); }
            100% { transform: rotateX(0deg); }
          }
          .animate-flip {
            animation-name: flip;
            animation-duration: 0.4s;
            animation-timing-function: ease-in-out;
          }
          @keyframes pop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .animate-pop {
            animation-name: pop;
            animation-duration: 0.1s;
            animation-timing-function: ease-in-out;
          }
        `}} />
      </div>
    </div>
  );
}

// Sub-component: Help Modal
function HelpModal({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-colors" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full relative shadow-2xl transition-colors" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-2xl font-bold mb-4 font-serif text-gray-900 dark:text-white">How to Play</h2>
        
        <div className="space-y-4 text-gray-700 dark:text-slate-300 text-sm sm:text-base">
          <p>Read the hint and guess the secret word pair.</p>
          <p>The trick? The second word is <strong>always</strong> formed by dropping the last letter of the first word.</p>
          
          <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700 mt-4 transition-colors">
            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Example</p>
            <p className="font-medium text-gray-900 dark:text-white mb-3">Unnecessary sewing tools</p>
            <div className="flex flex-col gap-2 pointer-events-none origin-left scale-[0.65] sm:scale-75">
              <div className="flex gap-1">
                {Array.from("NEEDLESS").map((l, i) => <Tile key={`ex1-${i}`} letter={l} isFilled={true} />)}
              </div>
              <div className="flex gap-1">
                {Array.from("NEEDLES").map((l, i) => <Tile key={`ex2-${i}`} letter={l} isFilled={true} isSecondary={true} />)}
              </div>
            </div>
          </div>
          
          <p>You have 3 guesses to get it right. Good luck!</p>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Play
        </button>
      </div>
    </div>
  );
}

// Sub-component: Tile
function Tile({ letter, status, isActive, isFilled, isSecondary, index = 0 }) {
  const [revealedStatus, setRevealedStatus] = useState("playing");
  
  useEffect(() => {
    if (status === "solved" || status === "failed") {
      const timer = setTimeout(() => {
        setRevealedStatus(status);
      }, index * 100 + 200); // Reveal color exactly halfway through the 400ms flip
      return () => clearTimeout(timer);
    } else {
      setRevealedStatus("playing");
    }
  }, [status, index]);

  let baseClasses = "w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-xl sm:text-2xl font-bold uppercase transition-colors duration-150 select-none ";
  const isRevealing = status === "solved" || status === "failed";
  
  if (revealedStatus === "solved") {
    baseClasses += "bg-green-600 border-green-600 text-white";
  } else if (revealedStatus === "failed") {
    baseClasses += "bg-red-500 border-red-500 text-white";
  } else if (isActive) {
    baseClasses += "border-b-4 border-gray-800 dark:border-slate-300 text-gray-900 dark:text-white"; // Cursor indicator
  } else if (isFilled) {
    baseClasses += isSecondary ? "border-2 border-gray-300 dark:border-slate-600 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-800" : "border-2 border-gray-600 dark:border-slate-400 text-gray-900 dark:text-white dark:bg-slate-900";
  } else {
    baseClasses += "border-2 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800";
  }

  if (isRevealing) {
    baseClasses += " animate-flip";
  } else if (isFilled && !isSecondary && status === "playing") {
    // Only pop when actively typing a new letter
    baseClasses += " animate-pop";
  }

  return (
    <div 
      className={baseClasses}
      style={isRevealing ? { animationDelay: `${index * 100}ms` } : {}}
    >
      {letter}
    </div>
  );
}

// Sub-component: Virtual Keyboard
function Keyboard({ onKeyPress }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];

  return (
    <div className="w-full max-w-lg px-2 pb-8 flex flex-col gap-2 select-none">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 sm:gap-2">
          {row.map(key => {
            const isSpecial = key === 'Enter' || key === 'Backspace';
            return (
              <button
                key={key}
                onClick={(e) => { e.currentTarget.blur(); onKeyPress(key); }}
                className={`
                  flex items-center justify-center rounded font-bold text-sm sm:text-base cursor-pointer
                  bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 active:bg-gray-400 dark:active:bg-slate-500 text-gray-800 dark:text-slate-200 transition-colors
                  h-12 sm:h-14 
                  ${isSpecial ? 'px-3 sm:px-4 text-xs sm:text-sm' : 'flex-1 max-w-[2.5rem] sm:max-w-[3rem]'}
                `}
              >
                {key === 'Backspace' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                  </svg>
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
