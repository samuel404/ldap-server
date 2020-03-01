const ldap = require("ldapjs");
const config = require("./config");
const { authorize ,bind} = require("./middleware/authMiddleWare");
const { urlEncoded ,getUserNewId} = require("./middleware/middleWare");

const server = ldap.createServer();

server.bind("cn=root",bind);

server.search("o=url", [authorize, urlEncoded]);
server.search("o=user", [authorize, getUserNewId]);


server.listen(config.port, () => {
  console.log("ldap server runing", server.url);
});
