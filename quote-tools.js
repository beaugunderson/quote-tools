'use strict';

var sentenceTools = require('sentence-tools');

// TODO: Handle these automatically?
var ACTIONS = exports.ACTIONS = [
  'answered',
  'asked',
  'claimed',
  'insisted',
  'replied',
  'said',
  'shouted',
  'squealed',
  'whispered',
  'yelled'
];

// TODO: Handle names too?
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

var ACTIONS_RE = '(' + ACTIONS.join('|') + ')';
var PRONOUNS_RE = '(' + PRONOUNS.join('|') + ')';

var PRONOUN_BEGIN_RE = new RegExp(PRONOUNS_RE + ' +' + ACTIONS_RE +
                                  '[;:, ]*(?=[\'"])', 'i');

var PRONOUN_END_RE = new RegExp('([\'"])[, ]*' + PRONOUNS_RE + ' +' +
                                ACTIONS_RE + '.*', 'i');

var COMPOUND_QUOTE_RE = new RegExp(PRONOUNS_RE + ' +' + ACTIONS_RE +
                                   ',? *[\'"]', 'i');

var COLLAPSE_COMPOUND_QUOTE_RE = new RegExp('[\'"],* *' + PRONOUNS_RE +
                                            ' +' + ACTIONS_RE + ',? *[\'"]',
                                            'i');

var singleQuotes = exports.singleQuotes = function (sentence) {
  var matches = sentence.match(/^\s*'|'\s*$/g);

  return matches ? matches.length : 0;
};

var doubleQuotes = exports.doubleQuotes = function (sentence) {
  // TODO: Is there any reason to treat this like singleQuotes?
  var matches = sentence.match(/"/g);

  return matches ? matches.length : 0;
};

var evenSingleQuotes = exports.evenSingleQuotes = function (sentence) {
  return singleQuotes(sentence) % 2 === 0;
};

var evenDoubleQuotes = exports.evenDoubleQuotes = function (sentence) {
  return doubleQuotes(sentence) % 2 === 0;
};

var evenQuotes = exports.evenQuotes = function (sentence) {
  return evenSingleQuotes(sentence) && evenDoubleQuotes(sentence);
};

var findPronoun = exports.findPronoun = function (sentence) {
  var middle = sentence.match(COMPOUND_QUOTE_RE);

  if (middle) {
    return middle[1].toLowerCase();
  }

  var begin = sentence.match(PRONOUN_BEGIN_RE);

  if (begin) {
    return begin[1].toLowerCase();
  }

  var end = sentence.match(PRONOUN_END_RE);

  if (end) {
    return end[2].toLowerCase();
  }
};

var stripPronoun = exports.stripPronoun = function (sentence) {
  if (sentence.match(PRONOUN_BEGIN_RE)) {
    return sentence.replace(PRONOUN_BEGIN_RE, '');
  } else if (sentence.match(PRONOUN_END_RE)) {
    return sentence.replace(PRONOUN_END_RE, '$1');
  }

  return sentence;
};

var unquote = exports.unquote = function (sentence) {
  var pronoun = findPronoun(sentence);

  if (!pronoun) {
    return null;
  }

  var modified;

  // Compound quote
  if (COMPOUND_QUOTE_RE.test(sentence)) {
    modified = sentence.replace(COLLAPSE_COMPOUND_QUOTE_RE, ' ');
  } else {
    modified = stripPronoun(sentence);
  }

  // Remove dangling punctation if it's the only thing before or after a quote
  modified = modified.replace(/(['"])[,.-\s]+$/, '$1');
  modified = modified.replace(/^[,.-\s]+(['"])/, '$1');

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
    // Remove any trailing commas, quotes, and spaces
    modified = modified.replace(/^ *'* *| *'*,*'* *$/, '');
  }

  // Remove any leading or trailing commas and spaces
  modified = modified
    .replace(/^[, ]+/, '')
    .replace(/[, ]+$/, '');

  return {
    pronoun: pronoun,
    unquoted: modified
  };
};

exports.fullPipeline = function (sentences) {
  return sentences
    .map(sentenceTools.normalizeWhitespace)
    .map(unquote)
    .map(sentenceTools.compress)
    .map(sentenceTools.capitalize)
    .filter(evenQuotes);
};
