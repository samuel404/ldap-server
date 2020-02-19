require("dotenv").config();

const config = {
  port: process.env.LDAP_PORT || "1389",
  credentials: process.env.CREDENTIALS || "secret",
  users : [{username:"adir",userid:'1111'},
          {username:"dor",userid:'2222'},
          {username:"liad",userid:'3333'}],
};

module.exports = config;
