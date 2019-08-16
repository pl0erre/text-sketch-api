const express = require("express");
const router = express.Router();
const qs = require("querystring");
const http = require("https");
require('dotenv').config();



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

module.exports = router;






"https://api.meaningcloud.com/class-1.1?key=<<YOUR OWN KEY>>&of=json&txt=The%2085th%20Academy%20Awards%20ceremony%20took%20place%20February%2024,%202013.&model=IPTC_en"