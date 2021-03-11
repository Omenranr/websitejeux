
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

//Chargement du model
require('../models/Ideas');
const Idea = mongoose.model('ideas')



// ideas/add route du formulaire
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//traitement du formulaire
router.post('/', ensureAuthenticated, (req, res)=> {
   // console.log(req.body);
   // res.send('ok');

   let errors = [];

   if(!req.body.title){
       errors.push({text: 's\'il vous plait ajoutez un titre' })
   }
   if(!req.body.details){
       errors.push({ text: 'S\'il vous plais ajoutez du contenu'})
   }

   if(errors.length > 0){
       res.render('ideas/add', {
          errors: errors,
          title: req.body.title,
          details: req.body.details 
       });

    
       console.log(errors);
   } else { 
      // res.send('passed');
      const newUser = {
          title: req.body.title,
          details: req.body.details,
          user: req.user.id
      }
     // console.log(newUser.user);
      new Idea(newUser)
              .save()
              .then(idea => {
                  //message flash pour l'ajout
                  req.flash('success_msg', 'Article du jeu ajouté')
                  res.redirect('/ideas')
              })
   }
});

router.get('/', ensureAuthenticated, (req, res)=> {
    Idea.find({ user: req.user.id })
          .sort({date: 'desc'})
          .then(ideas => {
              res.render('ideas/index', {
                  ideas: ideas
              });
          })        
});

//Editer Idea formulaire
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id){
           req.flash('error_msg', 'Non Authorisé');
           res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            })
        }
        
    })
});

//traitement du formulaire d'edit
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Article mit à jour');
                res.redirect('/ideas');
            })
    })
});

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res)=> {
    Idea.remove({ _id: req.params.id})
         .then(()=>{
             //pour le message d'info 
             req.flash('success_msg', 'Article supprimé');
             res.redirect('/ideas');
         })
});

module.exports = router ;