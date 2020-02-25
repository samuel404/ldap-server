require("dotenv").config();

const config = {
  port: process.env.LDAP_PORT || "1389",
  credentials: process.env.CREDENTIALS || "secret",
};

module.exports = config;
