module.exports = function (arr) {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map(row => row.id))+1;
};