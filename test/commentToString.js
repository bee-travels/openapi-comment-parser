function commentToString(func) {
  let str = func;
  if (typeof func === 'function') {
    str = func.toString();
    str = str
      .slice(str.indexOf('{') + 1, str.lastIndexOf('}'))
      .replace(/\r\n/g, '\n');
  }
  return str;
}

module.exports = commentToString;
