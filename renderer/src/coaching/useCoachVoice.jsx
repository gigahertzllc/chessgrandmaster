/**
 * Coach Voice Hook
 * 
 * Text-to-speech for chess coach feedback using Web Speech API.
 * No API key required - uses browser's built-in speech synthesis.
 */

import { useState, useEffect, useCallback, useRef } from "react";

// Voice preferences for the coach
const COACH_VOICE_PREFERENCES = [
  // Prefer natural-sounding voices
  "Google UK English Male",
  "Google UK English Female", 
  "Google US English",
  "Microsoft David",
  "Microsoft Zira",
  "Samantha",  // macOS
  "Daniel",    // macOS UK
  "Alex",      // macOS
  "en-US",
  "en-GB"
];

export function useCoachVoice() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);  // 0.5 - 2.0
  const [pitch, setPitch] = useState(1.0); // 0.5 - 2.0
  const utteranceRef = useRef(null);

  // Check for speech synthesis support
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
      
      // Load voices (may be async)
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          setVoices(availableVoices);
          
          // Find best voice
          const bestVoice = findBestVoice(availableVoices);
          setSelectedVoice(bestVoice);
        }
      };

      loadVoices();
      
      // Chrome loads voices async
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Load saved preference
      const savedEnabled = localStorage.getItem("coachVoiceEnabled");
      if (savedEnabled === "true") {
        setIsEnabled(true);
      }
    }
  }, []);

  // Find the best available voice
  function findBestVoice(availableVoices) {
    // Try each preferred voice
    for (const pref of COACH_VOICE_PREFERENCES) {
      const match = availableVoices.find(v => 
        v.name.includes(pref) || v.lang.startsWith(pref)
      );
      if (match) return match;
    }
    
    // Fallback to any English voice
    const englishVoice = availableVoices.find(v => v.lang.startsWith("en"));
    if (englishVoice) return englishVoice;
    
    // Last resort: first available
    return availableVoices[0];
  }

  // Speak text
  const speak = useCallback((text) => {
    if (!isSupported || !isEnabled || !text) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Clean up text for speech
    const cleanText = text
      .replace(/[🎉✨🏆⚔️📖♟️👑🧠💡]/g, "") // Remove emojis
      .replace(/\*\*/g, "")  // Remove markdown bold
      .replace(/\n+/g, ". ") // Convert newlines to pauses
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, isEnabled, selectedVoice, rate, pitch]);

  // Stop speaking
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // Toggle voice on/off
  const toggleEnabled = useCallback(() => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem("coachVoiceEnabled", String(newValue));
    
    if (!newValue) {
      stop();
    }
  }, [isEnabled, stop]);

  // Get available English voices for settings
  const englishVoices = voices.filter(v => v.lang.startsWith("en"));

  return {
    isSupported,
    isEnabled,
    isSpeaking,
    speak,
    stop,
    toggleEnabled,
    voices: englishVoices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch
  };
}

// Simple component for voice toggle button
export function VoiceToggleButton({ voice, size = 24 }) {
  if (!voice.isSupported) return null;

  return (
    <button
      onClick={voice.toggleEnabled}
      style={{
        background: voice.isEnabled ? "#4CAF50" : "#666",
        border: "none",
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#fff",
        fontSize: 14,
        transition: "background 0.2s"
      }}
      title={voice.isEnabled ? "Voice On (click to mute)" : "Voice Off (click to enable)"}
    >
      {voice.isEnabled ? (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      )}
      {voice.isSpeaking ? "Speaking..." : voice.isEnabled ? "Voice On" : "Voice Off"}
    </button>
  );
}

// Voice settings panel component
export function VoiceSettings({ voice }) {
  if (!voice.isSupported) {
    return <p style={{ color: "#999" }}>Voice not supported in this browser.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Enable toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <label style={{ minWidth: 80 }}>Voice:</label>
        <VoiceToggleButton voice={voice} />
      </div>

      {voice.isEnabled && (
        <>
          {/* Voice selection */}
          {voice.voices.length > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ minWidth: 80 }}>Voice:</label>
              <select
                value={voice.selectedVoice?.name || ""}
                onChange={(e) => {
                  const v = voice.voices.find(x => x.name === e.target.value);
                  if (v) voice.setSelectedVoice(v);
                }}
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #444",
                  background: "#333",
                  color: "#fff",
                  flex: 1
                }}
              >
                {voice.voices.map(v => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Speed slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ minWidth: 80 }}>Speed:</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={voice.rate}
              onChange={(e) => voice.setRate(parseFloat(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ minWidth: 40 }}>{voice.rate}x</span>
          </div>

          {/* Pitch slider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ minWidth: 80 }}>Pitch:</label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={voice.pitch}
              onChange={(e) => voice.setPitch(parseFloat(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ minWidth: 40 }}>{voice.pitch}</span>
          </div>

          {/* Test button */}
          <button
            onClick={() => voice.speak("Hello! I'm your chess coach. Let's improve your game together!")}
            disabled={voice.isSpeaking}
            style={{
              padding: "10px 20px",
              background: voice.isSpeaking ? "#666" : "#2196F3",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: voice.isSpeaking ? "not-allowed" : "pointer",
              alignSelf: "flex-start"
            }}
          >
            {voice.isSpeaking ? "Speaking..." : "Test Voice"}
          </button>
        </>
      )}
    </div>
  );
}

export default useCoachVoice;
