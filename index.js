const ldap = require('ldapjs');
const fs = require('fs');
const axios = require('axios');

const server = ldap.createServer();

function loadPasswdFile(req, res, next) {

    fs.readFile('./pass.txt', 'utf8', function(err, data) {
      if (err)
        return next(new ldap.OperationsError(err.message));
  
      req.users = {};
  
      let lines = data.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (!lines[i] || /^#/.test(lines[i]))
          continue;
  
        let record = lines[i].split(':');
        if (!record || !record.length)
          continue;
        req.users[record[0]] = {
          dn: 'cn=' + record[0] + ', ou=users, o=myhost',
          attributes: {
            cn: record[0],
            uid: record[2],
            gid: record[3],
            description: record[4],
            homedirectory: record[5],
            shell: record[6] || '',
            objectclass: 'unixUser'
          }
        };
      }
      
      return next();
    });
}

server.bind('cn=root', function(req, res, next) {
    if (req.dn.toString() !== 'cn=root' || req.credentials !== 'secret')
      return next(new ldap.InvalidCredentialsError());
  
    res.end();
    return next();
});

function authorize(req, res, next) {
  if (!req.connection.ldap.bindDN.equals('cn=root'))
    return next(new ldap.InsufficientAccessRightsError());
  return next();
}




let pre = [authorize, loadPasswdFile];

server.search('o=myhost', pre, function(req, res, next) {
  console.log(req.filter);
  Object.keys(req.users).forEach(function(k) { 
    if (req.filter.matches(req.users[k].attributes))
      res.send(req.users[k]);
  });

  res.end();
  return next();
});

server.listen(1389, function() {
  console.log('/etc/passwd LDAP server up at: %s', server.url);
});