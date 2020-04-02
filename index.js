"use strict";
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

exports.handler = async function(event, context, callback) {
  console.log(event);

  var ddb = new AWS.DynamoDB.DocumentClient();
  const data = {};

  let mesAno = event.param;
  if (!mesAno) {
    if (event.isBase64Encoded) {
      var b = decoder(event.body);
      var s = JSON.parse(b);
      mesAno = s.param;
    } else {
      const body = event.body;
      mesAno = body.param;
    }
  }

  //Bas64 decoder
  function decoder(s) {
    var e = {},
      i,
      b = 0,
      c,
      x,
      l = 0,
      a,
      r = "",
      w = String.fromCharCode,
      L = s.length;
    var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0; i < 64; i++) {
      e[A.charAt(i)] = i;
    }
    for (x = 0; x < L; x++) {
      c = e[s.charAt(x)];
      b = (b << 6) + c;
      l += 6;
      while (l >= 8) {
        ((a = (b >>> (l -= 8)) & 0xff) || x < L - 2) && (r += w(a));
      }
    }
    return r;
  }

  var params = {
    TableName: "Twitter",
    FilterExpression: "mesAno = :a",
    ExpressionAttributeValues: {
      ":a": mesAno
    }
  };

  let twitter = await ddb.scan(params).promise();
  if (twitter) {
    data.twitter = twitter.Items;
  }

  var params2 = {
    TableName: "AcordaCidade",
    FilterExpression: "mesAno = :a",
    ExpressionAttributeValues: {
      ":a": mesAno
    }
  };

  let ac = await ddb.scan(params2).promise();
  if (ac) {
    data.acordacidade = ac.Items;
  }

  return data;
};
