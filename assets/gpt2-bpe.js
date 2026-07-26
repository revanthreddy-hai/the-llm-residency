/* GPT-2 byte-level BPE tokenizer. Plain script, no modules.
   Browser: exposes window.gpt2Ready (Promise), window.gpt2Tokenize(text),
   window.gpt2VocabSize after the vocabulary JSON loads.
   Node: module.exports.createTokenizer(data) for testing. */
(function () {
  'use strict';

  /* GPT-2 bytes_to_unicode: printable bytes map to themselves,
     the rest are remapped to 256 and up so every byte is a visible char. */
  function bytesToUnicode() {
    var bs = [];
    var i;
    for (i = 33; i <= 126; i++) bs.push(i);     /* '!' .. '~' */
    for (i = 161; i <= 172; i++) bs.push(i);    /* '¡' .. '¬' */
    for (i = 174; i <= 255; i++) bs.push(i);    /* '®' .. 'ÿ' */
    var cs = bs.slice();
    var n = 0;
    for (i = 0; i < 256; i++) {
      if (bs.indexOf(i) === -1) {
        bs.push(i);
        cs.push(256 + n);
        n += 1;
      }
    }
    var enc = {};
    for (i = 0; i < bs.length; i++) enc[bs[i]] = String.fromCharCode(cs[i]);
    return enc;
  }

  var BYTE_ENCODER = bytesToUnicode();
  var BYTE_DECODER = new Map();
  Object.keys(BYTE_ENCODER).forEach(function (b) {
    BYTE_DECODER.set(BYTE_ENCODER[b], Number(b));
  });

  /* GPT-2 pre-tokenization pattern. */
  var PAT = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;

  var TEXT_ENCODER = new TextEncoder();
  var TEXT_DECODER = new TextDecoder('utf-8');

  function createTokenizer(data) {
    var vocab = new Map(Object.entries(data.vocab));
    var ranks = new Map();
    for (var i = 0; i < data.merges.length; i++) ranks.set(data.merges[i], i);
    var cache = new Map();

    function bpe(token) {
      var hit = cache.get(token);
      if (hit) return hit;
      var word = token.split('');
      while (word.length > 1) {
        var minRank = Infinity;
        var minIdx = -1;
        for (var j = 0; j < word.length - 1; j++) {
          var r = ranks.get(word[j] + ' ' + word[j + 1]);
          if (r !== undefined && r < minRank) {
            minRank = r;
            minIdx = j;
          }
        }
        if (minIdx === -1) break;
        var first = word[minIdx];
        var second = word[minIdx + 1];
        var merged = [];
        var k = 0;
        while (k < word.length) {
          if (k < word.length - 1 && word[k] === first && word[k + 1] === second) {
            merged.push(first + second);
            k += 2;
          } else {
            merged.push(word[k]);
            k += 1;
          }
        }
        word = merged;
      }
      cache.set(token, word);
      return word;
    }

    /* Byte-encoded token piece back to readable text (spaces preserved).
       Pieces that split a multibyte character render with U+FFFD. */
    function display(piece) {
      var bytes = new Uint8Array(piece.length);
      for (var j = 0; j < piece.length; j++) bytes[j] = BYTE_DECODER.get(piece[j]);
      return TEXT_DECODER.decode(bytes);
    }

    function tokenize(text) {
      var out = [];
      if (!text) return out;
      var pieces = text.match(PAT);
      if (!pieces) return out;
      for (var p = 0; p < pieces.length; p++) {
        var bytes = TEXT_ENCODER.encode(pieces[p]);
        var chars = '';
        for (var b = 0; b < bytes.length; b++) chars += BYTE_ENCODER[bytes[b]];
        var parts = bpe(chars);
        for (var t = 0; t < parts.length; t++) {
          out.push({ id: vocab.get(parts[t]), token: display(parts[t]) });
        }
      }
      return out;
    }

    return { tokenize: tokenize, vocabSize: vocab.size };
  }

  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    window.gpt2Ready = window
      .fetch('assets/gpt2-bpe.json')
      .then(function (res) {
        if (!res.ok) throw new Error('vocab fetch failed: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        var tok = createTokenizer(data);
        window.gpt2Tokenize = tok.tokenize;
        window.gpt2VocabSize = tok.vocabSize;
        return tok;
      });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createTokenizer: createTokenizer, bytesToUnicode: bytesToUnicode };
  }
})();
