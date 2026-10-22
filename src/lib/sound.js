let ctx;

// Site-wide mute, remembered across visits. Every sound here checks it, and the song player
// subscribes so muting also stops a playing preview.
let muted = false;
try {
  muted = localStorage.getItem("muted") === "1";
} catch {
  // Storage can be blocked; start unmuted.
}
const listeners = new Set();

export const isMuted = () => muted;

export function setMuted(next) {
  muted = next;
  try {
    localStorage.setItem("muted", next ? "1" : "0");
  } catch {
    // The toggle still works for this visit.
  }
  listeners.forEach((fn) => fn());
}

export function subscribeMuted(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function audio() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// A short burst of TV static, about as long as the visual glitch.
export function playGlitchSound() {
  if (muted) return;
  try {
    const ac = audio();
    const now = ac.currentTime;
    const duration = 0.3;

    // White noise with a light crackle: random spikes and brief dropouts, like an untuned set.
    const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * duration), ac.sampleRate);
    const samples = buffer.getChannelData(0);
    let level = 1;
    for (let i = 0; i < samples.length; i++) {
      if (i % 220 === 0) level = Math.random() < 0.12 ? 0.25 : 0.8 + Math.random() * 0.2;
      const crackle = Math.random() < 0.002 ? 2.5 : 1;
      samples[i] = (Math.random() * 2 - 1) * level * crackle;
    }

    const source = ac.createBufferSource();
    source.buffer = buffer;

    // Thin out the rumble and the harshest top end so it hisses rather than roars.
    const highpass = ac.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 900;
    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 7000;

    const env = ac.createGain();
    env.gain.setValueAtTime(0.0001, now);
    env.gain.exponentialRampToValueAtTime(0.07, now + 0.02);
    env.gain.setValueAtTime(0.07, now + duration - 0.08);
    env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(highpass).connect(lowpass).connect(env).connect(ac.destination);
    source.start(now);
    source.stop(now + duration);
  } catch {
    // Audio is a nicety; ignore browsers that block or lack Web Audio.
  }
}

// A soft, short UI click: a tiny burst of band-passed noise with a quick decay.
export function playClickSound() {
  if (muted) return;
  try {
    const ac = audio();
    const now = ac.currentTime;
    const length = Math.floor(ac.sampleRate * 0.03);
    const buffer = ac.createBuffer(1, length, ac.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;

    const source = ac.createBufferSource();
    source.buffer = buffer;
    const band = ac.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 2400;
    band.Q.value = 1.2;
    const gain = ac.createGain();
    gain.gain.value = 0.25;

    source.connect(band).connect(gain).connect(ac.destination);
    source.start(now);
  } catch {
    // Audio is a nicety; ignore browsers that block or lack Web Audio.
  }
}

// A calm, low chime for a preview card opening: two soft sines a fifth apart, the upper one a
// touch late, each easing in and ringing out slowly so it settles rather than pings.
export function playPreviewSound() {
  if (muted) return;
  try {
    const ac = audio();
    if (ac.state !== "running") return; // hover alone can't unlock audio; stay silent until a click has
    const now = ac.currentTime;

    const lowpass = ac.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1600;
    lowpass.connect(ac.destination);

    const notes = [
      { freq: 392, delay: 0, peak: 0.035, ring: 1.1 }, // G4
      { freq: 587.33, delay: 0.045, peak: 0.018, ring: 0.9 }, // D5
    ];
    for (const { freq, delay, peak, ring } of notes) {
      const start = now + delay;
      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      const env = ac.createGain();
      env.gain.setValueAtTime(0.0001, start);
      env.gain.exponentialRampToValueAtTime(peak, start + 0.03);
      env.gain.exponentialRampToValueAtTime(0.0001, start + ring);

      osc.connect(env).connect(lowpass);
      osc.start(start);
      osc.stop(start + ring + 0.05);
    }
  } catch {
    // Audio is a nicety; ignore browsers that block or lack Web Audio.
  }
}
