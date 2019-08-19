const express = require("express");
const router = express.Router();
const qs = require("querystring");
const http = require("https");
require('dotenv').config();


//! SUMMARIZATION
router.post("/process", (req, res, next)=> {   
  
  let text_url = req.body.text_url
  let nr_sentences = req.body.nr_sentences 

  var options = {
    "method": "POST",
    "hostname": "api.meaningcloud.com",
    "port": null,
    "path": "/summarization-1.0",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    }
  };

  var req = http.request(options, function (res2) {
    var chunks = [];

    res2.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res2.on("end", function () {
      var body = JSON.parse(Buffer.concat(chunks).toString());
      console.log(body);
      res.status(200).json(body)
    })
  });

  req.write(qs.stringify({
    key: process.env.MEANINGCLOUD_KEY,
    txt: "",
    url: text_url,
    doc: 'YOUR_DOC_VALUE',
    sentences: nr_sentences
  }));
  req.end();
})

// //! CATEGORIZATION
// router.post("/process", (req, res, next)=> {   

//   let text_url = req.body.text_url

//   var options = {
//   "method": "POST",
//   "hostname": "api.meaningcloud.com",
//   "port": null,
//   "path": "/class-1.1",
//   "headers": {
//     "content-type": "application/x-www-form-urlencoded"
//     }
//   };

//   var req = http.request(options, function (res2) {
//     var chunks = [];

//     res2.on("data", function (chunk) {
//       chunks.push(chunk);
//     });

//     res2.on("end", function () {
//       var body = JSON.parse(Buffer.concat(chunks).toString());
//       console.log(body);
//       res.status(200).json(body)
//     })
//   });

//   req.write(qs.stringify({
//     key: process.env.MEANINGCLOUD_KEY,
//     txt: "",
//     url: text_url,
//     doc: 'YOUR_DOC_VALUE',
//     model: IPTC_en
//   }));
//   req.end();
// })


// //! LANGUAGE IDENTIFICATION
// router.post("/process", (req, res, next)=> {   

//   let text_url = req.body.text_url

//   var options = {
//     "method": "POST",
//     "hostname": "api.meaningcloud.com",
//     "port": null,
//     "path": "/lang-2.0",
//     "headers": {
//       "content-type": "application/x-www-form-urlencoded"
//     }
//   };

//   var req = http.request(options, function (res2) {
//     var chunks = [];

//     res2.on("data", function (chunk) {
//       chunks.push(chunk);
//     });

//     res2.on("end", function () {
//       var body = JSON.parse(Buffer.concat(chunks).toString());
//       console.log(body);
//       res.status(200).json(body)
//     })
//   });

//   req.write(qs.stringify({
//     key: process.env.MEANINGCLOUD_KEY,
//     txt: "",
//     url: text_url,
//     doc: 'YOUR_DOC_VALUE',
//   }));
//   req.end();
// })
// !EXPORT ROUTER
module.exports = router;
