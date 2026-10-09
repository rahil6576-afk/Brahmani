// Mechanical & Electrical Web Audio synthesis for physical interactions

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    } catch {
      return null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Subtle tactile friction sound when pull begins
 */
export function playCordTensionSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // ignore
  }
}

/**
 * Crisp physical switch click when pull threshold is reached
 */
export function playSwitchClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Dual-tone mechanical snap (micro-switch spring latch)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(420, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.035);

    osc2.type = 'square';
    osc2.frequency.setValueAtTime(750, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.05);
  } catch {
    // ignore
  }
}

/**
 * Subtle electrical power hum / capacitor charge when theme toggles
 */
export function playPowerSurgeSound(isPoweringOn: boolean) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (isPoweringOn) {
      osc.frequency.setValueAtTime(95, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.12);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
    }

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.14);
  } catch {
    // ignore
  }
}
