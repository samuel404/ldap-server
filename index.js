const ldap = require("ldapjs");
const dotenv = require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const server = ldap.createServer();
const port = process.env.LDAP_PORT || "1389";

function loadPasswdFile(req, res, next) {
  fs.readFile('./pass.txt', 'utf8', function(err, data) {
    if (err)
      return next(new ldap.OperationsError(err.message));

    req.users = {};

    var lines = data.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (!lines[i] || /^#/.test(lines[i]))
        continue;

      var record = lines[i].split(':');
      if (!record || !record.length)
        continue;

      req.users[record[0]] = {
        dn: 'cn=' + record[0] + ', ou=users, o=myhost',
        attributes: {
          cn: record[0],
          id: record[1],
          system: record[2],
          newId: record[3],
          objectclass: 'newUser'
        }
      };
    }
    return next();
  });
}


let pre = loadPasswdFile;

server.search("o=" + process.env.ORG, pre,function(req, res, next) {

  Object.keys(req.users).forEach(function(k) {
    if (req.filter.matches(req.users[k].attributes))
      res.send(req.users[k]);
  });
  res.end();
  return next();
});

server.listen(port, function() {
  console.log("ldap server runing", server.url);
});
