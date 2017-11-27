/**
 * Parse the author into a string.
 * @param {{name: string, email: string, url: string}|string} author  the author
 * @return {string} the author.
 */
exports.parseAuthor = (author) => {
  if (typeof author === 'string') return author;

  let a = author['name'];
  if (author['email']) {
    a += ' <' + author['email'] + '>';
  }
  if (author['url']) {
    a += ' (' + author['url'] + ')';
  }

  return a;
};