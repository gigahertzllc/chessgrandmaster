import React, { useState, useCallback, useRef } from "react";
import { Chess } from "chess.js";
import Board from "../components/Board.jsx";
import { getPuzzles, getRandomPuzzles } from "./data/puzzles.js";
import { getRuleBasedFeedback } from "./useAICoach.js";

/**
 * Coaching Session Component
 * 
 * Runs individual training sessions including:
 * - Lessons with explanations
 * - Tactical puzzles
 * - Practice games with analysis
 */

// Coach feedback messages
const feedback = {
  correct: [
    "Excellent! You found it! 🎉",
    "Perfect! That's exactly right!",
    "Great pattern recognition!",
    "Well done! You're getting stronger!"
  ],
  incorrect: [
    "Not quite - let's look at this together.",
    "Good try! Here's a hint...",
    "That's a reasonable idea, but there's something better.",
    "Close! Think about what piece is undefended."
  ],
  hint: [
    "Take your time and look for forcing moves.",
    "Check all captures first.",
    "What pieces are undefended?",
    "Is there a way to attack two things at once?"
  ]
};

function getRandomFeedback(type) {
  const messages = feedback[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function CoachingSession({ session, module, userSkills, onComplete, onBack }) {
  const [phase, setPhase] = useState("intro"); // intro | content | puzzle | game | complete
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [coachMessage, setCoachMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [puzzleChess, setPuzzleChess] = useState(null);
  const [puzzleFen, setPuzzleFen] = useState(null);
  const [attempts, setAttempts] = useState(0);

  // Initialize puzzles for puzzle-type sessions
  React.useEffect(() => {
    if (session.type === "puzzles") {
      // Get puzzles for the skills in this session using the puzzle database
      const sessionPuzzles = [];
      const skillIds = session.skills || [];
      const difficulty = session.difficulty || "beginner";
      
      skillIds.forEach(skillId => {
        // Map skill IDs to puzzle categories
        const puzzleCategory = mapSkillToCategory(skillId);
        if (puzzleCategory) {
          const catPuzzles = getPuzzles(puzzleCategory, difficulty);
          sessionPuzzles.push(...catPuzzles.map(p => ({ ...p, category: puzzleCategory })));
        }
      });
      
      // Shuffle and limit to puzzle count
      const shuffled = sessionPuzzles.sort(() => Math.random() - 0.5);
      const limited = shuffled.slice(0, session.puzzleCount || 10);
      setPuzzles(limited);
      
      if (limited.length > 0) {
        setCurrentPuzzle(limited[0]);
        const chess = new Chess(limited[0].fen);
        setPuzzleChess(chess);
        setPuzzleFen(limited[0].fen);
      }
    }
  }, [session]);

  // Map skill IDs to puzzle categories
  function mapSkillToCategory(skillId) {
    const mapping = {
      forks: "forks",
      pins: "pins",
      skewers: "skewers",
      discoveredAttacks: "discoveredAttacks",
      backRank: "backRank",
      matingPatterns: "matingPatterns",
      deflection: "deflection"
    };
    return mapping[skillId] || null;
  }

  // Start the session
  const startSession = () => {
    if (session.type === "lesson") {
      setPhase("content");
      setCoachMessage(session.content?.introduction || "Let's learn about " + session.name);
    } else if (session.type === "puzzles") {
      setPhase("puzzle");
      setCoachMessage("Let's practice! Find the best move in each position.");
    } else if (session.type === "game") {
      setPhase("game");
      setCoachMessage("Time to put your skills to the test! Play a game and we'll analyze it together.");
    }
  };

  // Handle puzzle move
  const handlePuzzleMove = useCallback((move) => {
    if (!currentPuzzle || !puzzleChess) return;
    
    try {
      const result = puzzleChess.move(move);
      if (result) {
        setPuzzleFen(puzzleChess.fen());
        
        // Check if move matches solution
        const expectedMove = currentPuzzle.solution[0];
        const moveStr = result.san;
        
        // Simple match (could be improved)
        if (moveStr === expectedMove || move.from + move.to === expectedMove?.toLowerCase().replace(/[+#x]/g, '')) {
          // Correct!
          setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
          setCoachMessage(getRandomFeedback("correct"));
          
          // Move to next puzzle after delay
          setTimeout(() => {
            const nextIdx = puzzles.indexOf(currentPuzzle) + 1;
            if (nextIdx < puzzles.length) {
              const next = puzzles[nextIdx];
              setCurrentPuzzle(next);
              const chess = new Chess(next.fen);
              setPuzzleChess(chess);
              setPuzzleFen(next.fen);
              setShowHint(false);
              setAttempts(0);
              setCoachMessage("Good! Here's the next one.");
            } else {
              // Session complete
              setPhase("complete");
            }
          }, 1500);
        } else {
          // Incorrect - undo move
          puzzleChess.undo();
          setPuzzleFen(puzzleChess.fen());
          setAttempts(prev => prev + 1);
          
          if (attempts >= 2) {
            setCoachMessage(`The answer was ${expectedMove}. ${currentPuzzle.hint}`);
            setScore(prev => ({ ...prev, total: prev.total + 1 }));
            
            setTimeout(() => {
              const nextIdx = puzzles.indexOf(currentPuzzle) + 1;
              if (nextIdx < puzzles.length) {
                const next = puzzles[nextIdx];
                setCurrentPuzzle(next);
                const chess = new Chess(next.fen);
                setPuzzleChess(chess);
                setPuzzleFen(next.fen);
                setShowHint(false);
                setAttempts(0);
                setCoachMessage("Let's try another one!");
              } else {
                setPhase("complete");
              }
            }, 2500);
          } else {
            setCoachMessage(getRandomFeedback("incorrect"));
          }
        }
      }
    } catch (e) {
      console.error("Invalid move:", e);
    }
  }, [currentPuzzle, puzzleChess, puzzles, attempts]);

  // Show hint
  const handleShowHint = () => {
    if (currentPuzzle?.hint) {
      setShowHint(true);
      setCoachMessage(`Hint: ${currentPuzzle.hint}`);
    }
  };

  // Complete session
  const handleComplete = () => {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100;
    
    // Calculate skill updates based on performance
    const skillUpdates = {};
    (session.skills || []).forEach(skillId => {
      const currentLevel = userSkills[skillId]?.level || 1;
      const xpGain = accuracy >= 80 ? 20 : accuracy >= 60 ? 10 : 5;
      const currentXp = (userSkills[skillId]?.xp || 0) + xpGain;
      const newLevel = currentXp >= 100 ? Math.min(currentLevel + 1, 5) : currentLevel;
      
      skillUpdates[skillId] = {
        level: newLevel,
        xp: currentXp >= 100 ? currentXp - 100 : currentXp
      };
    });
    
    onComplete({
      accuracy,
      score,
      skillUpdates
    });
  };

  // Render intro
  const renderIntro = () => (
    <div style={{
      textAlign: "center",
      padding: 40
    }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>{module?.icon || "📚"}</div>
      <h2 style={{ margin: "0 0 12px 0" }}>{session.name}</h2>
      <p style={{ opacity: 0.8, marginBottom: 8 }}>{session.description}</p>
      <div style={{ opacity: 0.6, marginBottom: 32 }}>
        ⏱️ {session.duration} minutes
      </div>
      
      <button
        onClick={startSession}
        style={{
          padding: "16px 48px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 18,
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Start Session →
      </button>
    </div>
  );

  // Render lesson content
  const renderContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Coach message */}
      <div style={{
        background: "linear-gradient(135deg, rgba(76,175,80,0.2) 0%, rgba(33,150,243,0.2) 100%)",
        borderRadius: 12,
        padding: 20,
        display: "flex",
        gap: 16,
        alignItems: "flex-start"
      }}>
        <span style={{ fontSize: 40 }}>🎓</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, lineHeight: 1.7 }}>{coachMessage}</div>
        </div>
      </div>

      {/* Lesson content would go here - for now just show description */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: 12,
        padding: 24
      }}>
        <p style={{ fontSize: 15, lineHeight: 1.8, margin: 0 }}>
          {session.content?.introduction || session.description}
        </p>
      </div>

      {/* Continue button */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={() => setPhase("complete")}
          style={{
            padding: "14px 32px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  );

  // Render puzzle
  const renderPuzzle = () => {
    if (!currentPuzzle || !puzzleChess) {
      return <div>Loading puzzles...</div>;
    }

    const turnColor = puzzleChess.turn() === 'w' ? 'White' : 'Black';
    
    return (
      <div style={{ display: "flex", gap: 24 }}>
        {/* Board */}
        <div style={{ flex: "0 0 auto" }}>
          <Board
            chess={puzzleChess}
            fen={puzzleFen}
            orientation={puzzleChess.turn()}
            interactive={true}
            onMove={handlePuzzleMove}
            size={420}
          />
        </div>

        {/* Info panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Progress */}
          <div style={{
            background: "rgba(0,0,0,0.2)",
            borderRadius: 12,
            padding: 16
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, opacity: 0.7 }}>Progress</span>
              <span style={{ fontSize: 13 }}>
                {puzzles.indexOf(currentPuzzle) + 1} / {puzzles.length}
              </span>
            </div>
            <div style={{
              height: 8,
              background: "rgba(255,255,255,0.1)",
              borderRadius: 4,
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${((puzzles.indexOf(currentPuzzle) + 1) / puzzles.length) * 100}%`,
                background: "#4CAF50",
                transition: "width 0.3s"
              }} />
            </div>
          </div>

          {/* Turn indicator */}
          <div style={{
            padding: 12,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 8,
            textAlign: "center"
          }}>
            <strong>{turnColor}</strong> to move
          </div>

          {/* Coach message */}
          <div style={{
            background: "linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(33,150,243,0.15) 100%)",
            borderRadius: 12,
            padding: 16,
            display: "flex",
            gap: 12,
            alignItems: "flex-start"
          }}>
            <span style={{ fontSize: 28 }}>🎓</span>
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>{coachMessage}</div>
          </div>

          {/* Hint button */}
          {!showHint && (
            <button
              onClick={handleShowHint}
              style={{
                padding: "12px 20px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                cursor: "pointer"
              }}
            >
              💡 Show Hint
            </button>
          )}

          {/* Score */}
          <div style={{
            marginTop: "auto",
            padding: 16,
            background: "rgba(0,0,0,0.2)",
            borderRadius: 12,
            display: "flex",
            justifyContent: "space-around"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#4CAF50" }}>{score.correct}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Correct</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{score.total}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Attempted</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#FFC107" }}>
                {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render game (placeholder - would integrate with PlayVsBot)
  const renderGame = () => (
    <div style={{ textAlign: "center", padding: 40 }}>
      <div style={{ fontSize: 64, marginBottom: 24 }}>♟️</div>
      <h3>Practice Game</h3>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        Play a game against the {session.opponent || "bot"} and we'll analyze it together.
      </p>
      <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 32 }}>
        (Game integration coming soon - for now, mark as complete)
      </p>
      <button
        onClick={() => setPhase("complete")}
        style={{
          padding: "14px 32px",
          background: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: "pointer"
        }}
      >
        Complete Session →
      </button>
    </div>
  );

  // Render complete
  const renderComplete = () => {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 100;
    
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>
          {accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👍" : "💪"}
        </div>
        <h2 style={{ margin: "0 0 12px 0" }}>Session Complete!</h2>
        
        {score.total > 0 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 32,
            marginBottom: 32
          }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#4CAF50" }}>{score.correct}</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Correct</div>
            </div>
            <div>
              <div style={{ fontSize: 36, fontWeight: 700 }}>{accuracy}%</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Accuracy</div>
            </div>
          </div>
        )}
        
        <p style={{ opacity: 0.8, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
          {accuracy >= 80 
            ? "Excellent work! You're really getting the hang of this."
            : accuracy >= 60
              ? "Good effort! Keep practicing and you'll master these patterns."
              : "Don't worry - these patterns take time. Review and try again!"}
        </p>
        
        <button
          onClick={handleComplete}
          style={{
            padding: "16px 48px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Continue →
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24
      }}>
        <button
          onClick={onBack}
          style={{
            padding: "8px 16px",
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
        <div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{module?.name}</div>
          <div style={{ fontWeight: 600 }}>{session.name}</div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: 16,
        padding: 24,
        minHeight: 400
      }}>
        {phase === "intro" && renderIntro()}
        {phase === "content" && renderContent()}
        {phase === "puzzle" && renderPuzzle()}
        {phase === "game" && renderGame()}
        {phase === "complete" && renderComplete()}
      </div>
    </div>
  );
}
