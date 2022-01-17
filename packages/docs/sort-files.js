function sortFile(filename) {
  const packageName = filename.split('/packages/').pop().split('/').shift();
  return packageName;
}

module.exports = sortFile;
