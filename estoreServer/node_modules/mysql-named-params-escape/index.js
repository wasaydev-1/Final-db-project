var SqlString = require('mysql/lib/protocol/SqlString.js');

module.exports = npEscape;

function npEscape(query, params) {
  if (!params) { return query; }
  [
    {regex: /\:\:(\w+)/g, esc: SqlString.escapeId},
    {regex: /\:(\w+)/g, esc: SqlString.escape}
  ].forEach(function(opt) {
      query = query.replace(opt.regex, function(txt, key) {
        if (params.hasOwnProperty(key)) {
          return opt.esc(params[key]);
        }
        return txt;
      });
    });
  return query;
}