'use strict';

var sentenceTools = require('sentence-tools');

var PRONOUNS = exports.PRONOUNS = [
  'co',
  'e',
  'ey',
  'he',
  'it',
  'ne',
  'per',
  'she',
  'sie',
  'they',
  've',
  'xie',
  'xe',
  'ze',
  'zie'
];

var PRONOUNS_RE = '(' + PRONOUNS.join('|') + ')';
var PRONOUN_RE = new RegExp('[\'"],* *' + PRONOUNS_RE + ' +said', 'i');

var COMPOUND_QUOTE_RE = new RegExp(PRONOUNS_RE + ' +said,? *[\'"]', 'i');

var COLLAPSE_COMPOUND_QUOTE_RE = new RegExp('[\'"],* *' + PRONOUNS_RE +
                                            ' +said,? *[\'"]', 'i');

var STRIP_END_RE = new RegExp(',* *' + PRONOUNS_RE + ' +said[.,]?', 'i');

var singleQuotes = exports.singleQuotes = function (sentence) {
  var matches = sentence.match(/(^|[^\w])[']+|[']+([^\w]|$)/);

  if (matches) {
    return matches.length;
  }

  return 0;
};

var doubleQuotes = exports.doubleQuotes = function (sentence) {
  var matches = sentence.match(/(^|[^\w])["]+|["]+([^\w]|$)/);

  if (matches) {
    return matches.length;
  }

  return 0;
};

var evenQuotes = exports.evenQuotes = function (sentence) {
  return singleQuotes(sentence) % 2 === 0 &&
         doubleQuotes(sentence) % 2 === 0;
};

var unquote = exports.unquote = function (sentence) {
  var modified;

  var pronoun = sentence.match(PRONOUN_RE);

  // Compound quote
  if (COMPOUND_QUOTE_RE.test(sentence)) {
    modified = sentence.replace(COLLAPSE_COMPOUND_QUOTE_RE, ' ');
  } else {
    modified = sentence.replace(STRIP_END_RE, '');
  }

  // Remove dangling punctation if it's the only thing past a quote
  modified = modified.replace(/(['"])[,. -]+$/, '$1');

  // If the entire sentence is wrapped in '
  if (modified.match(/^'.*'$/)) {
    modified = modified.replace(/^'|'$/g, '');
  }

  // If the entire sentence is wrapped in "
  if (modified.match(/^".*"$/)) {
    modified = modified.replace(/^"|"$/g, '');
  }

  if (doubleQuotes(modified) === 1) {
    // Remove any trailing commas, quotes, and spaces
    modified = modified.replace(/^ *"* *| *"*,*"* *$/, '');
  }

  if (singleQuotes(modified) === 1) {
    modified = modified.replace(/^ *'* *| *'*,*'* *$/, '');
  }

  // Remove any leading or trailing commas and spaces
  modified = modified
    .replace(/^[, ]+/, '')
    .replace(/[, ]+$/, '');

  return {
    pronoun: pronoun[1],
    unquoted: modified
  };
};

exports.fullPipeline = function (sentences) {
  return sentences
    .map(sentenceTools.collapseSpaces)
    .map(unquote)
    .map(sentenceTools.compress)
    .map(sentenceTools.capitalize)
    .filter(evenQuotes);
};
