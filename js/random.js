/**
 * Cryptographically unbiased random helpers.
 *
 * Uses crypto.getRandomValues with rejection sampling so every value in
 * [0, n) is equally likely (no modulo bias).
 */
(function (global) {
  'use strict';

  var cryptoObj = global.crypto || global.msCrypto;

  /** Unbiased random integer in [0, n). */
  function randInt(n) {
    if (n <= 0) throw new Error('randInt: n must be > 0');
    if (n === 1) return 0;
    var buf = new Uint32Array(1);
    // Rejection sampling: discard values in the biased tail of the range.
    var limit = Math.floor(0x100000000 / n) * n;
    do {
      cryptoObj.getRandomValues(buf);
    } while (buf[0] >= limit);
    return buf[0] % n;
  }

  /** Fisher–Yates shuffle. Returns a new array; input is not mutated. */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = randInt(i + 1);
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /** Random element of a non-empty array. */
  function pick(arr) {
    return arr[randInt(arr.length)];
  }

  /** n distinct random elements of an array (n <= arr.length). */
  function sample(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  global.TMRandom = { randInt: randInt, shuffle: shuffle, pick: pick, sample: sample };
})(window);
