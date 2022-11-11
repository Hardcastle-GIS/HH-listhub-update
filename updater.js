const https = require("https");
const client = require("./database");
const got = require("got");
require("dotenv").config({ path: '/home/harmon/listhub/update/.env' });
var AWS = require("aws-sdk");
var credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
// Load the AWS SDK for Node.js
// Set the region
AWS.config.update({ region: "us-east-1" });
var token;
client.connect().then(() => {
  console.log("db connected");
});
function getListings(urlParam) {
  var date = new Date();
  date.setHours(date.getHours() - 1);
  let url;
  if (urlParam) {
    url = urlParam;
  } else {
    url = `https://api.listhub.com/odata/Property?$filter=ModificationTimestamp gt '${date.toISOString()}'&$count=true`;
  }
  (async () => {
    try {
      const response = await got(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      var data = JSON.parse(response.body);
      if (data["@odata.count"] && data["@odata.count"] > 0) {
        console.log(data["@odata.count"] || "over");
        console.log(data.value.length || "over");
        writeData(data);
      } else {
        process.exit(0);
      }
      //=> '<!doctype html> ...'
    } catch (error) {
      try {
        console.log("Getting auth token");
        const authres = await got(`https://api.listhub.com/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no cache",
          },
          form: {
            grant_type: "client_credentials",
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
          },
        });
        console.log("setting apikey");
        token = JSON.parse(authres.body).access_token;
        console.log("apikey set");
        const response = await got(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        var data = JSON.parse(response.body);
        if (data["@odata.count"] && data["@odata.count"] > 0) {
          console.log(data["@odata.count"] || "over");
          console.log(data.value.length || "over");
          writeData(data);
        } else {
          process.exit(0);
        }
      } catch (err) {
        console.log(err);
      }
      //=> 'Internal server error ...'
    }
  })();
}
function writeData(response) {
  setTimeout(() => {
    getListings(response["@odata.nextLink"]);
  }, 10000);
  if (response.value && response.value.length > 0) {
    response.value.forEach((data) => {
      if (data.Longitude && data.Latitude) {
        if (data.Media) {
          var mediaUnparsed = JSON.stringify(data.Media);
          var media = mediaUnparsed.replace(/'/g, " ");
        } else {
          var media = null;
        }
        if (!data.ListAgentFullName) {
          var agentFullName = null;
        } else {
          var agentFullName = data.ListAgentFullName.replace(/'/g, " ");
        }
        if (!data.ListAgentFirstName) {
          var agentFirstName = null;
        } else {
          var agentFirstName = data.ListAgentFirstName.replace(/'/g, " ");
        }
        if (!data.ListAgentLastName) {
          var agentLastName = null;
        } else {
          var agentLastName = data.ListAgentLastName.replace(/'/g, " ");
        }
        if (!data.BrokerName) {
          var brokerName = null;
        } else {
          var brokerName = data.BrokerName.replace(/'/g, " ");
        }
        if (!data.UnparsedAddress) {
          var unparsedAddress = null;
        } else {
          var unparsedAddress = data.UnparsedAddress.replace(/'/g, " ");
        }
        if (data.ModificationTimestamp) {
          var timestamp = data.ModificationTimestamp;
        } else {
          var timestamp = "2000-01-01";
        }
        if (data.CustomFields) {
          if (!data.CustomFields.ListingTitle) {
            var listingtitle = null;
          } else {
            var listingtitle = data.CustomFields.ListingTitle.replace(
              /'/g,
              " "
            );
          }
        } else {
          var timestamp = "2000-01-01";
          var listingtitle = null;
        }
        if (!data.PostalCode) {
          var postalCode = null;
        } else {
          var postalCode = data.PostalCode.replace(/'/g, " ");
        }
        if (!data.PropertyType) {
          var propertytype = null;
        } else {
          var propertytype = data.PropertyType.replace(/'/g, " ");
        }
        if (!data.InteriorFeatures) {
          var interiorFeatures = null;
        } else {
          var interior = JSON.stringify(data.InteriorFeatures);
          var interiorFeatures = interior.replace(/'/g, " ");
        }
        if (!data.ExteriorFeatures) {
          var exteriorFeatures = null;
        } else {
          var exterior = JSON.stringify(data.ExteriorFeatures);
          var exteriorFeatures = exterior.replace(/'/g, " ");
        }
        if (!data.PublicRemarks) {
          var publicRemarks = null;
        } else {
          var publicRemarks = data.PublicRemarks.replace(/'/g, " ");
        }
        if (!data.StateOrProvince) {
          var state = null;
        } else {
          var state = data.StateOrProvince.replace(/'/g, " ");
        }
        if (!data.PostalCity) {
          var city = null;
        } else {
          var city = data.PostalCity.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageName) {
          var listbrokeragename = null;
        } else {
          var listbrokeragename = data.CustomFields.ListBrokerageName.replace(
            /'/g,
            " "
          );
        }
        if (!data.CustomFields.ListBrokerageEmail) {
          var listbrokerageemail = null;
        } else {
          var listbrokerageemail = data.CustomFields.ListBrokerageEmail.replace(
            /'/g,
            " "
          );
        }
        if (!data.CustomFields.ListBrokerageUnparsedAddress) {
          var listbrokerageaddress = null;
        } else {
          var listbrokerageaddress =
            data.CustomFields.ListBrokerageUnparsedAddress.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageUnitNumber) {
          var listbrokerageunitnumber = null;
        } else {
          var listbrokerageunitnumber =
            data.CustomFields.ListBrokerageUnitNumber.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageCity) {
          var listbrokeragecity = null;
        } else {
          var listbrokeragecity = data.CustomFields.ListBrokerageCity.replace(
            /'/g,
            " "
          );
        }
        if (!data.CustomFields.ListBrokerageStateOrProvince) {
          var listbrokeragestate = null;
        } else {
          var listbrokeragestate =
            data.CustomFields.ListBrokerageStateOrProvince.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageCountry) {
          var listbrokeragecountry = null;
        } else {
          var listbrokeragecountry =
            data.CustomFields.ListBrokerageCountry.replace(/'/g, " ");
        }
        // console.log(timestamp);
        client.query(
          `INSERT INTO listings(listingkey, listingid, media, listingurl, listprice, bedroomstotal, bathroomstotal, lotsizeacres, lotsizearea,
            lotsizeunits, livingarea, livingareaunits, standardstatus, locationpoint, propertytype, postalcode, listingtitle, listagentfullname, listagentkey, listagentemail, brokername, unparsedaddress, modificationtimestamp, transactiontype, propertysubtype, stories, interiorfeatures, exteriorfeatures, description, builtin, state, city, parking, listagentstatelicense,
            listagentpreferredphone,
            listagentofficephone,
            listagentmlsid,
            listagentfirstname,
            listagentlastname,  listbrokeragename, listbrokeragephone, listbrokerageemail, listbrokeragewebsiteurl, listbrokeragelogourl, listbrokerageunparsedaddress,
            listbrokerageunitnumber, listbrokeragecity, listbrokeragestateorprovince, listbrokeragepostalcode, listbrokeragecountry)
                  VALUES('${data.ListingKey}', '${data.ListingId
          }', '${media}', '${data.CustomFields.ListingURL}', ${data.ListPrice
          }, ${data.BedroomsTotal}, ${data.BathroomsFull}, ${data.LotSizeAcres
          }, ${data.LotSizeArea}, '${data.LotSizeUnits}', ${data.LivingArea
          }, '${data.LivingAreaUnits}', '${data.StandardStatus
          }', ST_SetSRID(ST_GeomFromText('POINT(${data.Longitude} ${data.Latitude
          })'), 4326),
                  '${propertytype}', '${postalCode}', '${listingtitle}', '${agentFullName}', '${data.ListAgentKey
          }', '${data.ListAgentEmail
          }', '${brokerName}', '${unparsedAddress}', '${timestamp}'::timestamp, '${data.TransactionType
          }', '${data.PropertySubType}', ${data.StoriesTotal
          }, '${interiorFeatures}', '${exteriorFeatures}', '${publicRemarks}', ${data.YearBuilt ? data.YearBuilt : null
          },  '${state}', '${city}', ${data.ParkingTotal ? data.ParkingTotal : null
          },'${data.ListAgentStateLicense}',
          '${data.ListAgentPreferredPhone}',
          '${data.ListAgentOfficePhone}',
          '${data.ListAgentMlsId}',
          '${agentFirstName}',
          '${agentLastName}', '${listbrokeragename}','${data.CustomFields.ListBrokeragePhone
          }','${listbrokerageemail}',
          '${data.CustomFields.ListBrokerageWebsiteUrl}','${data.CustomFields.ListBrokerageLogoUrl
          }','${listbrokerageaddress}','${listbrokerageunitnumber}','${listbrokeragecity}','${listbrokeragestate}',
          '${data.CustomFields.ListBrokeragePostalCode
          }','${listbrokeragecountry}');`,
          (err, result) => {
            if (err) {
              if (err.code == 23505) {
                client.query(
                  `UPDATE listings SET listingid = '${data.ListingId
                  }', media = '${media}', listprice = ${data.ListPrice
                  }, bedroomstotal = ${data.BedroomsTotal}, bathroomstotal = ${data.BathroomsFull
                  }, 
                  lotsizeacres = ${data.LotSizeAcres}, lotsizearea = ${data.LotSizeArea
                  }, lotsizeunits = '${data.LotSizeUnits}', livingarea = ${data.LivingArea ? data.LivingArea : null
                  }, livingareaunits = '${data.LivingAreaUnits ? data.LivingAreaUnits : null
                  }', standardstatus = '${data.StandardStatus
                  }', locationpoint = ST_SetSRID(ST_GeomFromText('POINT(${data.Longitude
                  } ${data.Latitude
                  })'), 4326), propertytype='${propertytype}', postalcode='${postalCode}', 
                  listingtitle = '${listingtitle}', listagentfullname = '${agentFullName}', listagentkey = '${data.ListAgentKey
                  }', listagentemail = '${data.ListAgentEmail
                  }', brokername = '${brokerName}', 
                  unparsedaddress = '${unparsedAddress}', modificationtimestamp = '${timestamp}'::timestamp, transactiontype = '${data.TransactionType
                  }', propertysubtype = '${data.PropertySubType}', stories = ${data.StoriesTotal
                  }, 
                  interiorfeatures = '${interiorFeatures}', exteriorfeatures = '${exteriorFeatures}', description = '${publicRemarks}', builtin = ${data.YearBuilt ? data.YearBuilt : null
                  }, state = '${state}', city = '${city}', parking = ${data.ParkingTotal ? data.ParkingTotal : null
                  }, listagentstatelicense = '${data.ListAgentStateLicense}',
                  listagentpreferredphone = '${data.ListAgentPreferredPhone}',
                  listagentofficephone = '${data.ListAgentOfficePhone}',
                  listagentmlsid = '${data.ListAgentMlsId}',
                  listagentfirstname = '${agentFirstName}',
                  listagentlastname = '${agentLastName}',
                  listbrokeragename = '${listbrokeragename}', listbrokeragephone = '${data.CustomFields.ListBrokeragePhone
                  }', listbrokerageemail = '${listbrokerageemail}',
                  listbrokeragewebsiteurl = '${data.CustomFields.ListBrokerageWebsiteUrl
                  }', listbrokeragelogourl = '${data.CustomFields.ListBrokerageLogoUrl
                  }', listbrokerageunparsedaddress = '${listbrokerageaddress}', listbrokerageunitnumber = '${listbrokerageunitnumber}', listbrokeragecity = '${listbrokeragecity}', listbrokeragestateorprovince = '${listbrokeragestate}',
                  listbrokeragepostalcode = '${data.CustomFields.ListBrokeragePostalCode
                  }', listbrokeragecountry = '${listbrokeragecountry}' 
                  WHERE listingkey='${data.ListingKey}';`,
                  (err, result) => {
                    if (err) {
                      console.log(err.stack);
                    } else {
                      //Send Email - Updated Listing
                      console.log("listing updated");
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            * {
                line-height: inherit;
            }
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col_cont {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num2 {
                    width: 16.6% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num5 {
                    width: 41.6% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num7 {
                    width: 58.3% !important;
                }
                .no-stack .col.num8 {
                    width: 66.6% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .no-stack .col.num10 {
                    width: 83.3% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                Status Updated! ${agentFirstName}
                                                                ${agentLastName}<br /> <br /></h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                                        <div align="center" class="img-container center autowidth"
                                                            style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            ${JSON.parse(media)[0] ? `<img align="center" border="0"
                                                                class="center autowidth"
                                                                src="${JSON.parse(media)[0].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                                width="500" />`: ''}
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <p
                                                            style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;font-weight: bold;">$
                                                                ${data.ListPrice}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;">${unparsedAddress} | ${city}
                                                                | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs |
                                                                ${data.BathroomsFull} BAs</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[1] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[1].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[2] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[2].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[3] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[3].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[4] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[4].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[5] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[5].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[6] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[6].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${publicRemarks}</span>
                                                    </p>
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                        <span style="font-size: 15px;">Presented By:
                                                            ${listbrokeragename}</span>
                                                    </p>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="margin-top: 10px;text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                                            style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To View
                                                                This Property</span></a>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">Your Listing is Now on
                                                            </span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">HarmonHomes.com</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <hr />
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                             Ⓒ 2020 Harmon Homes. All Rights
                                                            Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
</html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your updated listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });
                    }
                  }
                );
              } else {
                console.log(err.stack);
              }
            } else {
              console.log("new listing");
              //Send Email - New Listing 
              var listagentemailcheck = data.ListAgentEmail;
              var brokeragePostalCode = data.CustomFields.ListBrokeragePostalCode;
              client.query(
                `SELECT * FROM agent_credentials WHERE primaryemail='${listagentemailcheck}'`,
                (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "not able to query",
                    });
                  }
                  else {
                    var premieragent = result.fields[23];
                    var emailverified = result.fields[22];
                    if (premieragent === true) {
                      console.log("premieragent")
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            * {
                line-height: inherit;
            }
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col_cont {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num2 {
                    width: 16.6% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num5 {
                    width: 41.6% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num7 {
                    width: 58.3% !important;
                }
                .no-stack .col.num8 {
                    width: 66.6% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .no-stack .col.num10 {
                    width: 83.3% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                Congratulations ${agentFirstName}
                                                                ${agentLastName}<br /> <br /></h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                                        <div align="center" class="img-container center autowidth"
                                                            style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            ${JSON.parse(media)[0] ? `<img align="center" border="0"
                                                                class="center autowidth"
                                                                src="${JSON.parse(media)[0].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                                width="500" />`: ''}
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <p
                                                            style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;font-weight: bold;">$
                                                                ${data.ListPrice}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;">${unparsedAddress} | ${city}
                                                                | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs |
                                                                ${data.BathroomsFull} BAs</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[1] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[1].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[2] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[2].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[3] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[3].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[4] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[4].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[5] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[5].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[6] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[6].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${publicRemarks}</span>
                                                    </p>
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                        <span style="font-size: 15px;">Presented By:
                                                            ${listbrokeragename}</span>
                                                    </p>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="margin-top: 10px;text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                                            style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To View
                                                                This Property</span></a>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">Your Listing is Now on
                                                            </span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">HarmonHomes.com</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <hr />
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                             Ⓒ 2020 Harmon Homes. All Rights
                                                            Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
</html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your new listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });

                      //Mail about the property to all the agent in the postalcode
                      client.query(`Select listagentemail, listagentfullname from listings where listbrokeragepostalcode = '${brokeragePostalCode}';`,
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error: "not able to query",
                            });
                          } else {
                            //Loop to send mail multiple property in the same postalcode
                            for (var i = 0; i < result.rowCount; i++) {
                              var agentEmail = result.rows[i].listagentemail;
                              var listagentfullname = result.rows[i].listagentfullname;
                              var params = {
                                Destination: {
                                  ToAddresses: [
                                    agentEmail,
                                  ],
                                },
                                Message: {
                                  Body: {
                                    Html: {
                                      Charset: "UTF-8",
                                      Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }

            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }

            * {
                line-height: inherit;
            }

            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }

        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {

                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }

                .block-grid {
                    width: 100% !important;
                }

                .col {
                    width: 100% !important;
                }

                .col_cont {
                    margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }

                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }

                .no-stack.two-up .col {
                    width: 50% !important;
                }

                .no-stack .col.num2 {
                    width: 16.6% !important;
                }

                .no-stack .col.num3 {
                    width: 25% !important;
                }

                .no-stack .col.num4 {
                    width: 33% !important;
                }

                .no-stack .col.num5 {
                    width: 41.6% !important;
                }

                .no-stack .col.num6 {
                    width: 50% !important;
                }

                .no-stack .col.num7 {
                    width: 58.3% !important;
                }

                .no-stack .col.num8 {
                    width: 66.6% !important;
                }

                .no-stack .col.num9 {
                    width: 75% !important;
                }

                .no-stack .col.num10 {
                    width: 83.3% !important;
                }

                .video-block {
                    max-width: none !important;
                }

                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }

        </style>
    </head>

    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:37px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                ${listagentfullname ? listagentfullname : ""}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;"><strong>Don't miss another
                                                                    Lead!</strong></span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;">A lead came from ${brokeragePostalCode}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span
                                                                style="font-size: 22px;"><strong>HarmonHomes.com</strong></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper" align="center"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <span
                                                            style="font-size: 17px; mso-ansi-font-size: 18px;">Subscribe
                                                            to HarmonHomes.com to not only receive leads on your
                                                            listings, but also the zip codes you list in!</span>

                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div class="img-container center autowidth row"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Locator.png"
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 45%; max-width: 500px; display: block;" />
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Agent.png"
                                                            style="height: 50%; width: 35%; z-index: 2; max-width: 500px; display: block; margin-top: -50% !important; margin-left: 50%;" />
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:221.25pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <span
                                                            style="padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><a
                                                                href="https://harmonhomes.com/agent-signin"
                                                                style="text-decoration: none; color: white; font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To Start Claiming Your Zip Leads</a></span>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>

</html>`,
                                    },
                                    Text: {
                                      Charset: "UTF-8",
                                      Data: "TEXT_FORMAT_BODY",
                                    },
                                  },
                                  Subject: {
                                    Charset: "UTF-8",
                                    Data: "Your new listing on Harmon Homes",
                                  },
                                },
                                Source: "info@harmonhomes.com" /* required */,
                                ReplyToAddresses: [
                                  "info@harmonhomes.com",
                                  /* more items */
                                ],
                              };
                              // Create the promise and SES service object
                              // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                              //   .sendEmail(params)
                              //   .promise();
                              // // Handle promise's fulfilled/rejected states
                              // sendPromise
                              //   .then(function (data) {
                              //     console.log(data.MessageId);
                              //   })
                              //   .catch(function (err) {
                              //     console.error(err, err.stack);
                              //   });
                            }
                          }
                        })
                    } else if (emailverified === true) {
                      console.log("email verification")
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            * {
                line-height: inherit;
            }
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col_cont {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num2 {
                    width: 16.6% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num5 {
                    width: 41.6% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num7 {
                    width: 58.3% !important;
                }
                .no-stack .col.num8 {
                    width: 66.6% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .no-stack .col.num10 {
                    width: 83.3% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                Congratulations ${agentFirstName}
                                                                ${agentLastName}<br /> <br /></h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                                        <div align="center" class="img-container center autowidth"
                                                            style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            ${JSON.parse(media)[0] ? `<img align="center" border="0"
                                                                class="center autowidth"
                                                                src="${JSON.parse(media)[0].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                                width="500" />`: ''}
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <p
                                                            style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;font-weight: bold;">$
                                                                ${data.ListPrice}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;">${unparsedAddress} | ${city}
                                                                | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs |
                                                                ${data.BathroomsFull} BAs</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[1] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[1].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[2] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[2].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[3] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[3].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[4] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[4].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[5] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[5].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[6] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[6].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${publicRemarks}</span>
                                                    </p>
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                        <span style="font-size: 15px;">Presented By:
                                                            ${listbrokeragename}</span>
                                                    </p>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="margin-top: 10px;text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                                            style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To View
                                                                This Property</span></a>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">Your Listing is Now on
                                                            </span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">HarmonHomes.com</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <hr />
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                             Ⓒ 2020 Harmon Homes. All Rights
                                                            Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
</html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your new listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });

                      client.query(`Select listagentemail, listagentfullname from listings where listbrokeragepostalcode = '${brokeragePostalCode}';`,
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error: "not able to query",
                            });
                          } else {
                            for (var i = 0; i < result.rowCount; i++) {
                              var agentEmail = result.rows[i].listagentemail;
                              var listagentfullname = result.rows[i].listagentfullname;
                              var params = {
                                Destination: {
                                  ToAddresses: [
                                    agentEmail,
                                  ],
                                },
                                Message: {
                                  Body: {
                                    Html: {
                                      Charset: "UTF-8",
                                      Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }

            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }

            * {
                line-height: inherit;
            }

            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }

        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {

                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }

                .block-grid {
                    width: 100% !important;
                }

                .col {
                    width: 100% !important;
                }

                .col_cont {
                    margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }

                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }

                .no-stack.two-up .col {
                    width: 50% !important;
                }

                .no-stack .col.num2 {
                    width: 16.6% !important;
                }

                .no-stack .col.num3 {
                    width: 25% !important;
                }

                .no-stack .col.num4 {
                    width: 33% !important;
                }

                .no-stack .col.num5 {
                    width: 41.6% !important;
                }

                .no-stack .col.num6 {
                    width: 50% !important;
                }

                .no-stack .col.num7 {
                    width: 58.3% !important;
                }

                .no-stack .col.num8 {
                    width: 66.6% !important;
                }

                .no-stack .col.num9 {
                    width: 75% !important;
                }

                .no-stack .col.num10 {
                    width: 83.3% !important;
                }

                .video-block {
                    max-width: none !important;
                }

                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }

        </style>
    </head>

    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:37px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                ${listagentfullname ? listagentfullname : ""}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;"><strong>Don't miss another
                                                                    Lead!</strong></span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;">A lead came from ${brokeragePostalCode}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span
                                                                style="font-size: 22px;"><strong>HarmonHomes.com</strong></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper" align="center"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <span
                                                            style="font-size: 17px; mso-ansi-font-size: 18px;">Subscribe
                                                            to HarmonHomes.com to not only receive leads on your
                                                            listings, but also the zip codes you list in!</span>

                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div class="img-container center autowidth row"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Locator.png"
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 45%; max-width: 500px; display: block;" />
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Agent.png"
                                                            style="height: 50%; width: 35%; z-index: 2; max-width: 500px; display: block; margin-top: -50% !important; margin-left: 50%;" />
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:221.25pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <span
                                                            style="padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><a
                                                                href="https://harmonhomes.com/agent-signin"
                                                                style="text-decoration: none; color: white; font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To Start Claiming Your Zip Leads</a></span>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>

</html>`,
                                    },
                                    Text: {
                                      Charset: "UTF-8",
                                      Data: "TEXT_FORMAT_BODY",
                                    },
                                  },
                                  Subject: {
                                    Charset: "UTF-8",
                                    Data: "Your new listing on Harmon Homes",
                                  },
                                },
                                Source: "info@harmonhomes.com" /* required */,
                                ReplyToAddresses: [
                                  "info@harmonhomes.com",
                                  /* more items */
                                ],
                              };
                              // Create the promise and SES service object
                              // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                              //   .sendEmail(params)
                              //   .promise();
                              // // Handle promise's fulfilled/rejected states
                              // sendPromise
                              //   .then(function (data) {
                              //     console.log(data.MessageId);
                              //   })
                              //   .catch(function (err) {
                              //     console.error(err, err.stack);
                              //   });
                            }
                          }
                        })
                    } else {
                      console.log("basic agent")
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
                      PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
                      xmlns:v="urn:schemas-microsoft-com:vml">
                    <head>
                      <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                      <meta content="width=device-width" name="viewport" />
                      <!--[if !mso]><!-->
                      <meta content="IE=edge" http-equiv="X-UA-Compatible" />
                      <!--<![endif]-->
                      <title></title>
                      <!--[if !mso]><!-->
                      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
                      <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
                      <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
                      <!--<![endif]-->
                      <style type="text/css">
                        body {
                          margin: 0;
                          padding: 0;
                        }
                        table,
                        td,
                        tr {
                          vertical-align: top;
                          border-collapse: collapse;
                        }
                        * {
                          line-height: inherit;
                        }
                        a[x-apple-data-detectors=true] {
                          color: inherit !important;
                          text-decoration: none !important;
                        }
                      </style>
                      <style id="media-query" type="text/css">
                        @media (max-width: 520px) {
                          .block-grid,
                          .col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                          }
                          .block-grid {
                            width: 100% !important;
                          }
                          .col {
                            width: 100% !important;
                          }
                          .col_cont {
                            margin: 0 auto;
                          }
                          img.fullwidth,
                          img.fullwidthOnMobile {
                            max-width: 100% !important;
                          }
                          .no-stack .col {
                            min-width: 0 !important;
                            display: table-cell !important;
                          }
                          .no-stack.two-up .col {
                            width: 50% !important;
                          }
                          .no-stack .col.num2 {
                            width: 16.6% !important;
                          }
                          .no-stack .col.num3 {
                            width: 25% !important;
                          }
                          .no-stack .col.num4 {
                            width: 33% !important;
                          }
                          .no-stack .col.num5 {
                            width: 41.6% !important;
                          }
                          .no-stack .col.num6 {
                            width: 50% !important;
                          }
                          .no-stack .col.num7 {
                            width: 58.3% !important;
                          }
                          .no-stack .col.num8 {
                            width: 66.6% !important;
                          }
                          .no-stack .col.num9 {
                            width: 75% !important;
                          }
                          .no-stack .col.num10 {
                            width: 83.3% !important;
                          }
                          .video-block {
                            max-width: none !important;
                          }
                          .mobile_hide {
                            min-height: 0px;
                            max-height: 0px;
                            max-width: 0px;
                            display: none;
                            overflow: hidden;
                            font-size: 0px;
                          }
                          .desktop_hide {
                            display: block !important;
                            max-height: none !important;
                          }
                        }
                      </style>
                    </head>
                    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
                      <!--[if IE]><div class="ie-browser"><![endif]-->
                      <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                        style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
                        valign="top" width="100%">
                        <tbody>
                          <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                              <div style="background-color:transparent;">
                                <div class="block-grid"
                                  style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                  <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                      style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                      <div class="col_cont" style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                          style="border: 2px solid #eee; padding: 30px">
                                            <a href="https://harmonhomes.com/home" style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                            <hr />
                                          <!--<![endif]-->
                                          <table cellpadding="0" cellspacing="0" role="presentation"
                                            style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                            valign="top" width="100%">
                                            <tr style="vertical-align: top;" valign="top">
                                              <td align="center"
                                                style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                valign="top" width="100%">
                                                <h1
                                                  style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                  Congratulations ${agentFirstName} ${agentLastName}<br /> <br /></h1>
                                              </td>
                                            </tr>
                                          </table>
                                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                          <div
                                            style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                            <div class="txtTinyMce-wrapper"
                                              style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                              <div align="center" class="img-container center autowidth"
                                              style="padding-right: 0px;padding-left: 0px;">
                                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                              ${JSON.parse(media)[0] ? `<img align="center" border="0" class="center autowidth" src="${JSON.parse(media)[0].MediaURL}" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                              width="500" />`: ''}
                                              <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                              <p
                                                style="margin-top: 2px; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;font-weight: bold;">$ ${data.ListPrice}</span>
                                              </p>
                                               <p
                                                style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;">${unparsedAddress} | ${city} | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs | ${data.BathroomsFull} BAs</span>
                                              </p>
                                            </div>
                                          </div>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                          <div align="center" class="button-container"
                                            style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                             <p
                                                style="margin-top: 2px; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;font-weight: bold;">Presented By: ${listbrokeragename}</span>
                                              </p>
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                            <div
                                              style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                              style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click Here To View
                                                This Property</span></a>
                                            </div>
                                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                          </div>
                                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                          <div
                                            style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                            <div class="txtTinyMce-wrapper"
                                              style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                              <p
                                                style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;">Your Listing is Now on
                                                </span>
                                              </p>
                                              <p
                                                style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;">HarmonHomes.com</span>
                                              </p>
                                            </div>
                                          </div>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                          <hr />
                                          <div
                                            style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                            <div class="txtTinyMce-wrapper"
                                              style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                              <p
                                                style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                 Ⓒ 2020 Harmon Homes. All Rights
                                                Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                            </div>
                                          </div>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                          <div align="center" class="img-container center autowidth"
                                            style="padding-right: 0px;padding-left: 0px;">
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                              align="center" border="0" class="center autowidth"
                                              src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                              style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                              width="500" />
                                            <!--[if mso]></td></tr></table><![endif]-->
                                          </div>
                                          <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                      </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
                              </div>
                              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (IE)]></div><![endif]-->
                    </body>
                    </html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your new listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });
                      client.query(`Select listagentemail, listagentfullname from listings where listbrokeragepostalcode = '${brokeragePostalCode}';`,
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error: "not able to query",
                            });
                          } else {
                            for (var i = 0; i < result.rowCount; i++) {
                              var agentEmail = result.rows[i].listagentemail;
                              var listagentfullname = result.rows[i].listagentfullname;
                              var params = {
                                Destination: {
                                  ToAddresses: [
                                    agentEmail,
                                  ],
                                },
                                Message: {
                                  Body: {
                                    Html: {
                                      Charset: "UTF-8",
                                      Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }

            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }

            * {
                line-height: inherit;
            }

            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }

        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {

                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }

                .block-grid {
                    width: 100% !important;
                }

                .col {
                    width: 100% !important;
                }

                .col_cont {
                    margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }

                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }

                .no-stack.two-up .col {
                    width: 50% !important;
                }

                .no-stack .col.num2 {
                    width: 16.6% !important;
                }

                .no-stack .col.num3 {
                    width: 25% !important;
                }

                .no-stack .col.num4 {
                    width: 33% !important;
                }

                .no-stack .col.num5 {
                    width: 41.6% !important;
                }

                .no-stack .col.num6 {
                    width: 50% !important;
                }

                .no-stack .col.num7 {
                    width: 58.3% !important;
                }

                .no-stack .col.num8 {
                    width: 66.6% !important;
                }

                .no-stack .col.num9 {
                    width: 75% !important;
                }

                .no-stack .col.num10 {
                    width: 83.3% !important;
                }

                .video-block {
                    max-width: none !important;
                }

                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }

        </style>
    </head>

    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:37px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                ${listagentfullname ? listagentfullname : ""}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;"><strong>Don't miss another
                                                                    Lead!</strong></span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;">A lead came from ${brokeragePostalCode}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span
                                                                style="font-size: 22px;"><strong>HarmonHomes.com</strong></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper" align="center"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <span
                                                            style="font-size: 17px; mso-ansi-font-size: 18px;">Subscribe
                                                            to HarmonHomes.com to not only receive leads on your
                                                            listings, but also the zip codes you list in!</span>

                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div class="img-container center autowidth row"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Locator.png"
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 45%; max-width: 500px; display: block;" />
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Agent.png"
                                                            style="height: 50%; width: 35%; z-index: 2; max-width: 500px; display: block; margin-top: -50% !important; margin-left: 50%;" />
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:221.25pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <span
                                                            style="padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><a
                                                                href="https://harmonhomes.com/agent-reg?name=${listagentfullname}&email=${agentEmail}"
                                                                style="text-decoration: none; color: white; font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To Start Claiming Your Zip Leads</a></span>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>

</html>`,
                                    },
                                    Text: {
                                      Charset: "UTF-8",
                                      Data: "TEXT_FORMAT_BODY",
                                    },
                                  },
                                  Subject: {
                                    Charset: "UTF-8",
                                    Data: "Your new listing on Harmon Homes",
                                  },
                                },
                                Source: "info@harmonhomes.com" /* required */,
                                ReplyToAddresses: [
                                  "info@harmonhomes.com",
                                  /* more items */
                                ],
                              };
                              // Create the promise and SES service object
                              // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                              //   .sendEmail(params)
                              //   .promise();
                              // // Handle promise's fulfilled/rejected states
                              // sendPromise
                              //   .then(function (data) {
                              //     console.log(data.MessageId);
                              //   })
                              //   .catch(function (err) {
                              //     console.error(err, err.stack);
                              //   });
                            }
                          }
                        })
                    }
                  }
                }
              );
            }
          }
        );
      } else {
        if (data.Media) {
          var mediaUnparsed = JSON.stringify(data.Media);
          var media = mediaUnparsed.replace(/'/g, " ");
        } else {
          var media = null;
        }
        if (!data.ListAgentFullName) {
          var agentFullName = null;
        } else {
          var agentFullName = data.ListAgentFullName.replace(/'/g, " ");
        }
        if (!data.ListAgentFirstName) {
          var agentFirstName = null;
        } else {
          var agentFirstName = data.ListAgentFirstName.replace(/'/g, " ");
        }
        if (!data.ListAgentLastName) {
          var agentLastName = null;
        } else {
          var agentLastName = data.ListAgentLastName.replace(/'/g, " ");
        }
        if (!data.BrokerName) {
          var brokerName = null;
        } else {
          var brokerName = data.BrokerName.replace(/'/g, " ");
        }
        if (!data.UnparsedAddress) {
          var unparsedAddress = null;
        } else {
          var unparsedAddress = data.UnparsedAddress.replace(/'/g, " ");
        }
        if (data.ModificationTimestamp) {
          var timestamp = data.ModificationTimestamp;
        } else {
          var timestamp = "2000-01-01";
        }
        if (data.CustomFields) {
          if (!data.CustomFields.ListingTitle) {
            var listingtitle = null;
          } else {
            var listingtitle = data.CustomFields.ListingTitle.replace(
              /'/g,
              " "
            );
          }
        } else {
          var timestamp = "2000-01-01";
          var listingtitle = null;
        }
        if (!data.PostalCode) {
          var postalCode = null;
        } else {
          var postalCode = data.PostalCode.replace(/'/g, " ");
        }
        if (!data.PropertyType) {
          var propertytype = null;
        } else {
          var propertytype = data.PropertyType.replace(/'/g, " ");
        }
        if (!data.InteriorFeatures) {
          var interiorFeatures = null;
        } else {
          var interior = JSON.stringify(data.InteriorFeatures);
          var interiorFeatures = interior.replace(/'/g, " ");
        }
        if (!data.ExteriorFeatures) {
          var exteriorFeatures = null;
        } else {
          var exterior = JSON.stringify(data.ExteriorFeatures);
          var exteriorFeatures = exterior.replace(/'/g, " ");
        }
        if (!data.PublicRemarks) {
          var publicRemarks = null;
        } else {
          var publicRemarks = data.PublicRemarks.replace(/'/g, " ");
        }
        if (!data.StateOrProvince) {
          var state = null;
        } else {
          var state = data.StateOrProvince.replace(/'/g, " ");
        }
        if (!data.PostalCity) {
          var city = null;
        } else {
          var city = data.PostalCity.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageName) {
          var listbrokeragename = null;
        } else {
          var listbrokeragename = data.CustomFields.ListBrokerageName.replace(
            /'/g,
            " "
          );
        }
        if (!data.CustomFields.ListBrokerageEmail) {
          var listbrokerageemail = null;
        } else {
          var listbrokerageemail = data.CustomFields.ListBrokerageEmail.replace(
            /'/g,
            " "
          );
        }
        if (!data.CustomFields.ListBrokerageUnparsedAddress) {
          var listbrokerageaddress = null;
        } else {
          var listbrokerageaddress =
            data.CustomFields.ListBrokerageUnparsedAddress.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageUnitNumber) {
          var listbrokerageunitnumber = null;
        } else {
          var listbrokerageunitnumber =
            data.CustomFields.ListBrokerageUnitNumber.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageCity) {
          var listbrokeragecity = null;
        } else {
          var listbrokeragecity = data.CustomFields.ListBrokerageCity.replace(
            /'/g,
            " "
          );
        }
        if (!data.CustomFields.ListBrokerageStateOrProvince) {
          var listbrokeragestate = null;
        } else {
          var listbrokeragestate =
            data.CustomFields.ListBrokerageStateOrProvince.replace(/'/g, " ");
        }
        if (!data.CustomFields.ListBrokerageCountry) {
          var listbrokeragecountry = null;
        } else {
          var listbrokeragecountry =
            data.CustomFields.ListBrokerageCountry.replace(/'/g, " ");
        }
        client.query(
          `INSERT INTO listings(listingkey, listingid, media, listingurl, listprice, bedroomstotal, bathroomstotal, lotsizeacres, lotsizearea,
            lotsizeunits, livingarea, livingareaunits, standardstatus, propertytype, postalcode, listingtitle, listagentfullname, listagentkey, listagentemail, brokername, unparsedaddress, modificationtimestamp, transactiontype, propertysubtype, stories, interiorfeatures, exteriorfeatures, description, builtin, state, city, parking, listagentstatelicense,
            listagentpreferredphone,
            listagentofficephone,
            listagentmlsid,
            listagentfirstname,
            listagentlastname, listbrokeragename, listbrokeragephone, listbrokerageemail, listbrokeragewebsiteurl, listbrokeragelogourl, listbrokerageunparsedaddress,
            listbrokerageunitnumber, listbrokeragecity, listbrokeragestateorprovince, listbrokeragepostalcode, listbrokeragecountry)
                  VALUES('${data.ListingKey}', '${data.ListingId
          }', '${media}', '${data.CustomFields.ListingURL}', ${data.ListPrice
          }, ${data.BedroomsTotal}, ${data.BathroomsFull}, ${data.LotSizeAcres
          }, ${data.LotSizeArea}, '${data.LotSizeUnits}', ${data.LivingArea
          }, '${data.LivingAreaUnits}', '${data.StandardStatus
          }', '${propertytype}', '${postalCode}', '${listingtitle}', '${agentFullName}', '${data.ListAgentKey
          }', '${data.ListAgentEmail
          }', '${brokerName}', '${unparsedAddress}', '${timestamp}'::timestamp, '${data.TransactionType
          }', '${data.PropertySubType}', ${data.StoriesTotal
          }, '${interiorFeatures}', '${exteriorFeatures}', '${publicRemarks}', ${data.YearBuilt ? data.YearBuilt : null
          },  '${state}', '${city}', ${data.ParkingTotal ? data.ParkingTotal : null
          },'${data.ListAgentStateLicense}',
          '${data.ListAgentPreferredPhone}',
          '${data.ListAgentOfficePhone}',
          '${data.ListAgentMlsId}',
          '${agentFirstName}',
          '${agentLastName}', '${listbrokeragename}','${data.CustomFields.ListBrokeragePhone
          }','${listbrokerageemail}',
          '${data.CustomFields.ListBrokerageWebsiteUrl}','${data.CustomFields.ListBrokerageLogoUrl
          }','${listbrokerageaddress}','${listbrokerageunitnumber}','${listbrokeragecity}','${listbrokeragestate}',
          '${data.CustomFields.ListBrokeragePostalCode
          }','${listbrokeragecountry}');`,
          (err, result) => {
            if (err) {
              if (err.code == 23505) {
                client.query(
                  `UPDATE listings SET listingid = '${data.ListingId
                  }',media = '${media}', listprice = ${data.ListPrice
                  }, bedroomstotal = ${data.BedroomsTotal}, bathroomstotal = ${data.BathroomsFull
                  }, 
                  lotsizeacres = ${data.LotSizeAcres}, lotsizearea = ${data.LotSizeArea
                  }, lotsizeunits = '${data.LotSizeUnits}', livingarea = ${data.LivingArea ? data.LivingArea : null
                  }, livingareaunits = '${data.LivingAreaUnits ? data.LivingAreaUnits : null
                  }', standardstatus = '${data.StandardStatus
                  }', propertytype='${propertytype}', postalcode='${postalCode}', 
                  listingtitle = '${listingtitle}', listagentfullname = '${agentFullName}', listagentkey = '${data.ListAgentKey
                  }', listagentemail = '${data.ListAgentEmail
                  }', brokername = '${brokerName}', 
                  unparsedaddress = '${unparsedAddress}', modificationtimestamp = '${timestamp}'::timestamp, transactiontype = '${data.TransactionType
                  }', propertysubtype = '${data.PropertySubType}', stories = ${data.StoriesTotal
                  }, 
                  interiorfeatures = '${interiorFeatures}', exteriorfeatures = '${exteriorFeatures}', description = '${publicRemarks}', builtin = ${data.YearBuilt ? data.YearBuilt : null
                  }, state = '${state}', city = '${city}', parking = ${data.ParkingTotal ? data.ParkingTotal : null
                  }, listagentstatelicense = '${data.ListAgentStateLicense}',
                  listagentpreferredphone = '${data.ListAgentPreferredPhone}',
                  listagentofficephone = '${data.ListAgentOfficePhone}',
                  listagentmlsid = '${data.ListAgentMlsId}',
                  listagentfirstname = '${agentFirstName}',
                  listagentlastname = '${agentLastName}', listbrokeragename = '${listbrokeragename}', listbrokeragephone = '${data.CustomFields.ListBrokeragePhone
                  }', listbrokerageemail = '${listbrokerageemail}',
                  listbrokeragewebsiteurl = '${data.CustomFields.ListBrokerageWebsiteUrl
                  }', listbrokeragelogourl = '${data.CustomFields.ListBrokerageLogoUrl
                  }', listbrokerageunparsedaddress = '${listbrokerageaddress}', listbrokerageunitnumber = '${listbrokerageunitnumber}', listbrokeragecity = '${listbrokeragecity}', listbrokeragestateorprovince = '${listbrokeragestate}',
                  listbrokeragepostalcode = '${data.CustomFields.ListBrokeragePostalCode
                  }', listbrokeragecountry = '${listbrokeragecountry}' 
                  WHERE listingkey='${data.ListingKey}';`,
                  (err, result) => {
                    if (err) {
                      console.log(err.stack);
                      return;
                    } else {
                      //Send mail - Update listing
                      console.log("listing updated");
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            * {
                line-height: inherit;
            }
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col_cont {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num2 {
                    width: 16.6% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num5 {
                    width: 41.6% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num7 {
                    width: 58.3% !important;
                }
                .no-stack .col.num8 {
                    width: 66.6% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .no-stack .col.num10 {
                    width: 83.3% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                Congratulations ${agentFirstName}
                                                                ${agentLastName}<br /> <br /></h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                                        <div align="center" class="img-container center autowidth"
                                                            style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            ${JSON.parse(media)[0] ? `<img align="center" border="0"
                                                                class="center autowidth"
                                                                src="${JSON.parse(media)[0].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                                width="500" />`: ''}
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <p
                                                            style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;font-weight: bold;">$
                                                                ${data.ListPrice}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;">${unparsedAddress} | ${city}
                                                                | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs |
                                                                ${data.BathroomsFull} BAs</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[1] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[1].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[2] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[2].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[3] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[3].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[4] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[4].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[5] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[5].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[6] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[6].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${publicRemarks}</span>
                                                    </p>
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                        <span style="font-size: 15px;">Presented By:
                                                            ${listbrokeragename}</span>
                                                    </p>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="margin-top: 10px;text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                                            style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To View
                                                                This Property</span></a>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">Your Listing is Now on
                                                            </span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">HarmonHomes.com</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <hr />
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                             Ⓒ 2020 Harmon Homes. All Rights
                                                            Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
</html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your updated listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });
                    }
                  }
                );
              } else {
                console.log(err.stack);
                return;
              }
            } else {
              var brokeragePostalCode = data.CustomFields.ListBrokeragePostalCode;
              client.query(
                `SELECT * FROM agent_credentials WHERE primaryemail='${data.ListAgentEmail}'`,
                (err, result) => {
                  if (err) {
                    return res.status(400).json({
                      error: "not able to query",
                    });
                  }
                  else {
                    var premieragent = result.fields[23];
                    var emailverified = result.fields[22];
                    if (premieragent === true) {
                      console.log("premieragent")
                      var params = {
                        Destination: {
                          ToAddresses: [
                             ,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            * {
                line-height: inherit;
            }
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col_cont {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num2 {
                    width: 16.6% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num5 {
                    width: 41.6% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num7 {
                    width: 58.3% !important;
                }
                .no-stack .col.num8 {
                    width: 66.6% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .no-stack .col.num10 {
                    width: 83.3% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                Congratulations ${agentFirstName}
                                                                ${agentLastName}<br /> <br /></h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                                        <div align="center" class="img-container center autowidth"
                                                            style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            ${JSON.parse(media)[0] ? `<img align="center" border="0"
                                                                class="center autowidth"
                                                                src="${JSON.parse(media)[0].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                                width="500" />`: ''}
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <p
                                                            style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;font-weight: bold;">$
                                                                ${data.ListPrice}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;">${unparsedAddress} | ${city}
                                                                | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs |
                                                                ${data.BathroomsFull} BAs</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[1] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[1].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[2] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[2].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[3] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[3].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[4] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[4].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[5] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[5].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[6] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[6].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${publicRemarks}</span>
                                                    </p>
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                        <span style="font-size: 15px;">Presented By:
                                                            ${listbrokeragename}</span>
                                                    </p>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="margin-top: 10px;text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                                            style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To View
                                                                This Property</span></a>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">Your Listing is Now on
                                                            </span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">HarmonHomes.com</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <hr />
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                             Ⓒ 2020 Harmon Homes. All Rights
                                                            Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
</html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your new listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });

                      client.query(`Select listagentemail, listagentfullname from listings where listbrokeragepostalcode = '${brokeragePostalCode}';`,
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error: "not able to query",
                            });
                          } else {
                            console.log(result.rows[0])
                            for (var i = 0; i < result.rowCount; i++) {
                              var agentEmail = result.rows[i].listagentemail;
                              var listagentfullname = result.rows[i].listagentfullname;
                              var params = {
                                Destination: {
                                  ToAddresses: [
                                    agentEmail,
                                  ],
                                },
                                Message: {
                                  Body: {
                                    Html: {
                                      Charset: "UTF-8",
                                      Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }

            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }

            * {
                line-height: inherit;
            }

            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }

        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {

                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }

                .block-grid {
                    width: 100% !important;
                }

                .col {
                    width: 100% !important;
                }

                .col_cont {
                    margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }

                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }

                .no-stack.two-up .col {
                    width: 50% !important;
                }

                .no-stack .col.num2 {
                    width: 16.6% !important;
                }

                .no-stack .col.num3 {
                    width: 25% !important;
                }

                .no-stack .col.num4 {
                    width: 33% !important;
                }

                .no-stack .col.num5 {
                    width: 41.6% !important;
                }

                .no-stack .col.num6 {
                    width: 50% !important;
                }

                .no-stack .col.num7 {
                    width: 58.3% !important;
                }

                .no-stack .col.num8 {
                    width: 66.6% !important;
                }

                .no-stack .col.num9 {
                    width: 75% !important;
                }

                .no-stack .col.num10 {
                    width: 83.3% !important;
                }

                .video-block {
                    max-width: none !important;
                }

                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }

        </style>
    </head>

    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:37px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                ${listagentfullname ? listagentfullname : ""}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;"><strong>Don't miss another
                                                                    Lead!</strong></span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;">A lead came from ${brokeragePostalCode}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span
                                                                style="font-size: 22px;"><strong>HarmonHomes.com</strong></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper" align="center"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <span
                                                            style="font-size: 17px; mso-ansi-font-size: 18px;">Subscribe
                                                            to HarmonHomes.com to not only receive leads on your
                                                            listings, but also the zip codes you list in!</span>

                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div class="img-container center autowidth row"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Locator.png"
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 45%; max-width: 500px; display: block;" />
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Agent.png"
                                                            style="height: 50%; width: 35%; z-index: 2; max-width: 500px; display: block; margin-top: -50% !important; margin-left: 50%;" />
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:221.25pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <span
                                                            style="padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><a
                                                                href="https://harmonhomes.com/agent-signin"
                                                                style="text-decoration: none; color: white; font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To Start Claiming Your Zip Leads</a></span>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>

</html>`,
                                    },
                                    Text: {
                                      Charset: "UTF-8",
                                      Data: "TEXT_FORMAT_BODY",
                                    },
                                  },
                                  Subject: {
                                    Charset: "UTF-8",
                                    Data: "Your new listing on Harmon Homes",
                                  },
                                },
                                Source: "info@harmonhomes.com" /* required */,
                                ReplyToAddresses: [
                                  "info@harmonhomes.com",
                                  /* more items */
                                ],
                              };
                              // Create the promise and SES service object
                              // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                              //   .sendEmail(params)
                              //   .promise();
                              // // Handle promise's fulfilled/rejected states
                              // sendPromise
                              //   .then(function (data) {
                              //     console.log(data.MessageId);
                              //   })
                              //   .catch(function (err) {
                              //     console.error(err, err.stack);
                              //   });
                            }
                          }
                        })
                    } else if (emailverified === true) {
                      console.log("email verification")
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }
            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }
            * {
                line-height: inherit;
            }
            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }
        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {
                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                .block-grid {
                    width: 100% !important;
                }
                .col {
                    width: 100% !important;
                }
                .col_cont {
                    margin: 0 auto;
                }
                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }
                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }
                .no-stack.two-up .col {
                    width: 50% !important;
                }
                .no-stack .col.num2 {
                    width: 16.6% !important;
                }
                .no-stack .col.num3 {
                    width: 25% !important;
                }
                .no-stack .col.num4 {
                    width: 33% !important;
                }
                .no-stack .col.num5 {
                    width: 41.6% !important;
                }
                .no-stack .col.num6 {
                    width: 50% !important;
                }
                .no-stack .col.num7 {
                    width: 58.3% !important;
                }
                .no-stack .col.num8 {
                    width: 66.6% !important;
                }
                .no-stack .col.num9 {
                    width: 75% !important;
                }
                .no-stack .col.num10 {
                    width: 83.3% !important;
                }
                .video-block {
                    max-width: none !important;
                }
                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }
                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }
        </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                Congratulations ${agentFirstName}
                                                                ${agentLastName}<br /> <br /></h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                                        <div align="center" class="img-container center autowidth"
                                                            style="padding-right: 0px;padding-left: 0px;">
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                            ${JSON.parse(media)[0] ? `<img align="center" border="0"
                                                                class="center autowidth"
                                                                src="${JSON.parse(media)[0].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                                width="500" />`: ''}
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                        </div>
                                                        <p
                                                            style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;font-weight: bold;">$
                                                                ${data.ListPrice}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                            <span style="font-size: 15px;">${unparsedAddress} | ${city}
                                                                | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs |
                                                                ${data.BathroomsFull} BAs</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[1] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[1].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[2] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[2].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[3] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[3].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <div class="row">
                                                    <p
                                                        style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                        <span style="font-size: 15px;">${JSON.parse(media)[4] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[4].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[5] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[5].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                        <span style="font-size: 15px;">${JSON.parse(media)[6] ? `<img
                                                                border="0" class="center autowidth"
                                                                src="${JSON.parse(media)[6].MediaURL}"
                                                                style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0;"
                                                                width="130" />`: ''}</span>
                                                    </p>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px;">
                                                        <span style="font-size: 15px;">${publicRemarks}</span>
                                                    </p>
                                                    <p
                                                        style="font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; ">
                                                        <span style="font-size: 15px;">Presented By:
                                                            ${listbrokeragename}</span>
                                                    </p>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="margin-top: 10px;text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                                            style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To View
                                                                This Property</span></a>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">Your Listing is Now on
                                                            </span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 15px;">HarmonHomes.com</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <hr />
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                             Ⓒ 2020 Harmon Homes. All Rights
                                                            Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>
</html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your new listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com",
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });

                      client.query(`Select listagentemail, listagentfullname from listings where listbrokeragepostalcode = '${brokeragePostalCode}';`,
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error: "not able to query",
                            });
                          } else {
                            for (var i = 0; i < result.rowCount; i++) {
                              var agentEmail = result.rows[i].listagentemail;
                              var listagentfullname = result.rows[i].listagentfullname;
                              var params = {
                                Destination: {
                                  ToAddresses: [
                                    agentEmail,
                                  ],
                                },
                                Message: {
                                  Body: {
                                    Html: {
                                      Charset: "UTF-8",
                                      Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }

            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }

            * {
                line-height: inherit;
            }

            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }

        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {

                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }

                .block-grid {
                    width: 100% !important;
                }

                .col {
                    width: 100% !important;
                }

                .col_cont {
                    margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }

                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }

                .no-stack.two-up .col {
                    width: 50% !important;
                }

                .no-stack .col.num2 {
                    width: 16.6% !important;
                }

                .no-stack .col.num3 {
                    width: 25% !important;
                }

                .no-stack .col.num4 {
                    width: 33% !important;
                }

                .no-stack .col.num5 {
                    width: 41.6% !important;
                }

                .no-stack .col.num6 {
                    width: 50% !important;
                }

                .no-stack .col.num7 {
                    width: 58.3% !important;
                }

                .no-stack .col.num8 {
                    width: 66.6% !important;
                }

                .no-stack .col.num9 {
                    width: 75% !important;
                }

                .no-stack .col.num10 {
                    width: 83.3% !important;
                }

                .video-block {
                    max-width: none !important;
                }

                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }

        </style>
    </head>

    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:37px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                ${listagentfullname ? listagentfullname : ""}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;"><strong>Don't miss another
                                                                    Lead!</strong></span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;">A lead came from ${brokeragePostalCode}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span
                                                                style="font-size: 22px;"><strong>HarmonHomes.com</strong></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper" align="center"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <span
                                                            style="font-size: 17px; mso-ansi-font-size: 18px;">Subscribe
                                                            to HarmonHomes.com to not only receive leads on your
                                                            listings, but also the zip codes you list in!</span>

                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div class="img-container center autowidth row"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Locator.png"
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 45%; max-width: 500px; display: block;" />
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Agent.png"
                                                            style="height: 50%; width: 35%; z-index: 2; max-width: 500px; display: block; margin-top: -50% !important; margin-left: 50%;" />
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:221.25pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <span
                                                            style="padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><a
                                                                href="https://harmonhomes.com/agent-signin"
                                                                style="text-decoration: none; color: white; font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To Start Claiming Your Zip Leads</a></span>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>

</html>`,
                                    },
                                    Text: {
                                      Charset: "UTF-8",
                                      Data: "TEXT_FORMAT_BODY",
                                    },
                                  },
                                  Subject: {
                                    Charset: "UTF-8",
                                    Data: "Your new listing on Harmon Homes",
                                  },
                                },
                                Source: "info@harmonhomes.com" /* required */,
                                ReplyToAddresses: [
                                  "info@harmonhomes.com",
                                  /* more items */
                                ],
                              };
                              // Create the promise and SES service object
                              // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                              //   .sendEmail(params)
                              //   .promise();
                              // // Handle promise's fulfilled/rejected states
                              // sendPromise
                              //   .then(function (data) {
                              //     console.log(data.MessageId);
                              //   })
                              //   .catch(function (err) {
                              //     console.error(err, err.stack);
                              //   });
                            }
                          }
                        })
                    } else {
                      console.log("basic agent")
                      var params = {
                        Destination: {
                          ToAddresses: [
                            data.ListAgentEmail,
                          ],
                        },
                        Message: {
                          Body: {
                            Html: {
                              Charset: "UTF-8",
                              Data: `<!DOCTYPE html
                      PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
                      xmlns:v="urn:schemas-microsoft-com:vml">
                    <head>
                      <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                      <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                      <meta content="width=device-width" name="viewport" />
                      <!--[if !mso]><!-->
                      <meta content="IE=edge" http-equiv="X-UA-Compatible" />
                      <!--<![endif]-->
                      <title></title>
                      <!--[if !mso]><!-->
                      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
                      <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
                      <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
                      <!--<![endif]-->
                      <style type="text/css">
                        body {
                          margin: 0;
                          padding: 0;
                        }
                        table,
                        td,
                        tr {
                          vertical-align: top;
                          border-collapse: collapse;
                        }
                        * {
                          line-height: inherit;
                        }
                        a[x-apple-data-detectors=true] {
                          color: inherit !important;
                          text-decoration: none !important;
                        }
                      </style>
                      <style id="media-query" type="text/css">
                        @media (max-width: 520px) {
                          .block-grid,
                          .col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                          }
                          .block-grid {
                            width: 100% !important;
                          }
                          .col {
                            width: 100% !important;
                          }
                          .col_cont {
                            margin: 0 auto;
                          }
                          img.fullwidth,
                          img.fullwidthOnMobile {
                            max-width: 100% !important;
                          }
                          .no-stack .col {
                            min-width: 0 !important;
                            display: table-cell !important;
                          }
                          .no-stack.two-up .col {
                            width: 50% !important;
                          }
                          .no-stack .col.num2 {
                            width: 16.6% !important;
                          }
                          .no-stack .col.num3 {
                            width: 25% !important;
                          }
                          .no-stack .col.num4 {
                            width: 33% !important;
                          }
                          .no-stack .col.num5 {
                            width: 41.6% !important;
                          }
                          .no-stack .col.num6 {
                            width: 50% !important;
                          }
                          .no-stack .col.num7 {
                            width: 58.3% !important;
                          }
                          .no-stack .col.num8 {
                            width: 66.6% !important;
                          }
                          .no-stack .col.num9 {
                            width: 75% !important;
                          }
                          .no-stack .col.num10 {
                            width: 83.3% !important;
                          }
                          .video-block {
                            max-width: none !important;
                          }
                          .mobile_hide {
                            min-height: 0px;
                            max-height: 0px;
                            max-width: 0px;
                            display: none;
                            overflow: hidden;
                            font-size: 0px;
                          }
                          .desktop_hide {
                            display: block !important;
                            max-height: none !important;
                          }
                        }
                      </style>
                    </head>
                    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
                      <!--[if IE]><div class="ie-browser"><![endif]-->
                      <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                        style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
                        valign="top" width="100%">
                        <tbody>
                          <tr style="vertical-align: top;" valign="top">
                            <td style="word-break: break-word; vertical-align: top;" valign="top">
                              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                              <div style="background-color:transparent;">
                                <div class="block-grid"
                                  style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                  <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                      style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                      <div class="col_cont" style="width:100% !important;">
                                        <!--[if (!mso)&(!IE)]><!-->
                                        <div
                                          style="border: 2px solid #eee; padding: 30px">
                                            <a href="https://harmonhomes.com/home" style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                            <hr />
                                          <!--<![endif]-->
                                          <table cellpadding="0" cellspacing="0" role="presentation"
                                            style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                            valign="top" width="100%">
                                            <tr style="vertical-align: top;" valign="top">
                                              <td align="center"
                                                style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                valign="top" width="100%">
                                                <h1
                                                  style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:31px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                  Congratulations ${agentFirstName} ${agentLastName}<br /> <br /></h1>
                                              </td>
                                            </tr>
                                          </table>
                                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                          <div
                                            style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;letter-spacing:1px;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                            <div class="txtTinyMce-wrapper"
                                              style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; letter-spacing: 1px; mso-line-height-alt: 14px;">
                                              <div align="center" class="img-container center autowidth"
                                              style="padding-right: 0px;padding-left: 0px;">
                                              <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                              ${JSON.parse(media)[0] ? `<img align="center" border="0" class="center autowidth" src="${JSON.parse(media)[0].MediaURL}" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                              width="500" />`: ''}
                                              <!--[if mso]></td></tr></table><![endif]-->
                                            </div>
                                              <p
                                                style="margin-top: 2px; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;font-weight: bold;">$ ${data.ListPrice}</span>
                                              </p>
                                               <p
                                                style="margin: 0; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;">${unparsedAddress} | ${city} | ${state} | ${postalCode} | ${data.BedroomsTotal} BRs | ${data.BathroomsFull} BAs</span>
                                              </p>
                                            </div>
                                          </div>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                          <div align="center" class="button-container"
                                            style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                             <p
                                                style="margin-top: 2px; font-size: 15px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 18px; letter-spacing: 1px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;font-weight: bold;">Presented By: ${listbrokeragename}</span>
                                              </p>
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:219.75pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                            <div
                                              style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                <a href="https://harmonhomes.com/homedetails/${unparsedAddress}/${data.ListingKey}"
                                              style="text-decoration: none; color: white; padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><span
                                                style="font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click Here To View
                                                This Property</span></a>
                                            </div>
                                            <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                          </div>
                                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                          <div
                                            style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                            <div class="txtTinyMce-wrapper"
                                              style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                              <p
                                                style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;">Your Listing is Now on
                                                </span>
                                              </p>
                                              <p
                                                style="margin: 0; font-size: 15px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 18px; margin-top: 0; margin-bottom: 0;">
                                                <span style="font-size: 15px;">HarmonHomes.com</span>
                                              </p>
                                            </div>
                                          </div>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                          <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                          <hr />
                                          <div
                                            style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                            <div class="txtTinyMce-wrapper"
                                              style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                              <p
                                                style="margin: 0; text-align: center; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                 Ⓒ 2020 Harmon Homes. All Rights
                                                Reserved | 800-344-3834 | info@harmonhomes.com</p>
                                            </div>
                                          </div>
                                          <!--[if mso]></td></tr></table><![endif]-->
                                          <div align="center" class="img-container center autowidth"
                                            style="padding-right: 0px;padding-left: 0px;">
                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                              align="center" border="0" class="center autowidth"
                                              src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                              style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                              width="500" />
                                            <!--[if mso]></td></tr></table><![endif]-->
                                          </div>
                                          <!--[if (!mso)&(!IE)]><!-->
                                        </div>
                                        <!--<![endif]-->
                                      </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                  </div>
                                </div>
                              </div>
                              <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <!--[if (IE)]></div><![endif]-->
                    </body>
                    </html>
                            `,
                            },
                            Text: {
                              Charset: "UTF-8",
                              Data: "TEXT_FORMAT_BODY",
                            },
                          },
                          Subject: {
                            Charset: "UTF-8",
                            Data: "Your new listing on Harmon Homes",
                          },
                        },
                        Source: "info@harmonhomes.com" /* required */,
                        ReplyToAddresses: [
                          "info@harmonhomes.com",
                          /* more items */
                        ],
                      };
                      // Create the promise and SES service object
                      // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                      //   .sendEmail(params)
                      //   .promise();
                      // // Handle promise's fulfilled/rejected states
                      // sendPromise
                      //   .then(function (data) {
                      //     console.log(data.MessageId);
                      //   })
                      //   .catch(function (err) {
                      //     console.error(err, err.stack);
                      //   });

                      client.query(`Select listagentemail, listagentfullname from listings where listbrokeragepostalcode = '${brokeragePostalCode}';`,
                        (err, result) => {
                          if (err) {
                            return res.status(400).json({
                              error: "not able to query",
                            });
                          } else {
                            console.log(result.rows[0])
                            for (var i = 0; i < result.rowCount; i++) {
                              var agentEmail = result.rows[i].listagentemail;
                              var listagentfullname = result.rows[i].listagentfullname;
                              var params = {
                                Destination: {
                                  ToAddresses: [
                                    agentEmail,
                                  ],
                                },
                                Message: {
                                  Body: {
                                    Html: {
                                      Charset: "UTF-8",
                                      Data: `<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
    xmlns:v="urn:schemas-microsoft-com:vml">

    <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <meta content="width=device-width" name="viewport" />
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible" />
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Merriweather" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css" />
        <!--<![endif]-->
        <style type="text/css">
            body {
                margin: 0;
                padding: 0;
            }

            table,
            td,
            tr {
                vertical-align: top;
                border-collapse: collapse;
            }

            * {
                line-height: inherit;
            }

            a[x-apple-data-detectors=true] {
                color: inherit !important;
                text-decoration: none !important;
            }

        </style>
        <style id="media-query" type="text/css">
            @media (max-width: 520px) {

                .block-grid,
                .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                }

                .block-grid {
                    width: 100% !important;
                }

                .col {
                    width: 100% !important;
                }

                .col_cont {
                    margin: 0 auto;
                }

                img.fullwidth,
                img.fullwidthOnMobile {
                    max-width: 100% !important;
                }

                .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                }

                .no-stack.two-up .col {
                    width: 50% !important;
                }

                .no-stack .col.num2 {
                    width: 16.6% !important;
                }

                .no-stack .col.num3 {
                    width: 25% !important;
                }

                .no-stack .col.num4 {
                    width: 33% !important;
                }

                .no-stack .col.num5 {
                    width: 41.6% !important;
                }

                .no-stack .col.num6 {
                    width: 50% !important;
                }

                .no-stack .col.num7 {
                    width: 58.3% !important;
                }

                .no-stack .col.num8 {
                    width: 66.6% !important;
                }

                .no-stack .col.num9 {
                    width: 75% !important;
                }

                .no-stack .col.num10 {
                    width: 83.3% !important;
                }

                .video-block {
                    max-width: none !important;
                }

                .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                }

                .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                }
            }

        </style>
    </head>

    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
            style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;"
            valign="top" width="100%">
            <tbody>
                <tr style="vertical-align: top;" valign="top">
                    <td style="word-break: break-word; vertical-align: top;" valign="top">
                        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                        <div style="background-color:transparent;">
                            <div class="block-grid"
                                style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                                <div
                                    style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                    <div class="col num12"
                                        style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
                                        <div class="col_cont" style="width:100% !important;">
                                            <!--[if (!mso)&(!IE)]><!-->
                                            <div style="border: 2px solid #eee; padding: 30px">
                                                <a href="https://harmonhomes.com/home"
                                                    style="font-size: 30px; text-decoration: none; color: #1ad1ff; font-weight: bold">HarmonHomes.com</a>
                                                <hr />
                                                <!--<![endif]-->
                                                <table cellpadding="0" cellspacing="0" role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                    valign="top" width="100%">
                                                    <tr style="vertical-align: top;" valign="top">
                                                        <td align="center"
                                                            style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;"
                                                            valign="top" width="100%">
                                                            <h1
                                                                style="color:#555555;direction:ltr;font-family:Arial, 'Helvetica Neue', Helvetica, sans-serif;font-size:37px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;">
                                                                ${listagentfullname ? listagentfullname : ""}</h1>
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;"><strong>Don't miss another
                                                                    Lead!</strong></span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span style="font-size: 22px;">A lead came from ${brokeragePostalCode}</span>
                                                        </p>
                                                        <p
                                                            style="margin: 0; font-size: 22px; text-align: center; line-height: 1.2; word-break: break-word; mso-line-height-alt: 26px; margin-top: 0; margin-bottom: 0;">
                                                            <span
                                                                style="font-size: 22px;"><strong>HarmonHomes.com</strong></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper" align="center"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <span
                                                            style="font-size: 17px; mso-ansi-font-size: 18px;">Subscribe
                                                            to HarmonHomes.com to not only receive leads on your
                                                            listings, but also the zip codes you list in!</span>

                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
                                                <div
                                                    style="color:#393d47;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <div class="txtTinyMce-wrapper"
                                                        style="font-size: 12px; line-height: 1.2; color: #393d47; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
                                                        <p
                                                            style="margin: 0; font-size: 12px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 14px; margin-top: 0; margin-bottom: 0;">
                                                        </p>
                                                    </div>
                                                </div>
                                                <!--[if mso]></td></tr></table><![endif]-->
                                                <div class="img-container center autowidth row"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Locator.png"
                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 45%; max-width: 500px; display: block;" />
                                                    </div>
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]-->
                                                    <div class="col">
                                                        <img class="center autowidth"
                                                            src="https://harmonhomes.s3.us-east-2.amazonaws.com/Agent.png"
                                                            style="height: 50%; width: 35%; z-index: 2; max-width: 500px; display: block; margin-top: -50% !important; margin-left: 50%;" />
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                    role="presentation"
                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                    valign="top" width="100%">
                                                    <tbody>
                                                        <tr style="vertical-align: top;" valign="top">
                                                            <td class="divider_inner"
                                                                style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                valign="top">
                                                                <table align="center" border="0" cellpadding="0"
                                                                    cellspacing="0" class="divider_content"
                                                                    role="presentation"
                                                                    style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px solid #BBBBBB; width: 100%;"
                                                                    valign="top" width="100%">
                                                                    <tbody>
                                                                        <tr style="vertical-align: top;" valign="top">
                                                                            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                valign="top"><span></span></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <div align="center" class="button-container"
                                                    style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:27pt;width:221.25pt;v-text-anchor:middle;" arcsize="12%" strokeweight="0.75pt" strokecolor="#8a3b8f" fillcolor="#02649d"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:12px"><![endif]-->
                                                    <div
                                                        style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#02649d;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #8a3b8f;border-right:1px solid #8a3b8f;border-bottom:1px solid #8a3b8f;border-left:1px solid #8a3b8f;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;">
                                                        <span
                                                            style="padding-left:20px;padding-right:20px;font-size:12px;display:inline-block;letter-spacing:undefined;"><a
                                                                href="https://harmonhomes.com/agent-reg?name=${listagentfullname}&email=${agentEmail}"
                                                                style="text-decoration: none; color: white; font-size: 12px; line-height: 2; word-break: break-word; mso-line-height-alt: 24px;">Click
                                                                Here To Start Claiming Your Zip Leads</a></span>
                                                    </div>
                                                    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                </div>
                                                <div align="center" class="img-container center autowidth"
                                                    style="padding-right: 0px;padding-left: 0px;">
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img
                                                        align="center" border="0" class="center autowidth"
                                                        src="https://harmonhomes.s3.us-east-2.amazonaws.com/logo.png"
                                                        style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 500px; display: block;"
                                                        width="500" />
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                </div>
                                                <!--[if (!mso)&(!IE)]><!-->
                                            </div>
                                            <!--<![endif]-->
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                </div>
                            </div>
                        </div>
                        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
    </body>

</html>`,
                                    },
                                    Text: {
                                      Charset: "UTF-8",
                                      Data: "TEXT_FORMAT_BODY",
                                    },
                                  },
                                  Subject: {
                                    Charset: "UTF-8",
                                    Data: "Your new listing on Harmon Homes",
                                  },
                                },
                                Source: "info@harmonhomes.com" /* required */,
                                ReplyToAddresses: [
                                  "info@harmonhomes.com",
                                  /* more items */
                                ],
                              };
                              // Create the promise and SES service object
                              // var sendPromise = new AWS.SES({ apiVersion: "2010-12-01" })
                              //   .sendEmail(params)
                              //   .promise();
                              // // Handle promise's fulfilled/rejected states
                              // sendPromise
                              //   .then(function (data) {
                              //     console.log(data.MessageId);
                              //   })
                              //   .catch(function (err) {
                              //     console.error(err, err.stack);
                              //   });
                            }
                          }
                        })
                    }
                  }
                }
              );
            }
          }
        );
      }
    });
  }
}
getListings();
