const Filter = require('bad-words');
const filter = new Filter();
const customWords = ['stupid', 'idiot', 'dumb', 'crazy','hate','bad','horrible','terrible']; // Add more as needed
filter.addWords(...customWords)
const isBad = (text) => filter.isProfane(text);

module.exports = isBad;
