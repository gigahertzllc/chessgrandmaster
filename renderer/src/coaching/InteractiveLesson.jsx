/**
 * Interactive Lesson Component
 * 
 * Renders comprehensive chess lessons with:
 * - Step-by-step navigation
 * - Interactive board positions
 * - Find-the-move exercises
 * - Multiple choice quizzes
 * - Progress tracking
 */

import React, { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import Board from "../components/Board.jsx";
import { useResponsive } from "../hooks/useResponsive.js";

export default function InteractiveLesson({ lesson, voice, onComplete, onBack }) {
  const { isMobile, isTablet, width } = useResponsive();
  const [currentStep, setCurrentStep] = useState(0);
  const [chess, setChess] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [exerciseState, setExerciseState] = useState("waiting"); // waiting | correct | incorrect | revealed
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [stats, setStats] = useState({ correctExercises: 0, totalExercises: 0, quizScore: 0, quizTotal: 0 });
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);

  const steps = lesson?.steps || [];
  const step = steps[currentStep];
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Load position when step changes
  useEffect(() => {
    if (step?.fen) {
      const newChess = new Chess(step.fen);
      setChess(newChess);
    }
    setSelectedSquare(null);
    setLegalMoves([]);
    setExerciseState("waiting");
    setShowExplanation(false);
    setAttempts(0);
    setCurrentQuizQuestion(0);
    setQuizAnswers({});
  }, [currentStep, step?.fen]);

  // Speak content
  useEffect(() => {
    if (voice?.isEnabled && step) {
      if (step.type === "explanation" && step.content) {
        const text = step.content.replace(/\*\*/g, "").replace(/\n/g, " ").slice(0, 200);
        voice.speak(step.title + ". " + text);
      } else if (step.type === "exercise") {
        voice.speak(step.title + ". " + step.content);
      }
    }
  }, [currentStep]);

  // Handle square click for exercises
  const handleSquareClick = useCallback((square) => {
    if (step?.type !== "exercise" || exerciseState !== "waiting") return;

    const piece = chess.get(square);
    const turn = chess.turn();

    if (piece && piece.color === turn) {
      setSelectedSquare(square);
      const moves = chess.moves({ square, verbose: true });
      setLegalMoves(moves.map(m => m.to));
      return;
    }

    if (selectedSquare && legalMoves.includes(square)) {
      makeMove(selectedSquare, square);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [chess, selectedSquare, legalMoves, step, exerciseState]);

  // Make a move (for exercises)
  const makeMove = useCallback((from, to) => {
    if (!step?.moveToFind) return;

    const move = chess.move({ from, to, promotion: 'q' });
    if (!move) return;

    const moveSan = move.san;
    const expected = step.moveToFind;
    const alternatives = step.alternativeMoves || [];

    const isCorrect = moveSan === expected || 
                      moveSan.replace(/[+#]/g, '') === expected.replace(/[+#]/g, '') ||
                      alternatives.includes(moveSan) ||
                      alternatives.includes(moveSan.replace(/[+#]/g, ''));

    if (isCorrect) {
      setExerciseState("correct");
      setStats(s => ({ ...s, correctExercises: s.correctExercises + 1, totalExercises: s.totalExercises + 1 }));
      setShowExplanation(true);
      if (voice?.isEnabled) {
        voice.speak("Excellent! That's correct!");
      }
    } else {
      setAttempts(a => a + 1);
      chess.undo();
      setChess(new Chess(chess.fen()));
      
      if (attempts >= 2) {
        setExerciseState("revealed");
        setStats(s => ({ ...s, totalExercises: s.totalExercises + 1 }));
        setShowExplanation(true);
        if (voice?.isEnabled) {
          voice.speak(`The answer was ${expected}.`);
        }
      } else {
        setExerciseState("incorrect");
        if (voice?.isEnabled) {
          voice.speak(attempts === 0 ? "Not quite, try again!" : "One more try.");
        }
        setTimeout(() => setExerciseState("waiting"), 1500);
      }
    }

    setSelectedSquare(null);
    setLegalMoves([]);
  }, [chess, step, attempts, voice]);

  // Handle quiz answer
  const handleQuizAnswer = (questionIndex, answerIndex) => {
    if (quizAnswers[questionIndex] !== undefined) return;

    const question = step.questions[questionIndex];
    const isCorrect = answerIndex === question.correct;

    setQuizAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
    
    if (isCorrect) {
      setStats(s => ({ ...s, quizScore: s.quizScore + 1, quizTotal: s.quizTotal + 1 }));
    } else {
      setStats(s => ({ ...s, quizTotal: s.quizTotal + 1 }));
    }
  };

  // Handle multiple choice exercise
  const handleExerciseOption = (optionIndex) => {
    const option = step.options[optionIndex];
    
    if (option.correct) {
      setExerciseState("correct");
      setStats(s => ({ ...s, correctExercises: s.correctExercises + 1, totalExercises: s.totalExercises + 1 }));
      setShowExplanation(true);
      if (voice?.isEnabled) {
        voice.speak("Correct!");
      }
    } else {
      setAttempts(a => a + 1);
      if (attempts >= 1) {
        setExerciseState("revealed");
        setStats(s => ({ ...s, totalExercises: s.totalExercises + 1 }));
        setShowExplanation(true);
      } else {
        setExerciseState("incorrect");
        setTimeout(() => setExerciseState("waiting"), 1500);
      }
    }
  };

  // Navigation
  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete?.({ ...stats, completed: true });
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const showHint = () => {
    if (step?.hint && voice?.isEnabled) {
      voice.speak(step.hint);
    }
  };

  // Format content with bold markers
  function formatContent(content) {
    if (!content) return null;
    const parts = content.split(/\*\*(.+?)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} style={{ color: "#4CAF50" }}>{part}</strong>;
      }
      return part;
    });
  }

  // Can proceed to next step?
  const canProceed = () => {
    if (!step) return false;
    if (step.type === "explanation" || step.type === "summary") return true;
    if (step.type === "exercise") {
      if (step.options) return exerciseState === "correct" || exerciseState === "revealed";
      if (step.moveToFind) return exerciseState === "correct" || exerciseState === "revealed";
      return true;
    }
    if (step.type === "quiz") {
      return step.questions?.every((_, i) => quizAnswers[i] !== undefined);
    }
    return true;
  };

  // Render step content
  const renderStepContent = () => {
    if (!step) return null;
    
    // Calculate board size based on screen
    const boardSize = isMobile ? Math.min(width - 48, 320) : isTablet ? 320 : 340;
    const exerciseBoardSize = isMobile ? Math.min(width - 48, 340) : isTablet ? 340 : 380;

    switch (step.type) {
      case "explanation":
        return (
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 20 : 32, 
            alignItems: isMobile ? "center" : "flex-start" 
          }}>
            {step.fen && (
              <div style={{ flexShrink: 0 }}>
                <Board
                  chess={chess}
                  onSquareClick={() => {}}
                  selectedSquare={null}
                  legalMoves={[]}
                  highlights={step.highlights}
                  size={boardSize}
                />
              </div>
            )}
            <div style={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: isMobile ? 18 : 20 }}>{step.title}</h3>
              <div style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.8, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.9)" }}>
                {formatContent(step.content)}
              </div>
            </div>
          </div>
        );

      case "exercise":
        return (
          <div style={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 20 : 32, 
            alignItems: isMobile ? "center" : "flex-start" 
          }}>
            <div style={{ flexShrink: 0 }}>
              <Board
                chess={chess}
                onSquareClick={step.moveToFind ? handleSquareClick : () => {}}
                selectedSquare={selectedSquare}
                legalMoves={legalMoves}
                highlights={step.highlights}
                size={exerciseBoardSize}
              />
              {step.moveToFind && exerciseState === "waiting" && (
                <div style={{ marginTop: 12, textAlign: "center", fontSize: isMobile ? 12 : 13, color: chess.turn() === 'w' ? '#fff' : '#888' }}>
                  {chess.turn() === 'w' ? "White" : "Black"} to move
                </div>
              )}
            </div>
            
            <div style={{ flex: 1, width: isMobile ? "100%" : "auto" }}>
              <h3 style={{ margin: "0 0 12px", fontSize: isMobile ? 18 : 20 }}>{step.title}</h3>
              <p style={{ fontSize: isMobile ? 14 : 15, lineHeight: 1.6, marginBottom: isMobile ? 16 : 20 }}>{step.content}</p>
              
              {step.options && (
                <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 8 : 10 }}>
                  {step.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => exerciseState === "waiting" && handleExerciseOption(i)}
                      disabled={exerciseState !== "waiting"}
                      style={{
                        padding: isMobile ? "12px 14px" : "14px 18px",
                        background: exerciseState !== "waiting" && opt.correct ? "rgba(76, 175, 80, 0.3)" : exerciseState !== "waiting" && !opt.correct ? "rgba(244, 67, 54, 0.2)" : "rgba(255,255,255,0.1)",
                        border: opt.correct && exerciseState !== "waiting" ? "2px solid #4CAF50" : "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 8,
                        color: "#fff",
                        fontSize: isMobile ? 13 : 14,
                        textAlign: "left",
                        cursor: exerciseState === "waiting" ? "pointer" : "default",
                        minHeight: isMobile ? 48 : "auto"
                      }}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              )}

              {step.moveToFind && exerciseState === "waiting" && step.hint && (
                <button onClick={showHint} style={{ marginTop: 16, padding: "10px 16px", background: "rgba(255, 152, 0, 0.2)", border: "1px solid rgba(255, 152, 0, 0.4)", borderRadius: 8, color: "#ff9800", fontSize: 14, cursor: "pointer" }}>
                  💡 Show Hint
                </button>
              )}

              {exerciseState === "correct" && (
                <div style={{ marginTop: 20, padding: 16, background: "rgba(76, 175, 80, 0.2)", border: "1px solid rgba(76, 175, 80, 0.4)", borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, color: "#4CAF50", marginBottom: 8 }}>✓ Correct!</div>
                  {step.explanation && <div style={{ fontSize: 14, lineHeight: 1.6 }}>{step.explanation}</div>}
                </div>
              )}

              {exerciseState === "incorrect" && (
                <div style={{ marginTop: 20, padding: 16, background: "rgba(244, 67, 54, 0.2)", border: "1px solid rgba(244, 67, 54, 0.4)", borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, color: "#f44336" }}>Not quite — try again!</div>
                </div>
              )}

              {exerciseState === "revealed" && (
                <div style={{ marginTop: 20, padding: 16, background: "rgba(255, 152, 0, 0.2)", border: "1px solid rgba(255, 152, 0, 0.4)", borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, color: "#ff9800", marginBottom: 8 }}>Answer: {step.moveToFind}</div>
                  {step.explanation && <div style={{ fontSize: 14, lineHeight: 1.6 }}>{step.explanation}</div>}
                </div>
              )}
            </div>
          </div>
        );

      case "quiz":
        const allAnswered = step.questions?.every((_, i) => quizAnswers[i] !== undefined);
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ margin: "0 0 24px", fontSize: 20 }}>{step.title}</h3>
            {step.questions?.map((q, qIdx) => (
              <div key={qIdx} style={{ marginBottom: 32 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>{qIdx + 1}. {q.question}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {q.options.map((opt, oIdx) => {
                    const answered = quizAnswers[qIdx] !== undefined;
                    const selected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = oIdx === q.correct;
                    return (
                      <button key={oIdx} onClick={() => handleQuizAnswer(qIdx, oIdx)} disabled={answered}
                        style={{
                          padding: "12px 16px",
                          background: answered && isCorrect ? "rgba(76, 175, 80, 0.3)" : answered && selected && !isCorrect ? "rgba(244, 67, 54, 0.3)" : "rgba(255,255,255,0.05)",
                          border: answered && isCorrect ? "2px solid #4CAF50" : "1px solid rgba(255,255,255,0.2)",
                          borderRadius: 8, color: "#fff", fontSize: 14, textAlign: "left", cursor: answered ? "default" : "pointer"
                        }}>
                        {opt}{answered && isCorrect && " ✓"}{answered && selected && !isCorrect && " ✗"}
                      </button>
                    );
                  })}
                </div>
                {quizAnswers[qIdx] !== undefined && q.explanation && (
                  <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.05)", borderRadius: 8, fontSize: 13, lineHeight: 1.5 }}>{q.explanation}</div>
                )}
              </div>
            ))}
            {allAnswered && (
              <div style={{ padding: 16, background: "rgba(76, 175, 80, 0.2)", borderRadius: 8, textAlign: "center" }}>
                Quiz complete! Score: {stats.quizScore}/{stats.quizTotal}
              </div>
            )}
          </div>
        );

      case "summary":
        return (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 20 }}>📝 {step.title}</h3>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 24 }}>
              {step.points?.map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < step.points.length - 1 ? 16 : 0 }}>
                  <span style={{ color: "#4CAF50", fontSize: 18 }}>✓</span>
                  <span style={{ fontSize: 15, lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Unknown step type: {step.type}</div>;
    }
  };

  if (!lesson) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Lesson not found</h2>
        <button onClick={onBack}>← Back</button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      minHeight: isMobile ? "100vh" : "auto",
      background: "#1a1a1a" 
    }}>
      {/* Header */}
      <div style={{ 
        padding: isMobile ? "12px 16px" : "16px 24px", 
        borderBottom: "1px solid rgba(255,255,255,0.1)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        flexShrink: 0
      }}>
        <button onClick={onBack} style={{ 
          padding: isMobile ? "8px 12px" : "8px 16px", 
          background: "transparent", 
          color: "#fff", 
          border: "1px solid rgba(255,255,255,0.2)", 
          borderRadius: 6, 
          cursor: "pointer",
          fontSize: isMobile ? 13 : 14,
          minHeight: isMobile ? 40 : "auto"
        }}>
          {isMobile ? "←" : "← Back"}
        </button>
        <div style={{ textAlign: "center", flex: 1, padding: "0 12px" }}>
          <div style={{ fontWeight: 600, fontSize: isMobile ? 14 : 16 }}>{lesson.title}</div>
          <div style={{ fontSize: isMobile ? 11 : 12, opacity: 0.6 }}>Step {currentStep + 1} of {totalSteps}</div>
        </div>
        <div style={{ 
          minWidth: isMobile ? 40 : 80, 
          textAlign: "right", 
          fontSize: isMobile ? 12 : 13, 
          opacity: 0.7 
        }}>
          {Math.round(progress)}%
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.1)", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #4CAF50, #8BC34A)", transition: "width 0.3s ease" }} />
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, 
        overflow: "auto", 
        padding: isMobile ? 16 : 32 
      }}>
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <div style={{ 
        padding: isMobile ? "12px 16px" : "16px 24px", 
        paddingBottom: isMobile ? "calc(12px + env(safe-area-inset-bottom, 0))" : "16px",
        borderTop: "1px solid rgba(255,255,255,0.1)", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        gap: isMobile ? 8 : 16,
        flexShrink: 0
      }}>
        <button onClick={goPrev} disabled={currentStep === 0}
          style={{ 
            padding: isMobile ? "12px 16px" : "12px 24px", 
            background: currentStep === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)", 
            border: "none", 
            borderRadius: 8, 
            color: currentStep === 0 ? "rgba(255,255,255,0.3)" : "#fff", 
            cursor: currentStep === 0 ? "default" : "pointer", 
            fontSize: isMobile ? 13 : 14,
            minHeight: isMobile ? 48 : "auto",
            flex: isMobile ? 1 : "none"
          }}>
          {isMobile ? "←" : "← Previous"}
        </button>
        {!isMobile && (
          <div style={{ fontSize: 13, opacity: 0.5 }}>
            {step?.type === "exercise" && exerciseState === "waiting" && step.moveToFind && "Click pieces to make your move"}
          </div>
        )}
        <button onClick={goNext} disabled={!canProceed()}
          style={{ 
            padding: isMobile ? "12px 16px" : "12px 24px", 
            background: canProceed() ? "#4CAF50" : "rgba(255,255,255,0.05)", 
            border: "none", 
            borderRadius: 8, 
            color: canProceed() ? "#fff" : "rgba(255,255,255,0.3)", 
            cursor: canProceed() ? "pointer" : "default", 
            fontSize: isMobile ? 13 : 14, 
            fontWeight: 600,
            minHeight: isMobile ? 48 : "auto",
            flex: isMobile ? 1 : "none"
          }}>
          {currentStep === totalSteps - 1 ? (isMobile ? "Complete ✓" : "Complete Lesson ✓") : (isMobile ? "Next →" : "Next →")}
        </button>
      </div>
    </div>
  );
}
