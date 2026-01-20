/**
 * Chess Coaching Module
 * 
 * A comprehensive chess training system with:
 * - Skill assessment
 * - Structured curriculum
 * - AI-powered game analysis
 * - Progress tracking
 * - Tactical puzzle training
 */

export { default as ChessCoach } from "./ChessCoach.jsx";
export { default as CoachingSession } from "./CoachingSession.jsx";
export { default as GameAnalyzer } from "./GameAnalyzer.jsx";
export { default as SkillProgress } from "./SkillProgress.jsx";
export { default as useAICoach, generateMoveFeedback, generateGameSummary, getSkillTip, SKILL_TIPS } from "./useAICoach.js";

export * from "./data/skillDefinitions.js";
export * from "./data/curriculum.js";
export * from "./data/puzzles.js";
