import React, { useState, useEffect, useCallback, useMemo } from "react";
import { skillCategories, getAllSkills, ratingToSkillLevel } from "./data/skillDefinitions.js";
import { coachingModules, getAllModules, getModulesByLevel, calculateModuleProgress } from "./data/curriculum.js";
import CoachingSession from "./CoachingSession.jsx";
import GameAnalyzer from "./GameAnalyzer.jsx";
import SkillProgress from "./SkillProgress.jsx";
import { useCoachVoice, VoiceToggleButton, VoiceSettings } from "./useCoachVoice.jsx";

/**
 * Chess Coach - Main Training Hub
 * 
 * A friendly AI-powered chess coach that:
 * - Assesses your skill level
 * - Guides you through structured training
 * - Analyzes your games with personalized feedback
 * - Tracks your progress across skill categories
 */

// Coach personality messages
const coachMessages = {
  welcome: [
    "Welcome to Chess Training! 👋 I'm your personal chess coach.",
    "Ready to improve your chess? Let's figure out where you are and build from there.",
    "Every grandmaster was once a beginner. Let's start your journey!"
  ],
  encouragement: [
    "Great work! You're making real progress.",
    "That was a tricky one - you handled it well!",
    "I can see you're getting stronger. Keep it up!",
    "Excellent! Your pattern recognition is improving."
  ],
  afterMistake: [
    "No worries - mistakes are how we learn. Let's look at what happened.",
    "Ah, I see what you were trying. Here's another way to think about it...",
    "Good attempt! Let me show you a pattern that might help here."
  ],
  sessionComplete: [
    "Fantastic session! You've earned a rest.",
    "Great work today! Your skills are definitely improving.",
    "Session complete! I can see real progress in your game."
  ]
};

function getRandomMessage(category) {
  const messages = coachMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Generate personalized welcome based on user progress
function generatePersonalizedWelcome(userProfile, completedSessions, userSkills) {
  // New user - no data
  if (!userProfile?.lastTrainingDate && completedSessions.length === 0) {
    return getRandomMessage("welcome");
  }

  const greetings = [
    "Welcome back!",
    "Hey, good to see you again!",
    "Glad you're back!",
    "Hey there, welcome back!"
  ];
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];

  // Find what they worked on recently
  let recentWork = "";
  if (completedSessions.length > 0) {
    const lastSessionId = completedSessions[completedSessions.length - 1];
    // Find the session and module
    for (const mod of Object.values(coachingModules)) {
      const session = mod.sessions.find(s => s.id === lastSessionId);
      if (session) {
        const topics = {
          fundamentals: "the fundamentals",
          tacticsBasics: "basic tactics",
          tacticsIntermediate: "intermediate tactics",
          tacticsAdvanced: "advanced tactics",
          openings: "opening principles",
          middlegame: "middlegame strategy",
          endgames: "endgame technique",
          modernConcepts: "modern chess concepts",
          antiTheory: "anti-theory openings"
        };
        recentWork = topics[mod.id] || mod.name.toLowerCase();
        break;
      }
    }
  }

  // Find weakest skill category
  let weakestArea = "";
  let suggestion = "";
  
  if (Object.keys(userSkills).length > 0) {
    // Group skills by category and calculate averages
    const categoryScores = {};
    const categoryNames = {
      tactics: "tactics",
      openings: "openings", 
      middlegame: "middlegame strategy",
      endgame: "endgames",
      calculation: "calculation"
    };

    for (const [skillId, skillData] of Object.entries(userSkills)) {
      // Find which category this skill belongs to
      for (const [catId, cat] of Object.entries(skillCategories)) {
        if (cat.skills.some(s => s.id === skillId)) {
          if (!categoryScores[catId]) categoryScores[catId] = [];
          categoryScores[catId].push(skillData.level || 1);
        }
      }
    }

    // Find lowest average
    let lowestAvg = Infinity;
    let lowestCat = null;
    for (const [catId, scores] of Object.entries(categoryScores)) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestCat = catId;
      }
    }

    if (lowestCat) {
      weakestArea = categoryNames[lowestCat] || lowestCat;
    }
  }

  // Build the message
  let message = greeting;

  // Add recent work context
  if (recentWork) {
    const recentPhrases = [
      `Last time you were working on ${recentWork}.`,
      `I see you've been focusing on ${recentWork}.`,
      `Great progress on ${recentWork} last session.`
    ];
    message += " " + recentPhrases[Math.floor(Math.random() * recentPhrases.length)];
  }

  // Add suggestion based on weakness
  if (weakestArea && weakestArea !== recentWork) {
    const suggestions = [
      `I think we should spend some time on ${weakestArea} today — that's an area where you could really level up.`,
      `How about we work on ${weakestArea}? A bit of practice there would really strengthen your game.`,
      `Want to focus on ${weakestArea} today? I've noticed that could use some attention.`,
      `Let's sharpen your ${weakestArea}. A little work there will pay off big time.`
    ];
    message += " " + suggestions[Math.floor(Math.random() * suggestions.length)];
  } else if (recentWork) {
    // Continue with what they were doing
    const continuePhrases = [
      "Want to keep building on that momentum?",
      "Ready to continue where we left off?",
      "Should we pick up where we left off, or try something new?"
    ];
    message += " " + continuePhrases[Math.floor(Math.random() * continuePhrases.length)];
  }

  // If no specific context, give general encouragement
  if (!recentWork && !weakestArea) {
    const generalPhrases = [
      "What would you like to work on today?",
      "Ready to sharpen your skills?",
      "Let's make today's training count!"
    ];
    message += " " + generalPhrases[Math.floor(Math.random() * generalPhrases.length)];
  }

  return message;
}

// Main component
export default function ChessCoach({ userProfile, onUpdateProfile, onBack }) {
  const [view, setView] = useState("home"); // home | assess | training | session | analyze | progress
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [coachMessage, setCoachMessage] = useState(""); // Start empty, will be set by effect
  const [userSkills, setUserSkills] = useState(userProfile?.skills || {});
  const [completedSessions, setCompletedSessions] = useState(userProfile?.completedSessions || []);
  const [estimatedRating, setEstimatedRating] = useState(userProfile?.estimatedRating || null);
  const [assessmentNeeded, setAssessmentNeeded] = useState(!userProfile?.estimatedRating);
  const [gameToAnalyze, setGameToAnalyze] = useState(null);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);

  // Voice synthesis for coach feedback
  const voice = useCoachVoice();

  // Generate personalized welcome on mount with slight delay for voice to load
  useEffect(() => {
    if (!hasSpokenWelcome) {
      // Small delay to ensure voices are loaded (especially on Chrome)
      const timer = setTimeout(() => {
        const welcomeMsg = generatePersonalizedWelcome(userProfile, completedSessions, userSkills);
        setCoachMessage(welcomeMsg);
        setHasSpokenWelcome(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Speak coach messages when they change (and voice is enabled)
  useEffect(() => {
    if (coachMessage && voice.isEnabled) {
      voice.speak(coachMessage);
    }
  }, [coachMessage, voice.isEnabled]);

  // Update welcome when returning to home view
  useEffect(() => {
    if (view === "home" && hasSpokenWelcome) {
      // Only regenerate if coming back from another view (not initial load)
      const returnMessages = [
        "Back to the training hub. What's next?",
        "Ready for more? Let's pick something to work on.",
        "Good stuff! What would you like to focus on now?"
      ];
      setCoachMessage(returnMessages[Math.floor(Math.random() * returnMessages.length)]);
    }
  }, [view]);

  // Save progress
  const saveProgress = useCallback((updates) => {
    const newProfile = {
      ...userProfile,
      skills: userSkills,
      completedSessions,
      estimatedRating,
      lastTrainingDate: new Date().toISOString(),
      ...updates
    };
    onUpdateProfile?.(newProfile);
  }, [userProfile, userSkills, completedSessions, estimatedRating, onUpdateProfile]);

  // Complete a session
  const completeSession = useCallback((sessionId, results) => {
    const newCompleted = [...completedSessions, sessionId];
    setCompletedSessions(newCompleted);
    
    // Update skills based on results
    if (results?.skillUpdates) {
      setUserSkills(prev => ({
        ...prev,
        ...results.skillUpdates
      }));
    }
    
    setCoachMessage(getRandomMessage("sessionComplete"));
    saveProgress({ completedSessions: newCompleted });
    setView("training");
    setSelectedSession(null);
  }, [completedSessions, saveProgress]);

  // Start assessment
  const startAssessment = () => {
    setView("assess");
  };

  // Complete assessment
  const completeAssessment = (rating) => {
    setEstimatedRating(rating);
    setAssessmentNeeded(false);
    saveProgress({ estimatedRating: rating });
    setCoachMessage(`Based on our assessment, your estimated rating is around ${rating}. Let's build from here!`);
    setView("home");
  };

  // Get recommended modules based on level
  const getRecommendedModules = () => {
    if (!estimatedRating) return getModulesByLevel("beginner");
    
    if (estimatedRating < 1000) return getModulesByLevel("beginner");
    if (estimatedRating < 1600) return [...getModulesByLevel("beginner"), ...getModulesByLevel("intermediate")];
    return getAllModules();
  };

  // Render home view
  const renderHome = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Coach welcome */}
      <div style={{
        background: "linear-gradient(135deg, rgba(76,175,80,0.2) 0%, rgba(33,150,243,0.2) 100%)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        gap: 20,
        alignItems: "flex-start"
      }}>
        <div style={{ fontSize: 56 }}>🎓</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Chess Coach</div>
          <div style={{ fontSize: 15, opacity: 0.9, lineHeight: 1.6 }}>{coachMessage}</div>
          
          {assessmentNeeded && (
            <button
              onClick={startAssessment}
              style={{
                marginTop: 16,
                padding: "12px 24px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              🎯 Take Skill Assessment (5 min)
            </button>
          )}
          
          {estimatedRating && (
            <div style={{
              marginTop: 12,
              display: "flex",
              gap: 16,
              alignItems: "center"
            }}>
              <div style={{
                padding: "8px 16px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: 8,
                fontSize: 14
              }}>
                Estimated Rating: <strong>{estimatedRating}</strong>
              </div>
              <button
                onClick={startAssessment}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  color: "#4CAF50",
                  border: "1px solid #4CAF50",
                  borderRadius: 8,
                  fontSize: 13,
                  cursor: "pointer"
                }}
              >
                Retake Assessment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <ActionCard
          icon="📚"
          title="Training"
          description="Structured lessons & exercises"
          onClick={() => setView("training")}
          color="#4CAF50"
        />
        <ActionCard
          icon="🔍"
          title="Game Analysis"
          description="Review your games with AI feedback"
          onClick={() => setView("analyze")}
          color="#2196F3"
        />
        <ActionCard
          icon="📊"
          title="Progress"
          description="Track your skill development"
          onClick={() => setView("progress")}
          color="#FF9800"
        />
      </div>

      {/* Daily training suggestion */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: 12,
        padding: 20
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.7, marginBottom: 12 }}>
          TODAY'S RECOMMENDED TRAINING
        </div>
        <DailyTrainingSuggestion
          completedSessions={completedSessions}
          estimatedRating={estimatedRating}
          onStartSession={(module, session) => {
            setSelectedModule(module);
            setSelectedSession(session);
            setView("session");
          }}
        />
      </div>

      {/* Skill overview */}
      <div style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: 12,
        padding: 20
      }}>
        <div style={{ 
          fontSize: 14, 
          fontWeight: 600, 
          opacity: 0.7, 
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span>SKILL OVERVIEW</span>
          <button
            onClick={() => setView("progress")}
            style={{
              padding: "6px 12px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 6,
              color: "#fff",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            View All →
          </button>
        </div>
        <SkillOverview skills={userSkills} />
      </div>
    </div>
  );

  // Render training view
  const renderTraining = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <button
          onClick={() => setView("home")}
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
        <h2 style={{ margin: 0, fontSize: 24 }}>📚 Training Modules</h2>
      </div>

      {/* Level tabs */}
      {["beginner", "intermediate", "advanced"].map(level => {
        const modules = getModulesByLevel(level);
        const isLocked = level === "advanced" && estimatedRating < 1600;
        
        return (
          <div key={level} style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 14,
              fontWeight: 600,
              textTransform: "uppercase",
              opacity: isLocked ? 0.5 : 0.8,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              {level === "beginner" && "🌱"}
              {level === "intermediate" && "🌿"}
              {level === "advanced" && "🌳"}
              {level} ({modules.length} modules)
              {isLocked && <span style={{ fontSize: 12 }}>🔒 1600+ required</span>}
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {modules.map(module => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  progress={calculateModuleProgress(module.id, completedSessions)}
                  locked={isLocked}
                  onClick={() => {
                    if (!isLocked) {
                      setSelectedModule(module);
                      setView("module");
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render module detail view
  const renderModule = () => {
    if (!selectedModule) return null;
    
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => { setSelectedModule(null); setView("training"); }}
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
        </div>

        <div style={{
          background: "rgba(0,0,0,0.2)",
          borderRadius: 16,
          padding: 24
        }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
            <span style={{ fontSize: 48 }}>{selectedModule.icon}</span>
            <div>
              <h2 style={{ margin: "0 0 8px 0" }}>{selectedModule.name}</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>{selectedModule.description}</p>
              <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
                <span style={{
                  padding: "4px 12px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12
                }}>
                  ⏱️ {selectedModule.estimatedTime}
                </span>
                <span style={{
                  padding: "4px 12px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12
                }}>
                  📖 {selectedModule.sessions.length} sessions
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, opacity: 0.7 }}>Progress</span>
              <span style={{ fontSize: 13 }}>
                {calculateModuleProgress(selectedModule.id, completedSessions)}%
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
                width: `${calculateModuleProgress(selectedModule.id, completedSessions)}%`,
                background: "#4CAF50",
                borderRadius: 4,
                transition: "width 0.3s"
              }} />
            </div>
          </div>

          {/* Sessions list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {selectedModule.sessions.map((session, idx) => {
              const isCompleted = completedSessions.includes(session.id);
              const isNext = !isCompleted && (idx === 0 || completedSessions.includes(selectedModule.sessions[idx - 1]?.id));
              
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    setSelectedSession(session);
                    setView("session");
                  }}
                  style={{
                    padding: 16,
                    background: isCompleted 
                      ? "rgba(76,175,80,0.15)" 
                      : isNext 
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    border: isNext ? "1px solid #4CAF50" : "1px solid transparent",
                    transition: "all 0.15s"
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: isCompleted ? "#4CAF50" : "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600
                  }}>
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{session.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.7 }}>{session.description}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 12, opacity: 0.6 }}>{session.duration} min</span>
                    <span style={{ fontSize: 16 }}>
                      {session.type === "lesson" && "📖"}
                      {session.type === "puzzles" && "🧩"}
                      {session.type === "game" && "♟️"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div style={{
      padding: 24,
      maxWidth: 900,
      margin: "0 auto"
    }}>
      {view === "home" && renderHome()}
      {view === "training" && renderTraining()}
      {view === "module" && renderModule()}
      {view === "session" && selectedSession && (
        <CoachingSession
          session={selectedSession}
          module={selectedModule}
          userSkills={userSkills}
          voice={voice}
          onComplete={(results) => completeSession(selectedSession.id, results)}
          onBack={() => {
            setSelectedSession(null);
            setView("module");
          }}
        />
      )}
      {view === "analyze" && (
        <GameAnalyzer
          game={gameToAnalyze}
          userSkills={userSkills}
          voice={voice}
          onBack={() => setView("home")}
          onSkillUpdate={(updates) => setUserSkills(prev => ({ ...prev, ...updates }))}
        />
      )}
      {view === "progress" && (
        <SkillProgress
          skills={userSkills}
          completedSessions={completedSessions}
          estimatedRating={estimatedRating}
          onBack={() => setView("home")}
        />
      )}
      {view === "assess" && (
        <SkillAssessment
          onComplete={completeAssessment}
          onBack={() => setView("home")}
        />
      )}

      {/* Back to main app button - always visible */}
      {view === "home" && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: 24,
          display: "flex",
          gap: 12,
          alignItems: "center"
        }}>
          <button
            onClick={onBack}
            style={{
              padding: "12px 20px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              cursor: "pointer",
              fontSize: 14
            }}
          >
            ← Back to App
          </button>
          
          {/* Voice Toggle */}
          <VoiceToggleButton voice={voice} size={20} />
          
          {/* Voice Settings Gear */}
          {voice.isSupported && (
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 8,
                padding: 10,
                cursor: "pointer",
                color: "#fff",
                display: "flex",
                alignItems: "center"
              }}
              title="Voice Settings"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Voice Settings Modal */}
      {showVoiceSettings && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}
          onClick={() => setShowVoiceSettings(false)}
        >
          <div 
            style={{
              background: "#1e1e1e",
              borderRadius: 16,
              padding: 24,
              minWidth: 350,
              maxWidth: 450
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#fff" }}>🔊 Coach Voice Settings</h3>
            <VoiceSettings voice={voice} />
            <button
              onClick={() => setShowVoiceSettings(false)}
              style={{
                marginTop: 20,
                padding: "10px 20px",
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                width: "100%"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function ActionCard({ icon, title, description, onClick, color }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 20,
        background: `${color}15`,
        borderRadius: 12,
        cursor: "pointer",
        border: `1px solid ${color}40`,
        transition: "all 0.15s"
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{description}</div>
    </div>
  );
}

function ModuleCard({ module, progress, locked, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: 16,
        background: locked ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
        borderRadius: 12,
        cursor: locked ? "default" : "pointer",
        opacity: locked ? 0.5 : 1,
        transition: "all 0.15s"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 28 }}>{module.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{module.name}</div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>{module.sessions.length} sessions</div>
        </div>
        {progress === 100 && <span style={{ fontSize: 20 }}>✅</span>}
      </div>
      
      <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 12 }}>
        {module.description}
      </div>
      
      {/* Progress bar */}
      <div style={{
        height: 6,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 3,
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: progress === 100 ? "#4CAF50" : "#FFC107",
          borderRadius: 3
        }} />
      </div>
    </div>
  );
}

function SkillOverview({ skills }) {
  const categories = Object.values(skillCategories);
  
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
      {categories.map(cat => {
        // Calculate average level for category
        const categorySkills = Object.keys(cat.skills);
        const levels = categorySkills.map(s => skills[s]?.level || 1);
        const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
        
        return (
          <div
            key={cat.id}
            style={{
              textAlign: "center",
              padding: 12,
              background: "rgba(255,255,255,0.05)",
              borderRadius: 8
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 4 }}>{cat.name}</div>
            <div style={{ 
              fontSize: 18, 
              fontWeight: 700,
              color: cat.color
            }}>
              {avgLevel.toFixed(1)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyTrainingSuggestion({ completedSessions, estimatedRating, onStartSession }) {
  // Find next incomplete session
  const modules = getAllModules();
  
  for (const module of modules) {
    for (const session of module.sessions) {
      if (!completedSessions.includes(session.id)) {
        return (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: 16,
            background: "rgba(76,175,80,0.1)",
            borderRadius: 12,
            border: "1px solid rgba(76,175,80,0.3)"
          }}>
            <span style={{ fontSize: 36 }}>{module.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{session.name}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {module.name} • {session.duration} min
              </div>
            </div>
            <button
              onClick={() => onStartSession(module, session)}
              style={{
                padding: "10px 20px",
                background: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Start →
            </button>
          </div>
        );
      }
    }
  }
  
  return (
    <div style={{ textAlign: "center", padding: 20, opacity: 0.7 }}>
      🎉 All sessions complete! Check back for new content.
    </div>
  );
}

function SkillAssessment({ onComplete, onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const questions = [
    {
      type: "choice",
      question: "How long have you been playing chess?",
      options: [
        { label: "Just started", value: 0 },
        { label: "Less than 1 year", value: 200 },
        { label: "1-3 years", value: 400 },
        { label: "3+ years", value: 600 }
      ]
    },
    {
      type: "choice",
      question: "Do you know basic checkmate patterns (back rank, smothered mate)?",
      options: [
        { label: "No", value: 0 },
        { label: "Some of them", value: 150 },
        { label: "Yes, most of them", value: 300 }
      ]
    },
    {
      type: "choice",
      question: "Can you consistently spot forks, pins, and skewers?",
      options: [
        { label: "Rarely", value: 0 },
        { label: "Sometimes", value: 200 },
        { label: "Usually", value: 400 },
        { label: "Almost always", value: 600 }
      ]
    },
    {
      type: "choice",
      question: "Do you have a preferred opening repertoire?",
      options: [
        { label: "No, I play random moves", value: 0 },
        { label: "I know a few openings", value: 150 },
        { label: "Yes, I have studied openings", value: 300 }
      ]
    },
    {
      type: "choice",
      question: "Can you win a King + Rook vs King endgame reliably?",
      options: [
        { label: "No", value: 0 },
        { label: "Usually", value: 200 },
        { label: "Yes, always", value: 300 }
      ]
    }
  ];
  
  const handleAnswer = (value) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate estimated rating
      const total = newAnswers.reduce((a, b) => a + b, 0);
      const estimated = 400 + total; // Base 400 + score
      onComplete(Math.min(Math.max(estimated, 400), 2000));
    }
  };
  
  const currentQ = questions[step];
  
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
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
        <h2 style={{ margin: 0 }}>🎯 Skill Assessment</h2>
      </div>
      
      {/* Progress */}
      <div style={{
        height: 8,
        background: "rgba(255,255,255,0.1)",
        borderRadius: 4,
        marginBottom: 32,
        overflow: "hidden"
      }}>
        <div style={{
          height: "100%",
          width: `${((step + 1) / questions.length) * 100}%`,
          background: "#4CAF50",
          transition: "width 0.3s"
        }} />
      </div>
      
      <div style={{
        background: "rgba(0,0,0,0.2)",
        borderRadius: 16,
        padding: 32
      }}>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>
          Question {step + 1} of {questions.length}
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
          {currentQ.question}
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(opt.value)}
              style={{
                padding: "16px 20px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                color: "#fff",
                textAlign: "left",
                fontSize: 15,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
