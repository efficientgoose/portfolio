let ctx;

function audio() {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// A soft, short "tick" synthesized on the fly, so no audio file is needed.
// Higher pitch for switching to light, lower for dark.
export function playToggleSound(theme) {
  try {
    const ac = audio();
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const start = theme === "light" ? 1400 : 900;

    osc.type = "sine";
    osc.frequency.setValueAtTime(start, now);
    osc.frequency.exponentialRampToValueAtTime(start * 0.55, now + 0.08);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain).connect(ac.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // Audio is a nicety; ignore browsers that block or lack Web Audio.
  }
}

// A short burst of TV static, about as long as the visual glitch.
export function playGlitchSound() {
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
