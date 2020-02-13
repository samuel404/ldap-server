const ldap = require("ldapjs");
const urlencode = require("urlencode");
const PresenceFilter = require("ldapjs").PresenceFilter;

function urlEncoded(req, res, next) {
  const urlAttribute = new PresenceFilter({
    attribute: "url"
  });

  if (urlAttribute.matches({[req.filter.attribute]: req.filter.value || req.filter.initial})) 
    {
    const response = {
      dn: "o=example",
      attributes: {
        url: req.filter.value || req.filter.initial,
        urlencoded: urlencode(req.filter.value || req.filter.initial)
      }
    };
    res.send(response);
  } 
  else {
    return next(new ldap.NoSuchAttributeError(req.filter.attribute.toString()));
  }

  res.end();
  return next();
}

function findIfUserExist(req,res,next){
    const urlAttribute = new PresenceFilter({
        attribute: "userId",
        attribute:"userName"
    });
    const users = {adir:1111,
                    dor:2222,
                    liad:333};
    console.log(req.filter.matches(urlAttribute));
    
    if (urlAttribute.matches(req.filter)) {
        console.log("asd");
    }
    res.end();
    return next();
}


module.exports = { urlEncoded ,findIfUserExist};
