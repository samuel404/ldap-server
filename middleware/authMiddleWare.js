const ldap = require("ldapjs");

function authorize(req, res, next) {
  if (!req.connection.ldap.bindDN.equals("cn=root"))
    return next(new ldap.InsufficientAccessRightsError());

  return next();
}

function bind(req, res, next) {
    if (req.dn.toString() !== "cn=root" || req.credentials !== "secret")
      return next(new ldap.InvalidCredentialsError());
  
    res.end();
    return next();
  }

module.exports = { authorize ,bind};
