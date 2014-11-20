'use strict';

var should = require('chai').should();

var quote = require('..');

describe('quote-tools', function () {
  describe('unquote', function () {
    var sentences = [[
      '"I don\'t know," she said, "maybe it\'s fate."',
      {pronoun: 'she', unquoted: 'I don\'t know, maybe it\'s fate.'}
    ], [
      '"blah bleh", they said, "bluh bloh".',
      {pronoun: 'they', unquoted: 'blah bleh bluh bloh'}
    ], [
      '"blah bleh", zie said, "bluh bloh".',
      {pronoun: 'zie', unquoted: 'blah bleh bluh bloh'}
    ], [
      '   "blah bleh", zie said, "bluh bloh".',
      {pronoun: 'zie', unquoted: 'blah bleh bluh bloh'}
    ], [
      '"blah bleh", zie said, "bluh bloh".   ',
      {pronoun: 'zie', unquoted: 'blah bleh bluh bloh'}
    ], [
      '"blah bleh", zie said, "bluh bloh"-- \t',
      {pronoun: 'zie', unquoted: 'blah bleh bluh bloh'}
    ], [
      'She said: "Love won today"',
      {pronoun: 'she', unquoted: 'Love won today'}
    ], [
      '"Love won today," she said, excitedly',
      {pronoun: 'she', unquoted: 'Love won today'}
    ], [
      '\t \t "Blah blah blah", she said.  ',
      {pronoun: 'she', unquoted: 'Blah blah blah'}
    ]];

    sentences.forEach(function (pair) {
      it("should unquote '" + pair[0] + "'", function () {
        quote.unquote(pair[0]).should.deep.equal(pair[1]);
      });
    });

    it('should not unquote a sentence without a quote', function () {
      var topic = 'However, she said that taking provocative photos ' +
        'aren\'t for everybody.';

      should.not.exist(quote.unquote(topic));
    });
  });

  describe('singleQuotes', function () {
    var sentences = [
      ['It doesn\'t matter, just do it"', 0],
      ['"It doesn\'t matter, just do it', 0],
      ['"It doesn\'t matter, just do it"', 0],
      ['"It doesn\'t matter, don\'t do it"', 0],
      ["It doesn't matter, just do it'", 1],
      ["It doesn't matter, don't do it'", 1],
      ["'It doesn't matter, just do it'", 2],
      ["'It doesn't matter, don't do it'", 2]
    ];

    sentences.forEach(function (sentence) {
      it('should find ' + sentence[1] + ' quotes in ' + sentence[0],
         function () {
        quote.singleQuotes(sentence[0]).should.equal(sentence[1]);
      });
    });
  });

  describe('doubleQuotes', function () {
    var sentences = [
      ["It doesn't matter, just do it'", 0],
      ["'It doesn't matter, don't do it", 0],
      ["'It doesn't matter, just do it'", 0],
      ["'It doesn't matter, don't do it'", 0],
      ['It doesn\'t matter, just do it"', 1],
      ['"It doesn\'t matter, don\'t do it', 1],
      ['"It doesn\'t matter, just do it"', 2],
      ['"It doesn\'t matter, don\'t do it"', 2]
    ];

    sentences.forEach(function (sentence) {
      it('should find ' + sentence[1] + ' quotes in ' + sentence[0],
         function () {
        quote.doubleQuotes(sentence[0]).should.equal(sentence[1]);
      });
    });
  });

  describe('evenQuotes', function () {
    var sentences = [
      ['It doesn\'t matter, just do it"', false],
      ['"It doesn\'t matter, don\'t do it', false],
      ["It doesn't matter, just do it'", false],
      ["'It doesn't matter, don't do it", false],
      ['It doesn\'t matter, just do it', true],
      ['"It doesn\'t matter, just do it"', true],
      ['"It doesn\'t matter, don\'t do it"', true],
      ["'It doesn't matter, just do it'", true],
      ["'It doesn't matter, don't do it'", true]
    ];

    sentences.forEach(function (sentence) {
      it('should return ' + sentence[1] + ' for ' + sentence[0], function () {
        quote.evenQuotes(sentence[0]).should.equal(sentence[1]);
      });
    });
  });
});
