const ldap = require("ldapjs");
const config = require("../config");

const authorize = (req, res, next) => {
  if (!req.connection.ldap.bindDN.equals("cn=root"))
    return next(new ldap.InsufficientAccessRightsError());

  return next();
}

const bind = (req, res, next) => {
    if (req.dn.toString() !== "cn=root" || req.credentials !== config.credentials)
      return next(new ldap.InvalidCredentialsError());
  
    res.end();
    return next();
  }

module.exports = { authorize ,bind};
