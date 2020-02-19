const {PresenceFilter} = require("ldapjs");
const ldap = require("ldapjs");
const urlencode = require("urlencode");
const config = require("../config");

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
  const urlAttribute = new PresenceFilter({
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

const findIfUserExist = (req,res,next) => {
  
    const nameAttribute = new PresenceFilter({
      attribute: "userName"
    });
    const idAttribute = new PresenceFilter({
      attribute: "userId"
    });

    const attributes = getAttributes(req);

    let response = {};
    let exist = false;
    if(nameAttribute.matches(attributes) && idAttribute.matches(attributes)){
      config.users.forEach(user => {
        if(attributes.userid === user.userid && attributes.username === user.username){
            console.log(createResponse(attributes));
            response = {
            dn: "o=example",
            attributes: {
              userId: attributes.userid,
              userName: attributes.username
            }
          };
          exist = true;

        }
      });
    }
    else {
      return next(new ldap.NoSuchAttributeError(Object.keys(attributes).toString()));
    }
    if(!exist){
        response = {
        dn: "o=example",
        attributes: {
          userId: "not found",
          userName: "not found"
        }
      };
    }
    res.send(response);
    res.end();
    return next();
}


module.exports = { urlEncoded ,findIfUserExist};
