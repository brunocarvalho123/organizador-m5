module.exports = function (arr) {
  return Math.max(...arr.map(row => row.id))+1;
};