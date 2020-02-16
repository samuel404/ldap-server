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

    const users = [{userName:"adir",userId:1111},
                    {userName:"dor",userId:2222},
                    {userName:"liad",userId:333}];
    
    users.forEach(user => {
      console.log(user);
      if(req.filter.matches(user)){
        console.log(user);
      }
    });
    res.end();
    return next();
}


module.exports = { urlEncoded ,findIfUserExist};
