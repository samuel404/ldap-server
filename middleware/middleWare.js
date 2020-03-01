
const ldap = require("ldapjs");
const urlencode = require("urlencode");

const {doesUserExist} = require("../users/users");

const getArrayAttributes = (req) => {
  const attributes = {};
  req.filter.filters.forEach(filter => {
    attributes[filter.attribute] = filter.value || filter.initial
  });
  return attributes;
}

const getSingelAttribute = (req) => {
  const attributes = {};

  attributes[req.filter.attribute] = req.filter.value || req.filter.initial;

  return attributes;
}

const getAttributes = (req) => {
  if(req.filter.filters){
    return getArrayAttributes(req);
  }

  return getSingelAttribute(req);
}

const createResponse = (attributes,dn) => {
  const response = {
    dn: dn || "o=example",
    attributes: {
    }
  };

  for (let key in attributes) {
    response.attributes[key] = attributes[key];
  }

  return response;
}

const urlEncoded = (req, res, next) => {
  const urlAttribute = new ldap.PresenceFilter({
    attribute: "url"
  });

  const attributes = getAttributes(req);

  if (urlAttribute.matches(attributes)) {
    attributes.urlencoded = urlencode(attributes.url);
    res.send(createResponse(attributes));
    res.end();
  } 

  return next(new ldap.NoSuchAttributeError(Object.keys(attributes).toString()));

}



const getUserNewId = (req,res,next) => {
  
  const idAttribute = new ldap.PresenceFilter({
    attribute: "userId"
  });

  const attributes = getAttributes(req);

  if(idAttribute.matches(attributes)) {
    const newId = doesUserExist(attributes);
    
    if(newId) {
      
      res.send(createResponse(newId));
      res.end();
      return next();
    }

    return next(new ldap.CompareFalseError(Object.values(attributes).toString()));
  }
  return next(new ldap.NoSuchAttributeError(Object.keys(attributes).toString()));
  
}




module.exports = { urlEncoded ,getUserNewId};
