/* eslint-disable no-restricted-globals */

/**
 * Stockfish Web Worker
 * Loads Stockfish from CDN automatically - no local file needed!
 * Updated with better error handling and logging
 */

let engine = null;
let isReady = false;

// Stockfish CDN URL
const STOCKFISH_CDN = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";

function post(msg) {
  self.postMessage(msg);
}

function log(message) {
  post({ type: "log", message });
  console.log("[Stockfish Worker]", message);
}

async function loadEngine() {
  if (engine) return engine;
  
  log("Loading Stockfish from CDN...");
  
  try {
    // Import Stockfish from CDN
    importScripts(STOCKFISH_CDN);
    log("Stockfish script loaded");
    
    // Check if STOCKFISH is available
    if (typeof STOCKFISH === "undefined") {
      throw new Error("STOCKFISH global not found after loading script");
    }
    
    // Initialize engine
    engine = STOCKFISH();
    log("Stockfish engine initialized");
    
    // Set up message handler
    engine.onmessage = (line) => {
      // Stockfish.js passes the line directly as a string
      const lineStr = typeof line === "string" ? line : String(line);
      post({ type: "engine_line", line: lineStr });
      
      // Log important messages
      if (lineStr.startsWith("uciok") || lineStr.startsWith("readyok") || lineStr.startsWith("bestmove")) {
        log("Engine: " + lineStr.substring(0, 50));
      }
    };
    
    return engine;
  } catch (err) {
    const errorMsg = "Failed to load Stockfish: " + err.message;
    log("ERROR: " + errorMsg);
    post({ type: "error", message: errorMsg });
    throw err;
  }
}

function send(cmd) {
  if (engine) {
    log("Sending: " + cmd);
    engine.postMessage(cmd);
  } else {
    log("Warning: Engine not loaded, cannot send: " + cmd);
  }
}

function setOptionsForProfile(profile) {
  if (!profile) return;
  // Set skill level (0-20)
  const skillLevel = profile.skillLevel ?? 20;
  log("Setting skill level to: " + skillLevel);
  send(`setoption name Skill Level value ${skillLevel}`);
}

self.onmessage = async (evt) => {
  const data = evt.data;
  log("Received message: " + data.type);

  if (data.type === "init") {
    try {
      await loadEngine();
      send("uci");
      send("isready");
      isReady = true;
      post({ type: "ready" });
      log("Engine ready!");
    } catch (err) {
      post({ type: "error", message: err.message });
    }
    return;
  }

  if (!isReady) {
    post({ type: "error", message: "Engine not ready yet" });
    return;
  }

  if (data.type === "set_profile") {
    setOptionsForProfile(data.profile);
    send("isready");
    return;
  }

  if (data.type === "analyze") {
    if (data.profile) {
      setOptionsForProfile(data.profile);
    }
    send("position fen " + data.fen);
    send("go movetime " + (data.movetimeMs ?? 200));
    return;
  }

  if (data.type === "stop") {
    send("stop");
    return;
  }
};
