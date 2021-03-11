
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const NewsAPI = require('newsapi')

const newsapi = new NewsAPI("50c78aaa91db43b6a93ac4fbf11e33fc")

//Chargement du model
// require('../models/News')
// const News = mongoose.model('news')

// ideas/add route du formulaire
router.get('/topheadlines', (req, res) => {
    //GET NEWS FROM AN API
    newsapi.v2.everything({
        //sources: 'bbc-news,the-verge',
        q: 'jeux video',
        //category: 'entertainment',
        language: 'fr',
        //country: 'us'
      }).then(response => {
        console.log(response)
        // res.render('partials/', {
        //     errors: errors,
        //     title: req.body.title,
        //     details: req.body.details 
        // })
        res.send(response)
    })
})

module.exports = router