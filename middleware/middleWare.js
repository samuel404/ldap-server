const {PresenceFilter} = require("ldapjs");
const ldap = require("ldapjs");
const urlencode = require("urlencode");

const getArrayAttributes = (attributes,req) => {
  req.filter.filters.forEach(filter => {
    attributes[filter.attribute] = filter.value || filter.initial
  });
  return attributes;
}

const getSingelAttribute = (attributes,req) => {
  attributes[req.filter.attribute] = req.filter.value || req.filter.initial;
  return attributes;
}

const getAttributes = (req) => {
  let attributes = {};

  if(req.filter.filters){
    return getArrayAttributes(attributes,req);
  }
  return getSingelAttribute(attribute,req);
}

const urlEncoded = (req, res, next) => {
  const urlAttribute = new PresenceFilter({
    attribute: "url"
  });
  const attributes = getAttributes(req);
  if (urlAttribute.matches(attributes)) 
    {
      
    const response = {
      dn: "o=example",
      attributes: {
        url: attributes.url,
        urlencoded: urlencode(attributes.url)
      }
    };
    res.send(response);
  } 
  else {
    return next(new ldap.NoSuchAttributeError(Object.keys(attributes).toString()));
  }

  res.end();
  return next();
}

const findIfUserExist = (req,res,next) => {
  
    const nameAttribute = new PresenceFilter({
      attribute: "userName"
    });
    const idAttribute = new PresenceFilter({
      attribute: "userId"
    });

    const attributes = getAttributes(req);
    const users = [{username:"adir",userid:'1111'},
                    {username:"dor",userid:'2222'},
                    {username:"liad",userid:'3333'}];
    let response = {};
    let exist = false;
    if(nameAttribute.matches(attributes) && idAttribute.matches(attributes)){
      users.forEach(user => {
        if(attributes.userid === user.userid && attributes.username === user.username){
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
