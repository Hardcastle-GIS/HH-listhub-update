const { Client } = require("pg");

const client = new Client({
  user: "harmon_user",
  host: "harmonhomes.com",
  database: "harmon_homes",
  password: "harmon@9960",
  port: 5432,
});

module.exports = client;
