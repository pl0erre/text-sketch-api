const express = require("express");
const router = express.Router();
const Text = require("../models/Text");
const User = require("../models/User");
var createError = require('http-errors')
const axios = require('axios');
const mongoose = require("mongoose");
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
    next(createError(500));
  })
})

router.post("/save", (req, res, next)=> {

  let newText_temp = JSON.parse(req.body.text)
  let newText = new Text ({
    text_name:      newText_temp.text_name,
    text_processed: newText_temp.text_processed,
    labels:         newText_temp.labels,
    languages:      newText_temp.languages,
    creator:        mongoose.Types.ObjectId(req.session.user.id)
  })

  Text.find({text_name: {$eq: newText.text_name}})
    .then((found) => {
      if(found.length !== 0) {
        next(createError(409));
      } else {
        newText.save()
        .then(() => {
          res.sendStatus(200)
        })
        .catch((err) => {
          next(createError(500))
        })
      }   
    })   
})

router.post("/collection", (req, res, next)=> {
  Text.find({creator: req.session.user.id}) //! filter for current user missing
  .then((collection_data_temp) => {
    let collection_data = JSON.stringify(collection_data_temp);
    res.status(200).send(collection_data);
  })
  .catch((err) => {
    next(createError(500))
  })
})

router.post("/delete/:id", (req, res, next)=> {
  Text.deleteOne({_id: req.params.id })
  .then(() => {
    res.sendStatus(200)
  })
  .catch((err) => {
    next(createError(500))
  })
})
// EXPORT ROUTER
module.exports = router;
