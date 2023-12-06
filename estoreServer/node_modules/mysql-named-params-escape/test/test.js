var test = require('tape');
var npEscape = require('../');

test('inserts named parameters for values', function(t) {
  t.plan(1);

  var query = "SELECT title FROM foo WHERE foo.id = :value";
  var params = {value: 123};
  query = npEscape(query, params);

  t.equal(query, "SELECT title FROM foo WHERE foo.id = 123");
});

test('inserts named parameters for identifiers', function(t) {
  t.plan(1);

  var query = "SELECT ::select FROM ::table WHERE ::table.::column = 123";
  var params = {
    select: 'title',
    table: 'foo',
    column: 'id'
  };
  query = npEscape(query, params);

  t.equal(query, "SELECT `title` FROM `foo` WHERE `foo`.`id` = 123");
});

test('escapes sql injection for values', function(t) {
  t.plan(1);

  var query = "SELECT title FROM foo WHERE foo.id = :value";
  var params = {value: '123 or 1=1'};
  query = npEscape(query, params);

  t.equal(query, "SELECT title FROM foo WHERE foo.id = '123 or 1=1'");
});

test('escapes sql injection for identifiers', function(t) {
  t.plan(1);

  var query = "SELECT ::select FROM foo WHERE foo.id = 123";
  var params = {select: 'title, secret'};
  query = npEscape(query, params);

  t.equal(query, "SELECT `title, secret` FROM foo WHERE foo.id = 123");
});