/* eslint-disable no-restricted-globals */

/**
 * Stockfish Web Worker
 * Loads Stockfish from CDN automatically - no local file needed!
 */

let engine = null;
let isReady = false;

// Load Stockfish from CDN
const STOCKFISH_CDN = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";

function post(msg) {
  self.postMessage(msg);
}

async function loadEngine() {
  if (engine) return engine;
  
  try {
    // Import Stockfish from CDN
    importScripts(STOCKFISH_CDN);
    
    // STOCKFISH is now available as a global function
    engine = STOCKFISH();
    
    engine.onmessage = (line) => {
      post({ type: "engine_line", line });
    };
    
    return engine;
  } catch (err) {
    post({ type: "error", message: "Failed to load Stockfish: " + err.message });
    throw err;
  }
}

function send(cmd) {
  if (engine) {
    engine.postMessage(cmd);
  }
}

function setOptionsForProfile(profile) {
  if (!profile) return;
  // Set skill level (0-20)
  send(`setoption name Skill Level value ${profile.skillLevel ?? 20}`);
}

self.onmessage = async (evt) => {
  const data = evt.data;

  if (data.type === "init") {
    try {
      await loadEngine();
      send("uci");
      send("isready");
      isReady = true;
      post({ type: "ready" });
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
