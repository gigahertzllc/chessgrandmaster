/**
 * Chess Skill Definitions
 * 
 * Comprehensive skill tree for chess training, based on established
 * coaching methodologies. Each skill has levels 1-5 representing
 * beginner to advanced mastery.
 */

export const skillCategories = {
  tactics: {
    id: "tactics",
    name: "Tactics",
    icon: "⚔️",
    description: "Short-term opportunities that win material or deliver checkmate",
    color: "#e53935",
    skills: {
      forks: {
        id: "forks",
        name: "Forks",
        description: "Attack two or more pieces simultaneously with one piece",
        levels: [
          { level: 1, name: "Knight Forks", description: "Recognize basic knight forks on king + piece" },
          { level: 2, name: "Pawn & Bishop Forks", description: "Spot forks with other pieces" },
          { level: 3, name: "Setting Up Forks", description: "Create fork opportunities with preparation moves" },
          { level: 4, name: "Fork Combinations", description: "Multi-move sequences leading to forks" },
          { level: 5, name: "Fork Mastery", description: "Spot complex forks in rapid time pressure" }
        ]
      },
      pins: {
        id: "pins",
        name: "Pins",
        description: "Immobilize a piece that shields a more valuable piece behind it",
        levels: [
          { level: 1, name: "Absolute Pins", description: "Recognize pins against the king" },
          { level: 2, name: "Relative Pins", description: "Spot pins against queen and other pieces" },
          { level: 3, name: "Exploiting Pins", description: "Add pressure to pinned pieces" },
          { level: 4, name: "Pin Combinations", description: "Create and exploit pins in sequences" },
          { level: 5, name: "Pin Mastery", description: "Advanced pin tactics in complex positions" }
        ]
      },
      skewers: {
        id: "skewers",
        name: "Skewers",
        description: "Attack a valuable piece that shields a less valuable piece behind it",
        levels: [
          { level: 1, name: "Basic Skewers", description: "Recognize skewers with rook and bishop" },
          { level: 2, name: "Queen Skewers", description: "Use queen for powerful skewer attacks" },
          { level: 3, name: "Setting Up Skewers", description: "Force pieces into skewerable positions" },
          { level: 4, name: "Skewer Combinations", description: "Multi-move skewer sequences" },
          { level: 5, name: "Skewer Mastery", description: "Advanced skewer patterns" }
        ]
      },
      discoveredAttacks: {
        id: "discoveredAttacks",
        name: "Discovered Attacks",
        description: "Move one piece to reveal an attack from another",
        levels: [
          { level: 1, name: "Basic Discoveries", description: "Recognize simple discovered attacks" },
          { level: 2, name: "Discovered Check", description: "Discoveries that give check" },
          { level: 3, name: "Double Check", description: "Both moving and revealed piece give check" },
          { level: 4, name: "Discovery Setup", description: "Create discovery opportunities" },
          { level: 5, name: "Discovery Mastery", description: "Complex discovery combinations" }
        ]
      },
      backRank: {
        id: "backRank",
        name: "Back Rank Tactics",
        description: "Exploit weakness of king trapped on back rank",
        levels: [
          { level: 1, name: "Basic Back Rank Mate", description: "Recognize back rank checkmate patterns" },
          { level: 2, name: "Back Rank Threats", description: "Use back rank weakness for material" },
          { level: 3, name: "Creating Weakness", description: "Force back rank vulnerabilities" },
          { level: 4, name: "Defense & Attack", description: "Defend and exploit back rank" },
          { level: 5, name: "Back Rank Mastery", description: "Complex back rank combinations" }
        ]
      },
      deflection: {
        id: "deflection",
        name: "Deflection",
        description: "Force a piece away from an important defensive duty",
        levels: [
          { level: 1, name: "Basic Deflection", description: "Recognize when a piece is overloaded" },
          { level: 2, name: "Deflection Sacrifices", description: "Sacrifice to deflect defenders" },
          { level: 3, name: "Overloading", description: "Attack pieces with multiple duties" },
          { level: 4, name: "Deflection Chains", description: "Sequential deflections" },
          { level: 5, name: "Deflection Mastery", description: "Complex deflection combinations" }
        ]
      },
      matingPatterns: {
        id: "matingPatterns",
        name: "Mating Patterns",
        description: "Recognize and execute checkmate patterns",
        levels: [
          { level: 1, name: "Basic Mates", description: "Scholar's, Fool's, Back Rank" },
          { level: 2, name: "Common Mates", description: "Smothered, Arabian, Anastasia's" },
          { level: 3, name: "Advanced Mates", description: "Boden's, Opera, Légal's" },
          { level: 4, name: "Mating Attacks", description: "Build positions leading to mate" },
          { level: 5, name: "Mating Mastery", description: "Spot complex mating nets" }
        ]
      }
    }
  },

  opening: {
    id: "opening",
    name: "Opening Principles",
    icon: "📖",
    description: "First phase fundamentals that set up successful middlegames",
    color: "#1e88e5",
    skills: {
      development: {
        id: "development",
        name: "Piece Development",
        description: "Get pieces off starting squares to active positions",
        levels: [
          { level: 1, name: "Basic Development", description: "Knights before bishops, one move per piece" },
          { level: 2, name: "Active Squares", description: "Place pieces on optimal squares" },
          { level: 3, name: "Development Tempo", description: "Gain time by developing with threats" },
          { level: 4, name: "Rapid Mobilization", description: "Complete development efficiently" },
          { level: 5, name: "Development Mastery", description: "Punish opponent's slow development" }
        ]
      },
      centerControl: {
        id: "centerControl",
        name: "Center Control",
        description: "Control the central squares e4, d4, e5, d5",
        levels: [
          { level: 1, name: "Pawn Center", description: "Place pawns in the center" },
          { level: 2, name: "Piece Control", description: "Control center with pieces" },
          { level: 3, name: "Flexible Center", description: "Adapt center strategy to position" },
          { level: 4, name: "Center Breaks", description: "Time pawn breaks effectively" },
          { level: 5, name: "Center Mastery", description: "Dynamic center play" }
        ]
      },
      kingSafety: {
        id: "kingSafety",
        name: "King Safety",
        description: "Protect your king, typically by castling",
        levels: [
          { level: 1, name: "Castling", description: "Castle early to safety" },
          { level: 2, name: "Pawn Shield", description: "Maintain protective pawn structure" },
          { level: 3, name: "Castling Direction", description: "Choose kingside or queenside wisely" },
          { level: 4, name: "King Defense", description: "Defend against attacks on castled king" },
          { level: 5, name: "King Safety Mastery", description: "Balance king safety and activity" }
        ]
      },
      openingTraps: {
        id: "openingTraps",
        name: "Opening Traps",
        description: "Know common traps to avoid and exploit",
        levels: [
          { level: 1, name: "Basic Traps", description: "Avoid common beginner traps" },
          { level: 2, name: "Trap Recognition", description: "Recognize trap patterns" },
          { level: 3, name: "Setting Traps", description: "Set traps for opponents" },
          { level: 4, name: "Trap Refutation", description: "Punish opponents who fall for traps" },
          { level: 5, name: "Trap Mastery", description: "Use traps as part of strategy" }
        ]
      }
    }
  },

  middlegame: {
    id: "middlegame",
    name: "Middlegame Strategy",
    icon: "♟️",
    description: "Strategic planning and piece coordination after the opening",
    color: "#7b1fa2",
    skills: {
      planning: {
        id: "planning",
        name: "Planning",
        description: "Form and execute long-term plans",
        levels: [
          { level: 1, name: "Basic Plans", description: "Recognize simple plans based on position" },
          { level: 2, name: "Candidate Moves", description: "Identify 3-4 candidate moves each turn" },
          { level: 3, name: "Plan Execution", description: "Follow through on strategic plans" },
          { level: 4, name: "Plan Adaptation", description: "Adjust plans based on opponent's moves" },
          { level: 5, name: "Planning Mastery", description: "Multi-layered strategic planning" }
        ]
      },
      pawnStructure: {
        id: "pawnStructure",
        name: "Pawn Structure",
        description: "Understand and exploit pawn formations",
        levels: [
          { level: 1, name: "Weak Pawns", description: "Identify isolated and doubled pawns" },
          { level: 2, name: "Pawn Chains", description: "Understand pawn chain dynamics" },
          { level: 3, name: "Pawn Breaks", description: "Time pawn breaks effectively" },
          { level: 4, name: "Structural Advantages", description: "Create lasting pawn advantages" },
          { level: 5, name: "Pawn Structure Mastery", description: "Advanced pawn play" }
        ]
      },
      pieceActivity: {
        id: "pieceActivity",
        name: "Piece Activity",
        description: "Keep pieces active and coordinated",
        levels: [
          { level: 1, name: "Active vs Passive", description: "Recognize active and passive pieces" },
          { level: 2, name: "Improving Pieces", description: "Find better squares for pieces" },
          { level: 3, name: "Piece Coordination", description: "Make pieces work together" },
          { level: 4, name: "Piece Exchanges", description: "Know when to trade pieces" },
          { level: 5, name: "Activity Mastery", description: "Maximize piece potential" }
        ]
      },
      attack: {
        id: "attack",
        name: "Attacking Play",
        description: "Launch and sustain attacks on the opponent's position",
        levels: [
          { level: 1, name: "Basic Attacks", description: "Recognize attacking opportunities" },
          { level: 2, name: "Kingside Attack", description: "Attack the castled king" },
          { level: 3, name: "Sacrificial Attacks", description: "Use sacrifices to break through" },
          { level: 4, name: "Sustained Pressure", description: "Maintain attacking momentum" },
          { level: 5, name: "Attack Mastery", description: "Devastating attacking play" }
        ]
      },
      defense: {
        id: "defense",
        name: "Defensive Play",
        description: "Hold difficult positions and find resources",
        levels: [
          { level: 1, name: "Basic Defense", description: "Defend attacked pieces" },
          { level: 2, name: "Prophylaxis", description: "Prevent opponent's plans" },
          { level: 3, name: "Active Defense", description: "Create counterplay while defending" },
          { level: 4, name: "Fortress Building", description: "Create impenetrable positions" },
          { level: 5, name: "Defense Mastery", description: "Save lost positions" }
        ]
      }
    }
  },

  endgame: {
    id: "endgame",
    name: "Endgame Technique",
    icon: "👑",
    description: "Final phase technique to convert advantages or save draws",
    color: "#ff9800",
    skills: {
      basicMates: {
        id: "basicMates",
        name: "Basic Checkmates",
        description: "Deliver checkmate with basic piece combinations",
        levels: [
          { level: 1, name: "Queen + King", description: "Mate with king and queen" },
          { level: 2, name: "Rook + King", description: "Mate with king and rook" },
          { level: 3, name: "Two Bishops", description: "Mate with two bishops" },
          { level: 4, name: "Bishop + Knight", description: "Mate with bishop and knight" },
          { level: 5, name: "Basic Mates Mastery", description: "Execute all basic mates quickly" }
        ]
      },
      kingActivity: {
        id: "kingActivity",
        name: "King Activity",
        description: "Use the king as an active piece in the endgame",
        levels: [
          { level: 1, name: "King Centralization", description: "Bring king to center in endgame" },
          { level: 2, name: "Opposition", description: "Understand basic opposition" },
          { level: 3, name: "Distant Opposition", description: "Use distant opposition" },
          { level: 4, name: "King Infiltration", description: "Penetrate with the king" },
          { level: 5, name: "King Activity Mastery", description: "Advanced king maneuvers" }
        ]
      },
      pawnEndgames: {
        id: "pawnEndgames",
        name: "Pawn Endgames",
        description: "Navigate king and pawn endings",
        levels: [
          { level: 1, name: "Key Squares", description: "Understand key squares for promotion" },
          { level: 2, name: "Square of the Pawn", description: "Calculate pawn races" },
          { level: 3, name: "Breakthrough", description: "Force pawn breakthroughs" },
          { level: 4, name: "Triangulation", description: "Lose a tempo with the king" },
          { level: 5, name: "Pawn Endgame Mastery", description: "Complex pawn endings" }
        ]
      },
      rookEndgames: {
        id: "rookEndgames",
        name: "Rook Endgames",
        description: "Most common endgame type - master it!",
        levels: [
          { level: 1, name: "Lucena Position", description: "Win the Lucena position" },
          { level: 2, name: "Philidor Position", description: "Draw with Philidor defense" },
          { level: 3, name: "Active Rook", description: "Keep the rook active" },
          { level: 4, name: "Rook + Pawns", description: "Complex rook and pawn endings" },
          { level: 5, name: "Rook Endgame Mastery", description: "Advanced rook technique" }
        ]
      }
    }
  },

  calculation: {
    id: "calculation",
    name: "Calculation",
    icon: "🧠",
    description: "Concrete move calculation and visualization",
    color: "#00897b",
    skills: {
      depth: {
        id: "depth",
        name: "Calculation Depth",
        description: "See further ahead in variations",
        levels: [
          { level: 1, name: "2-Ply Calculation", description: "Calculate 1 move for each side" },
          { level: 2, name: "4-Ply Calculation", description: "Calculate 2 moves for each side" },
          { level: 3, name: "6-Ply Calculation", description: "Calculate 3 moves for each side" },
          { level: 4, name: "8-Ply Calculation", description: "Calculate 4 moves for each side" },
          { level: 5, name: "Deep Calculation", description: "Calculate 5+ moves for each side" }
        ]
      },
      accuracy: {
        id: "accuracy",
        name: "Move Accuracy",
        description: "Find the best moves consistently",
        levels: [
          { level: 1, name: "Avoiding Blunders", description: "Don't hang pieces" },
          { level: 2, name: "Reducing Mistakes", description: "Minimize serious errors" },
          { level: 3, name: "Consistent Play", description: "Play solidly throughout" },
          { level: 4, name: "High Accuracy", description: "Match engine moves frequently" },
          { level: 5, name: "Precision", description: "Near-optimal play" }
        ]
      },
      visualization: {
        id: "visualization",
        name: "Visualization",
        description: "See positions in your mind without moving pieces",
        levels: [
          { level: 1, name: "Basic Visualization", description: "Track piece positions mentally" },
          { level: 2, name: "Short Sequences", description: "Visualize 2-3 move sequences" },
          { level: 3, name: "Complex Positions", description: "Handle multiple pieces mentally" },
          { level: 4, name: "Blindfold Practice", description: "Play positions without seeing board" },
          { level: 5, name: "Visualization Mastery", description: "Advanced mental calculation" }
        ]
      }
    }
  }
};

// Flatten skills for easy access
export function getAllSkills() {
  const skills = [];
  Object.values(skillCategories).forEach(category => {
    Object.values(category.skills).forEach(skill => {
      skills.push({
        ...skill,
        categoryId: category.id,
        categoryName: category.name,
        categoryColor: category.color
      });
    });
  });
  return skills;
}

// Get skill by ID
export function getSkillById(skillId) {
  for (const category of Object.values(skillCategories)) {
    if (category.skills[skillId]) {
      return {
        ...category.skills[skillId],
        categoryId: category.id,
        categoryName: category.name,
        categoryColor: category.color
      };
    }
  }
  return null;
}

// Rating to approximate skill level
export function ratingToSkillLevel(rating) {
  if (rating < 800) return 1;
  if (rating < 1200) return 2;
  if (rating < 1600) return 3;
  if (rating < 2000) return 4;
  return 5;
}

// Skill level to approximate rating
export function skillLevelToRating(level) {
  const ratings = [600, 1000, 1400, 1800, 2200];
  return ratings[Math.min(level - 1, 4)];
}
