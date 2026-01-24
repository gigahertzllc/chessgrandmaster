/**
 * AI Coaching Hook
 * 
 * Integrates Claude API for intelligent chess coaching feedback.
 * Uses Stockfish evaluations + Claude explanations for personalized coaching.
 * 
 * SETUP FOR VERCEL:
 * 1. Go to Vercel Project → Settings → Environment Variables
 * 2. Add: ANTHROPIC_API_KEY = sk-ant-api03-...
 * 3. Redeploy
 * 
 * The API key is stored server-side only (in /api/coach.js)
 * and never exposed to the browser.
 */

import { useState, useCallback } from "react";

// API endpoint - uses Vercel serverless function in production
const COACH_API_ENDPOINT = '/api/coach';

// Coach personality prompt
const COACH_SYSTEM_PROMPT = `You are a friendly, encouraging chess coach. Your student is learning to improve their chess game.

Your coaching style:
- Be warm and supportive, like a mentor who genuinely wants to see them succeed
- Celebrate good moves with enthusiasm
- Frame mistakes as learning opportunities, never criticisms  
- Use simple language, avoid jargon unless explaining a concept
- Give concrete, actionable advice
- Reference their specific moves and positions
- Keep responses concise (2-3 sentences for quick feedback, 1-2 short paragraphs for detailed analysis)

When analyzing moves:
- Explain WHY a move was good or bad, not just that it was
- Connect mistakes to general principles they can apply in future games
- Point out patterns they can watch for
- Suggest what to look for in similar positions`;

// Skill categories for feedback
const SKILL_AREAS = {
  tactics: ["forks", "pins", "skewers", "discovered attacks", "back rank threats", "mating patterns"],
  opening: ["development", "center control", "king safety", "pawn structure"],
  middlegame: ["piece activity", "planning", "attack", "defense"],
  endgame: ["king activity", "pawn endings", "rook endings"],
  calculation: ["visualization", "calculating variations", "avoiding blunders"]
};

// Generate coaching feedback for a move
export function generateMoveFeedback(move, classification, position, context = {}) {
  const { evalBefore, evalAfter, bestMove, turn } = context;
  
  // Build context for the AI
  const prompt = buildFeedbackPrompt(move, classification, {
    evalBefore,
    evalAfter,
    bestMove,
    turn,
    position
  });
  
  // Try AI-powered feedback, fall back to rule-based
  return getCoachingResponse(prompt, classification);
}

// Build a prompt for move feedback
function buildFeedbackPrompt(move, classification, context) {
  const { evalBefore, evalAfter, bestMove, turn } = context;
  const side = turn === 'w' ? 'White' : 'Black';
  const evalChange = evalAfter - evalBefore;
  
  let prompt = `My student (playing ${side}) just played ${move.san}.\n\n`;
  
  if (classification.type === "blunder") {
    prompt += `This was a blunder - the evaluation dropped significantly.`;
    if (bestMove) prompt += ` A better move was ${bestMove}.`;
    prompt += `\n\nGive brief, encouraging feedback explaining why this was a mistake and what to look for next time. Don't be harsh.`;
  } else if (classification.type === "mistake") {
    prompt += `This was a mistake that gave away some advantage.`;
    if (bestMove) prompt += ` ${bestMove} was better.`;
    prompt += `\n\nGive brief feedback on what went wrong and how to avoid this in the future.`;
  } else if (classification.type === "inaccuracy") {
    prompt += `This was a small inaccuracy - playable but not optimal.`;
    prompt += `\n\nBriefly mention this was okay but there was something slightly better.`;
  } else if (classification.type === "excellent" || classification.type === "good") {
    prompt += `This was a ${classification.type} move that improved the position!`;
    prompt += `\n\nGive brief, enthusiastic praise and explain why this was a good move.`;
  }
  
  return prompt;
}

// Get coaching response (AI or fallback)
async function getCoachingResponse(prompt, classification) {
  try {
    const response = await fetch(COACH_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        system: COACH_SYSTEM_PROMPT,
        maxTokens: 150
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.text) return data.text;
    } else {
      const error = await response.json();
      console.log("Coach API response:", error);
    }
  } catch (e) {
    console.log("AI coach unavailable:", e.message);
  }
  
  // Fallback to rule-based feedback
  return getRuleBasedFeedback(classification);
}

// Rule-based feedback when AI is unavailable
export function getRuleBasedFeedback(classification) {
  const feedbackByType = {
    blunder: [
      "Oops! This move gave away significant material or position. Before moving, always check: is my piece safe? Is my opponent threatening anything?",
      "This was a costly mistake. Take a moment to scan for your opponent's threats before each move - it's a habit that will save you many games!",
      "A tough moment, but these are the best learning opportunities. The key is to ask yourself 'what can my opponent do after this move?'"
    ],
    mistake: [
      "This move wasn't ideal and gave your opponent an edge. Try to consider 2-3 candidate moves before deciding.",
      "A slight slip here. When you have time, pause to ask: does this move improve my position, or does it just look active?",
      "Not the best choice in this position. Remember to check for tactical opportunities before settling on a move."
    ],
    inaccuracy: [
      "This was okay, but there was something slightly better. Small edges like this add up over a game!",
      "A reasonable move, though you had an even better option. Keep looking for the best move, not just a good one.",
      "Close! You're on the right track, but try to squeeze a bit more from each position."
    ],
    good: [
      "Nice move! You're making progress.",
      "Good choice! You found a solid continuation.",
      "Well played! That's the kind of move that wins games."
    ],
    excellent: [
      "Excellent! You found the best move here! 🎉",
      "Brilliant! That's exactly what a strong player would do!",
      "Perfect! You're really developing your chess intuition!"
    ],
    normal: [
      "A solid move. The game continues!",
      "Reasonable choice. Keep up the steady play.",
      "That works! On to the next move."
    ]
  };
  
  const options = feedbackByType[classification.type] || feedbackByType.normal;
  return options[Math.floor(Math.random() * options.length)];
}

// Generate game summary coaching
export async function generateGameSummary(analysis, gameInfo = {}) {
  const blunders = analysis.filter(a => a.classification.type === "blunder");
  const mistakes = analysis.filter(a => a.classification.type === "mistake");
  const excellent = analysis.filter(a => a.classification.type === "excellent");
  
  const accuracy = Math.round(
    ((analysis.length - blunders.length * 3 - mistakes.length * 2) / analysis.length) * 100
  );
  
  // Identify patterns
  const patterns = identifyPatterns(analysis);
  
  const prompt = `Summarize this chess game for my student:

Game stats:
- ${analysis.length} total moves
- ${blunders.length} blunders  
- ${mistakes.length} mistakes
- ${excellent.length} excellent moves
- ${Math.max(0, accuracy)}% accuracy

Patterns noticed:
${patterns.join("\n")}

Give a 2-3 sentence encouraging summary highlighting what went well and one specific area to focus on improving. Be warm and supportive.`;

  try {
    const response = await fetch(COACH_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        system: COACH_SYSTEM_PROMPT,
        maxTokens: 200
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.text) return data.text;
    }
  } catch (e) {
    console.log("AI summary unavailable:", e.message);
  }
  
  // Fallback summary
  if (accuracy >= 80) {
    return `Great game! You played with ${accuracy}% accuracy and made ${excellent.length} excellent moves. Your tactical awareness is improving - keep up the solid play!`;
  } else if (accuracy >= 60) {
    return `Good effort! You showed some nice ideas with ${excellent.length} strong moves. Focus on checking for your opponent's threats before each move to reduce those ${blunders.length + mistakes.length} costly errors.`;
  } else {
    return `Every game is a chance to learn! You had ${mistakes.length + blunders.length} moments that cost you, but that's normal while improving. Try slowing down and asking "what can my opponent do?" before each move.`;
  }
}

// Identify patterns in play for coaching
function identifyPatterns(analysis) {
  const patterns = [];
  
  // Check for opening phase issues
  const openingMoves = analysis.slice(0, 10);
  const openingBlunders = openingMoves.filter(a => 
    a.classification.type === "blunder" || a.classification.type === "mistake"
  );
  if (openingBlunders.length >= 2) {
    patterns.push("- Opening phase had some rough spots - consider studying basic opening principles");
  }
  
  // Check for tactical oversights
  const tacticalErrors = analysis.filter(a => 
    a.classification.type === "blunder" && a.move.captured
  );
  if (tacticalErrors.length >= 2) {
    patterns.push("- Several pieces were lost to tactics - practice checking for threats before moving");
  }
  
  // Check for late-game issues
  const endgameMoves = analysis.slice(-15);
  const endgameErrors = endgameMoves.filter(a => 
    a.classification.type === "blunder" || a.classification.type === "mistake"
  );
  if (endgameErrors.length >= 2) {
    patterns.push("- Endgame had some inaccuracies - endgame technique is worth studying");
  }
  
  // Check for consistent solid play
  const excellentMoves = analysis.filter(a => 
    a.classification.type === "excellent" || a.classification.type === "good"
  );
  if (excellentMoves.length >= analysis.length * 0.3) {
    patterns.push("- Found many good moves - pattern recognition is developing nicely!");
  }
  
  if (patterns.length === 0) {
    patterns.push("- Generally solid play throughout the game");
  }
  
  return patterns;
}

// Coaching tips for specific skill areas
export const SKILL_TIPS = {
  forks: [
    "A fork attacks two pieces at once with one piece - knights are especially good at this!",
    "Look for squares where your knight can check the king while attacking another piece.",
    "Before you move, ask: can any of my pieces attack two things at once?"
  ],
  pins: [
    "A pin freezes a piece in place because moving it would expose something more valuable behind it.",
    "Bishops and rooks create pins - look for pieces in a line with a more valuable piece behind them.",
    "When you have a pin, pile more pressure on the pinned piece!"
  ],
  skewers: [
    "A skewer is like a reverse pin - attack the valuable piece, and when it moves, capture what's behind it.",
    "Skewers often happen with rooks on open files and bishops on long diagonals.",
    "Check for skewer opportunities when your opponent's king and queen are aligned."
  ],
  development: [
    "In the opening, aim to move each piece once before moving any piece twice.",
    "Knights before bishops is a good rule of thumb - knights take longer to find good squares.",
    "Connect your rooks by castling and moving your queen - this completes your development."
  ],
  centerControl: [
    "The center (e4, d4, e5, d5) is the most important area - pieces there control more squares.",
    "Pawns in the center support your pieces and limit your opponent's options.",
    "Even if you can't occupy the center, try to control it with pieces from a distance."
  ],
  calculation: [
    "Before moving, visualize the position after your move and your opponent's likely response.",
    "Start by looking at all checks, captures, and threats - these are the most forcing moves.",
    "Practice calculating 2-3 moves ahead before making your decision."
  ]
};

// Get a random tip for a skill area
export function getSkillTip(skillArea) {
  const tips = SKILL_TIPS[skillArea];
  if (!tips) return null;
  return tips[Math.floor(Math.random() * tips.length)];
}

// React hook for AI coaching
export function useAICoach() {
  const [isLoading, setIsLoading] = useState(false);
  const [lastFeedback, setLastFeedback] = useState(null);
  
  const getMoveFeedback = useCallback(async (move, classification, context) => {
    setIsLoading(true);
    try {
      const feedback = await generateMoveFeedback(move, classification, context);
      setLastFeedback(feedback);
      return feedback;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const getGameSummary = useCallback(async (analysis) => {
    setIsLoading(true);
    try {
      const summary = await generateGameSummary(analysis);
      return summary;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    lastFeedback,
    getMoveFeedback,
    getGameSummary,
    getSkillTip
  };
}

export default useAICoach;
