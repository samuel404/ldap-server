const ldap = require("ldapjs");

function authorize(req, res, next) {
    if (!req.connection.ldap.bindDN.equals('cn=root'))
      return next(new ldap.InsufficientAccessRightsError());
  
    return next();
}

module.exports = { authorize };