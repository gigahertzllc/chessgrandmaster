/**
 * Chess Coaching Module
 * 
 * A comprehensive chess training system with:
 * - Skill assessment
 * - Structured curriculum
 * - AI-powered game analysis
 * - Progress tracking
 * - Tactical puzzle training
 * - Voice feedback
 */

export { default as ChessCoach } from "./ChessCoach.jsx";
export { default as CoachingSession } from "./CoachingSession.jsx";
export { default as GameAnalyzer } from "./GameAnalyzer.jsx";
export { default as SkillProgress } from "./SkillProgress.jsx";
export { default as PuzzleTrainer } from "./PuzzleTrainer.jsx";
export { default as InteractiveLesson } from "./InteractiveLesson.jsx";
export { default as useAICoach, generateMoveFeedback, generateGameSummary, getSkillTip, SKILL_TIPS } from "./useAICoach.js";
export { default as useCoachVoice, VoiceToggleButton, VoiceSettings } from "./useCoachVoice.jsx";

export * from "./data/skillDefinitions.js";
export * from "./data/curriculum.js";
export * from "./data/puzzles.js";
