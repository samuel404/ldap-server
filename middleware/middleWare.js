const ldap = require("ldapjs");
const urlencode = require("urlencode");
const PresenceFilter = require("ldapjs").PresenceFilter;



function getAttribute(req){
  const attrib = {};
  if(req.filter.filters){
    req.filter.filters.forEach(filter => {
      attrib[filter.attribute] = filter.value || filter.initial
    });
  }
  else{
    attrib[req.filter.attribute] = req.filter.value || req.filter.initial;
  }
  return attrib;
}

function urlEncoded(req, res, next) {
  const urlAttribute = new PresenceFilter({
    attribute: "url"
  });
  const attrib = getAttribute(req);
  if (urlAttribute.matches(attrib)) 
    {
      console.log("asd");
    const response = {
      dn: "o=example",
      attributes: {
        url: attrib.url,
        urlencoded: urlencode(attrib.url)
      }
    };
    res.send(response);
  } 
  else {
    return next(new ldap.NoSuchAttributeError(Object.keys(attrib).toString()));
  }

  res.end();
  return next();
}

function findIfUserExist(req,res,next){
  
    const nameAttribute = new PresenceFilter({
      attribute: "userName"
    });
    const idAttribute = new PresenceFilter({
      attribute: "userId"
    });

    const attrib = getAttribute(req);
    const users = [{username:"adir",userid:'1111'},
                    {username:"dor",userid:'2222'},
                    {username:"liad",userid:'3333'}];

    if(nameAttribute.matches(attrib) && idAttribute.matches(attrib)){
      users.forEach(user => {
        if(attrib.userid === user.userid && attrib.username === user.username){
          const response = {
            dn: "o=example",
            attributes: {
              userId: attrib.userid,
              userName: attrib.username
            }
          };
          res.send(response);
          res.end();
          return next();

        }
      });
    }
    else {
      return next(new ldap.NoSuchAttributeError(Object.keys(attrib).toString()));
    }
    const response = {
      dn: "o=example",
      attributes: {
        userId: "not found",
        userName: "not found"
      }
    };
    res.send(response);
    res.end();
    return next();
}


module.exports = { urlEncoded ,findIfUserExist};
