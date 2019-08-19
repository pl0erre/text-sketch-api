const express = require("express");
const router = express.Router();
const axios = require('axios');
require('dotenv').config();


router.post("/process", (req, res, next)=> {   

  let text_url = req.body.text_url
  let nr_sentences = req.body.nr_sentences

  function getSummary() {
    return axios.get(`${process.env.SUMMARIZE_API}${process.env.MEANINGCLOUD_KEY}&url=${text_url}&sentences=${nr_sentences}`)
  }

  function getClassification() {
    return axios.get(`${process.env.CLASSIFICATION_API}${process.env.MEANINGCLOUD_KEY}&url=${text_url}&model=IPTC_en`)
  }

  function getLanguage() {
    return axios.get(`${process.env.LANGUAGE_API}${process.env.MEANINGCLOUD_KEY}&url=${text_url}`)
  }

  axios.all([getSummary(), getClassification(), getLanguage()])
  .then(axios.spread(function(summary, classification, language) {
    let data = {
      summary: summary.data.summary, 
      classification: classification.data.category_list, 
      language: language.data.language_list
    };
    res.status(200).json(data)
  }))
  .catch((err)=>{
    console.log(err);
  })
})

// EXPORT ROUTER
module.exports = router;
