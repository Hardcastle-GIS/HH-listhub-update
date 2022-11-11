const fs = require("fs");
const stream = require("stream");
const request = require("request");
require("dotenv").config({path: '/home/harmon/listhub/update/.env'});
const readline = require("readline");
const client = require("./database");

client.connect().then(() => {
  console.log("db connected");
});

const getInputStream = (token) => {
  // Get inputStream from replication request
  return request({
    url: `https://api.listhub.com/replication/query?select=ListingKey`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const main = () => {
  request.post(
    {
      url: `https://api.listhub.com/oauth2/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no cache",
      },
      form: {
        grant_type: "client_crediantials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      },
    },
    (err, res, body) => {
      var token = JSON.parse(body).access_token;
      const inputStream = getInputStream(token);
      const writeStream = fs.createWriteStream("./output.txt");

      inputStream
        .on("response", (res) => {
          console.log(res.headers);
          // console.log(res);
        })
        .on("error", (err) => {
          console.log(err);
        })
        .on("end", () => {
          console.log("download done");
          deleteListings().then(() => {
            console.log("done");
          });
        })
        .pipe(writeStream);
    }
  );
};

const deleteListings = async function () {
  var data = [];

  var lineReader = require("readline").createInterface({
    input: require("fs").createReadStream("./output.txt"),
  });

  lineReader.on("line", function (line) {
    data.push(JSON.parse(line).ListingKey);
  });

  console.log("db function starting");

  lineReader.on("close", () => {
    console.log(data.length);
    callExpired();
    console.log("Array Read end");
  });

  async function callExpired() {
    await expiredSelector(data);
  }
};

const expiredSelector = async function (data) {
  try {
    const select = await client.query(
      "SELECT listingkey FROM listings ORDER BY listingkey"
    );
    for (element in select.rows) {
      if (data.includes(select.rows[element].listingkey)) {
        // console.log("Listing active");
      } else {
        
        try {
          var res = await client.query(
            `DELETE FROM listings WHERE listingkey='${select.rows[element].listingkey}'`
          );
          console.log(select.rows[element].listingkey);
        } catch (error) {
          console.log(error.stack);
        }
      }
    }
    process.exit(0);
  } catch (error) {
    console.log(error.stack);
  }
};

main();
