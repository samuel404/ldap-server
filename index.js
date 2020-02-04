const ldap = require('ldapjs');
const dotenv = require('dotenv').config()
const fs = require('fs');
const axios = require('axios');

const server = ldap.createServer();
const port = process.env.LDAP_PORT || '1389';
/*
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

server.bind('cn='+process.env.BIND_TREE, function(req, res, next) {
    if (req.dn.toString() !== 'cn='+process.env.BIND_TREE || req.credentials !== process.env.SECRET)
      return next(new ldap.InvalidCredentialsError());
  
    res.end();
    return next();
});

function authorize(req, res, next) {
  
  if (!req.connection.ldap.bindDN.equals('cn='+process.env.BIND_TREE))
    return next(new ldap.InsufficientAccessRightsError());
  return next();
}
*/

//[ 'type', 'filters', 'json' ]

//let pre = loadPasswdFile;
//(&(MAIL=123)(TITLE=212341))
server.search('o='+process.env.ORG1, function(req, res, next) {
  console.log(req.filter.filters[0].value);
  console.log(req.filter.filters[1].value);
  axios.get(process.env.API_URL+'/user', {
    id: req.filter.value
  })
  .then((response) => {
    console.log("response");
    res.send(response);
  }, (error) => {
    console.log("error");
    res.send(error);
  });
  res.end();
  return next();
});





server.listen(port, function() {
  console.log('ldap server runing', server.url);
});