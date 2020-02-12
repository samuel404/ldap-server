require("dotenv").config();

const config = {
  port: process.env.LDAP_PORT || "1389",
  route: process.env.ROUTE || "host"
};

module.exports = config;
