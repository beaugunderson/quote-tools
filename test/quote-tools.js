'use strict';

require('chai').should();

var sentence = require('..');

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
      '"Blah blah blah", she said.',
      {pronoun: 'she', unquoted: 'Blah blah blah'}
    ]];

    sentences.forEach(function (pair) {
      it("should unquote '" + pair[0] + "'", function () {
        sentence.unquote(pair[0]).should.deep.equal(pair[1]);
      });
    });
  });
});
