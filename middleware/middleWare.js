const ldap = require("ldapjs");
const urlencode = require('urlencode');
const PresenceFilter = require("ldapjs").PresenceFilter;

function urlEncoded(req, res, next) {
  const urlAttribute = new PresenceFilter({
    attribute: "url"
  });
  
  
  if (urlAttribute.matches({[req.filter.attribute]:req.filter.value || req.filter.initial})) {
    const response = {
        dn: 'o=example',
        attributes: {
          url: req.filter.value || req.filter.initial,
          urlencoded:urlencode(req.filter.value || req.filter.initial)
        }
      };
    res.send(response);
  } 


  res.end();
  return next();
}

module.exports = { urlEncoded };
