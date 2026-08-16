/**
 * Tiny WebAudio sound effects. Muted by default; enabled via the
 * "Sound effects" option. No audio files needed — everything is synthesized.
 */
(function (global) {
  'use strict';

  var enabled = false;
  var ctx = null;

  function ensureCtx() {
    if (!ctx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /** Short blip used while cards shuffle. */
  function tick() {
    if (!enabled) return;
    var c = ensureCtx();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 620 + Math.random() * 240;
    gain.gain.setValueAtTime(0.06, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.09);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.1);
  }

  /** Rising chord for the final reveal. */
  function reveal() {
    if (!enabled) return;
    var c = ensureCtx();
    if (!c) return;
    [392, 494, 587].forEach(function (freq, i) {
      var osc = c.createOscillator();
      var gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      var t = c.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
      osc.connect(gain).connect(c.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  }

  global.TMSound = {
    tick: tick,
    reveal: reveal,
    // The audio context is created lazily by the first tick/reveal rather
    // than here: sound is on by default, and building a context before any
    // user gesture would just be created suspended (and warned about).
    setEnabled: function (on) { enabled = !!on; }
  };
})(window);
