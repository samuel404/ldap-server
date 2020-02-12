const ldap = require("ldapjs");
const config = require("./config");
const { authorize } = require("./middleware/authMiddleWare");
const { urlEncoded } = require("./middleware/middleWare");

const server = ldap.createServer();

server.bind("cn=root", function(req, res, next) {
  if (req.dn.toString() !== "cn=root" || req.credentials !== "secret")
    return next(new ldap.InvalidCredentialsError());

  res.end();
  return next();
});

server.search("o=url", [authorize, urlEncoded]);

server.listen(config.port, function() {
  console.log("ldap server runing", server.url);
});
