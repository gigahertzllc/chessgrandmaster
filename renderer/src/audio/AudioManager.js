/**
 * AudioManager - Lo-fi music player for Zone Mode
 * Supports crossfades, shuffle (no annoying repeats), and mode-based playlists
 * Loads tracks from Supabase (with fallback to static playlist.json)
 */

import { db, supabase } from '../supabase.js';

class AudioManager {
  constructor(options = {}) {
    this.crossfadeSeconds = options.crossfadeSeconds ?? 2.0;
    this.volume = options.defaultVolume ?? 0.22;
    this.avoidRepeatWindow = options.avoidRepeatWindow ?? 3;

    this.audioA = this.makeAudio();
    this.audioB = this.makeAudio();
    this.currentIsA = true;

    this.manifest = null;
    this.tracksById = new Map();

    this.mode = "zone";
    this.modeQueue = [];
    this.history = [];

    this.muted = false;
    this.isPlaying = false;
    this.userHasInteracted = false;
    this.currentTrack = null;

    // Event listeners for auto-advance
    this.audioA.addEventListener("ended", () => this.onEnded(this.audioA));
    this.audioB.addEventListener("ended", () => this.onEnded(this.audioB));

    // Callbacks
    this.onTrackChange = null;
    this.onPlayStateChange = null;
  }

  makeAudio() {
    const a = new Audio();
    a.preload = "auto";
    a.loop = false;
    a.volume = 0;
    return a;
  }

  /**
   * Must be called after first user interaction (click/tap/keydown)
   */
  markUserInteracted() {
    this.userHasInteracted = true;
  }

  /**
   * Load tracks - tries Supabase first, then falls back to static playlist.json
   */
  async loadManifest(url = "/audio/lofi/playlist.json") {
    // Try loading from Supabase first
    if (supabase) {
      try {
        const { data: tracks, error } = await db.getAudioTracks();
        if (!error && tracks && tracks.length > 0) {
          console.log("AudioManager: Loaded", tracks.length, "tracks from Supabase");
          this.manifest = this.convertSupabaseTracks(tracks);
          this.updateTracksMap();
          this.setMode(this.mode);
          return;
        }
      } catch (err) {
        console.warn("AudioManager: Supabase load failed, trying static file", err);
      }
    }

    // Fallback to static playlist.json
    try {
      const resp = await fetch(url, { cache: "no-cache" });
      if (resp.ok) {
        this.manifest = await resp.json();
      } else {
        console.warn("AudioManager: Using default manifest");
        this.manifest = this.getDefaultManifest();
      }
    } catch (err) {
      console.warn("AudioManager: Failed to load manifest, using default", err);
      this.manifest = this.getDefaultManifest();
    }

    this.updateTracksMap();
    this.setMode(this.mode);
  }

  updateTracksMap() {
    this.tracksById.clear();
    for (const t of this.manifest.tracks) {
      this.tracksById.set(t.id, t);
    }
  }

  /**
   * Convert Supabase tracks to manifest format
   */
  convertSupabaseTracks(tracks) {
    const manifestTracks = tracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      file: t.file_url,
      artwork: t.artwork_url,
      duration: t.duration,
      tags: t.tags || []
    }));

    // Build modes from track modes arrays
    const modes = {
      zone: [],
      casual: [],
      puzzle: [],
      analysis: [],
      menu: []
    };

    tracks.forEach(t => {
      const trackModes = t.modes || ['zone'];
      trackModes.forEach(mode => {
        if (modes[mode]) {
          modes[mode].push(t.id);
        }
      });
    });

    return {
      version: 2,
      source: 'supabase',
      tracks: manifestTracks,
      modes
    };
  }

  getDefaultManifest() {
    return {
      version: 1,
      tracks: [
        { id: "lofi_study", title: "Lo-fi Study", file: "/audio/lofi/lofi_study.mp3", tags: ["focus", "casual"] },
        { id: "empty_mind", title: "Empty Mind", file: "/audio/lofi/empty_mind.mp3", tags: ["zone", "focus"] },
        { id: "slow_motion", title: "Slow Motion", file: "/audio/lofi/slow_motion.mp3", tags: ["zone", "endgame"] },
        { id: "coffee_break", title: "Coffee Break", file: "/audio/lofi/coffee_break.mp3", tags: ["menu", "casual"] },
        { id: "calm_night", title: "Calm Night", file: "/audio/lofi/calm_night.mp3", tags: ["casual", "focus"] },
        { id: "floating", title: "Floating", file: "/audio/lofi/floating.mp3", tags: ["ambient", "puzzle"] }
      ],
      modes: {
        menu: ["coffee_break", "calm_night"],
        casual: ["lofi_study", "calm_night", "coffee_break"],
        zone: ["empty_mind", "slow_motion", "calm_night", "floating", "lofi_study"],
        puzzle: ["floating", "empty_mind"],
        analysis: ["lofi_study", "slow_motion", "calm_night"]
      }
    };
  }

  /**
   * Set the music mode (changes which tracks play)
   */
  setMode(mode) {
    this.mode = mode;
    this.rebuildQueueForMode(mode);

    if (this.isPlaying) {
      this.playNext(true);
    }
  }

  getMode() {
    return this.mode;
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    const active = this.getActiveAudio();
    active.volume = this.muted ? 0 : this.volume;
  }

  getVolume() {
    return this.volume;
  }

  /**
   * Mute/unmute
   */
  setMuted(muted) {
    this.muted = muted;
    const a = this.getActiveAudio();
    const b = this.getInactiveAudio();
    a.volume = muted ? 0 : this.volume;
    b.volume = muted ? 0 : b.volume;
  }

  getMuted() {
    return this.muted;
  }

  /**
   * Start playing
   */
  async play() {
    if (!this.userHasInteracted) {
      return false;
    }

    if (!this.manifest) {
      await this.loadManifest();
    }

    if (this.isPlaying) {
      return true;
    }

    this.isPlaying = true;
    this.onPlayStateChange?.(true);
    await this.playNext(false);
    return true;
  }

  /**
   * Pause playback
   */
  pause() {
    this.isPlaying = false;
    this.audioA.pause();
    this.audioB.pause();
    this.onPlayStateChange?.(false);
  }

  /**
   * Toggle play/pause
   */
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Skip to next track
   */
  async skip() {
    if (!this.isPlaying) return;
    await this.playNext(true);
  }

  /**
   * Get currently playing track info
   */
  getCurrentTrack() {
    return this.currentTrack;
  }

  /**
   * Check if playing
   */
  getIsPlaying() {
    return this.isPlaying;
  }

  // Private methods

  rebuildQueueForMode(mode) {
    if (!this.manifest) {
      this.modeQueue = [];
      return;
    }

    const ids = this.manifest.modes[mode] ?? this.manifest.modes.zone ?? [];
    const tracks = [];

    for (const id of ids) {
      const t = this.tracksById.get(id);
      if (t) tracks.push(t);
    }

    this.modeQueue = tracks;
  }

  pickNextTrack() {
    if (!this.manifest) return null;
    if (this.modeQueue.length === 0) return null;

    // Shuffle with repeat-avoid window
    const recent = new Set(this.history.slice(-this.avoidRepeatWindow));
    const candidates = this.modeQueue.filter(t => !recent.has(t.id));

    const pool = candidates.length > 0 ? candidates : this.modeQueue;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx] ?? null;
  }

  getActiveAudio() {
    return this.currentIsA ? this.audioA : this.audioB;
  }

  getInactiveAudio() {
    return this.currentIsA ? this.audioB : this.audioA;
  }

  async playNext(forceCrossfade) {
    const next = this.pickNextTrack();
    if (!next) return;

    this.history.push(next.id);
    if (this.history.length > 50) {
      this.history = this.history.slice(-25);
    }

    this.currentTrack = next;
    this.onTrackChange?.(next);

    const incoming = this.getInactiveAudio();
    const outgoing = this.getActiveAudio();

    incoming.src = next.file;
    incoming.currentTime = 0;

    // Wait for audio to be ready
    try {
      await this.waitCanPlay(incoming);
    } catch (err) {
      console.warn("AudioManager: Track failed to load:", next.file, err);
      // Try next track
      setTimeout(() => this.playNext(false), 100);
      return;
    }

    incoming.volume = 0;

    try {
      await incoming.play();
    } catch (err) {
      console.warn("AudioManager: Playback blocked", err);
      this.isPlaying = false;
      this.onPlayStateChange?.(false);
      return;
    }

    const crossfade = this.crossfadeSeconds;
    const hasOutgoingPlaying = !outgoing.paused && !outgoing.ended && outgoing.currentSrc;

    if (!hasOutgoingPlaying || !forceCrossfade) {
      this.currentIsA = !this.currentIsA;
      await this.fade(incoming, 0, this.muted ? 0 : this.volume, crossfade);
      return;
    }

    // Crossfade
    this.currentIsA = !this.currentIsA;

    await Promise.all([
      this.fade(incoming, 0, this.muted ? 0 : this.volume, crossfade),
      this.fade(outgoing, outgoing.volume, 0, crossfade)
    ]);

    outgoing.pause();
    outgoing.currentTime = 0;
    outgoing.src = "";
  }

  async waitCanPlay(audio) {
    if (audio.readyState >= 3) {
      return;
    }

    return new Promise((resolve, reject) => {
      const onCanPlay = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Audio failed to load"));
      };
      const cleanup = () => {
        audio.removeEventListener("canplay", onCanPlay);
        audio.removeEventListener("error", onError);
      };

      audio.addEventListener("canplay", onCanPlay);
      audio.addEventListener("error", onError);
      audio.load();

      // Timeout after 10 seconds
      setTimeout(() => {
        cleanup();
        reject(new Error("Audio load timeout"));
      }, 10000);
    });
  }

  async fade(audio, from, to, seconds) {
    const start = performance.now();
    const duration = Math.max(0.05, seconds) * 1000;
    const delta = to - from;

    return new Promise((resolve) => {
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const v = from + delta * t;
        audio.volume = this.muted ? 0 : Math.max(0, Math.min(1, v));

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      };

      audio.volume = this.muted ? 0 : from;
      requestAnimationFrame(step);
    });
  }

  onEnded(endedAudio) {
    if (!this.isPlaying) return;
    if (endedAudio !== this.getActiveAudio()) return;
    this.playNext(true);
  }

  /**
   * Cleanup
   */
  destroy() {
    this.pause();
    this.audioA.src = "";
    this.audioB.src = "";
  }
}

// Singleton instance
let audioManagerInstance = null;

export function getAudioManager() {
  if (!audioManagerInstance) {
    audioManagerInstance = new AudioManager({
      crossfadeSeconds: 2.0,
      defaultVolume: 0.22,
      avoidRepeatWindow: 3
    });
  }
  return audioManagerInstance;
}

export { AudioManager };
export default getAudioManager;
