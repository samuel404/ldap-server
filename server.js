const ldap = require("ldapjs");
const config = require("./config");
const { authorize ,bind} = require("./middleware/authMiddleWare");
const { urlEncoded ,findIfUserExist} = require("./middleware/middleWare");

const server = ldap.createServer();

server.bind("cn=root",bind);

server.search("o=url", [authorize, urlEncoded]);
server.search("o=user", [authorize, findIfUserExist]);


server.listen(config.port, function() {
  console.log("ldap server runing", server.url);
});
