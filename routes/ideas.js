const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { ensureAuthenticated } = require('../helpers/auth')

//Chargement du model
require('../models/Ideas')
require('../models/Users')
const Idea = mongoose.model('ideas')
const User = mongoose.model('users')

// ideas/add route du formulaire
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add')
})

//traitement du formulaire
router.post('/', ensureAuthenticated, (req, res) => {
   // console.log(req.body);
   // res.send('ok');

   let errors = []

   if(!req.body.title) {
       errors.push({text: 's\'il vous plait ajoutez un titre' })
   }
   if(!req.body.details) {
       errors.push({ text: 'S\'il vous plais ajoutez du contenu'})
   }

   if(errors.length > 0) {
       res.render('ideas/add', {
          errors: errors,
          title: req.body.title,
          details: req.body.details 
       })

    
       console.log(errors)
   } else { 
      // res.send('passed');
      const newIdea = {
          title: req.body.title,
          details: req.body.details,
          user: req.user.id
      }
      new Idea(newIdea)
      .save()
      .then(idea => {
          //message flash pour l'ajout
          req.flash('success_msg', 'Article du jeu ajouté')
          res.redirect('/ideas')
        })
   }
})

router.get('/', ensureAuthenticated, (req, res) => {
    User.findOne({_id: req.user.id})
    .then(user => {
        console.log(user)
        if(user.type == "admin") {
            Idea.find({visibility: "private"})
            .sort({date: 'desc'})
            .then(ideas => {
                console.log(ideas)
                for(let i = 0; i < ideas.length; i++) {
                    ideas[i].publicButton = true
                }
                res.render("ideas/index", {
                    ideas: ideas,
                })
            })
        } else {
            Idea.find({ user: req.user.id})
            .sort({date: 'desc'})
            .then(ideas => {
                for(let i = 0; i < ideas.length; i++) {
                    ideas[i].publicButton = false
                }
                res.render('ideas/index', {
                    ideas: ideas,
                })
            })
        }
    })        
})

router.get('/public', (req, res) => {
    Idea.find({visibility: "public"})
    .sort({date: 'desc'})
    .then(ideas => {
        console.log(ideas)
        res.render("ideas/public", {
            ideas: ideas,
            message: "Les articles publiques",
        })
    })     
})

//Editer Idea formulaire
router.get('/make_public/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id && req.user.type != "admin") {
           req.flash('error_msg', 'Non Authorisé')
           res.redirect('/ideas')
        } else {
            idea.visibility = "public"
            idea.save()
            res.redirect('/ideas')
        }
        
    })
});
//Editer Idea formulaire
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id && req.user.type != "admin"){
           req.flash('error_msg', 'Non Authorisé')
           res.redirect('/ideas')
        } else {
            res.render('ideas/edit', {
                idea: idea
            })
        }
        
    })
});

//traitement du formulaire d'edit
// router.put('/:id', ensureAuthenticated, (req, res) => {
//     Idea.findOne({
//         _id: req.params.id
//     })
//     .then(idea => {
//         // new values
//         idea.title = req.body.title;
//         idea.details = req.body.details;

//         idea.save()
//             .then(idea => {
//                 req.flash('success_msg', 'Article mit à jour');
//                 res.redirect('/ideas');
//             })
//     })
// });

//Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({ _id: req.params.id})
         .then(() => {
             //pour le message d'info 
             req.flash('success_msg', 'Article supprimé')
             res.redirect('/ideas')
         })
})

module.exports = router