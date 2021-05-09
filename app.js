const express = require('express');
// const exphbs  = require('express-handlebars');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const mysql= require('mysql');
// Chargement de mes routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');
const news = require('./routes/NewsController')

//NEWS API
const NewsAPI = require('newsapi')
const newsapi = new NewsAPI("50c78aaa91db43b6a93ac4fbf11e33fc")


//Ramener passport Config avec passport comme paramètre
require('./config/passport')(passport);


const app = express();
const port = 5000;

//Connexion à la base de données
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/NextForVideoApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('MongoDB Connected...'))
.catch(err => console.log(err));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())



//handlebars middleware
// app.engine('handlebars', exphbs());
// app.set('view engine', 'handlebars');
app.engine('handlebars', expressHandlebars({
    layoutsDir: __dirname + '/views/layouts',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');

//override methode middleware
app.use(methodOverride('_method'));

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
   
  // flash middleware
  app.use(flash())

  //variables globales
  app.use(function(req, res, next){
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      res.locals.user = req.user || null;
      next();
  });

  //express static middleware
  app.use(express.static(path.join(__dirname, 'public')));

//Index
app.get('/', (req, res) => {
    newsapi.v2.everything({
        //sources: 'bbc-news,the-verge',
        q: 'jeux video',
        //category: 'entertainment',
        language: 'fr',
        //country: 'us'
      }).then(response => {
        console.log(response.articles[0].title)
        let articles = response.articles
        for (let i = 0; i < 4; ++i) {
            if (i == 0) {
                articles[i].first = true
            } else {
                articles[i].first = false
            }
        }
        res.render('acceuil', {topNews: articles.slice(0, 4), minorNews: articles.slice(4, 8)})
    })
})

// app.get('/carrousel_principal', (req, res, next)=> {
//      console.log(req.query.nom_console)
//     res.render('carrousel_principal', {layout:false});
// });

//carrousel Principale route
app.get('/carrousel_principal', (req, res, next) => {
    
    let console = req.query.console
    res.render('carrousel_principal', {layout:false, console: console.toUpperCase()})
})

//carrousel Secondaire route
app.get('/carrousel_secondaire', (req, res) => {
    let images
    let type = req.query.type
    let console = req.query.console
    switch(type) {
        case "adventure":
            images =  ["atari1", "atari2", "atari3", "atari4", "atari5"]
            break
        case "combat":
            images = ["11", "12", "13", "14", "15"]
            break
        case "sport":
            images = ["sport1", "sport2", "sport3", "sport4", "sport5"]
            break
        case "reflexion":
            images = ["reflexion1", "reflexion2", "reflexion3", "reflexion4", "reflexion5"]
            break
        default:
            images = ["reflexion1", "reflexion2", "reflexion3", "reflexion4", "reflexion5"]
    }
    
    res.render('carrousel_secondaire', {layout: false, tableauSecondaire: images, console})   
});

//Histoire des jeux vidéos route
app.get('/histoireDesJeuxVideo', (req, res) => {
    res.render('histoireDesJeuxVideo');
});

//Explosion du retro gaming route
app.get('/explosionDuRetroGaming', (req, res)=> {
    res.render('explosionDuRetroGaming')
});

//Utilisation des routes
app.use('/ideas', ideas)
app.use('/users', users)
app.use('/news', news)

app.listen(port, () => {
    console.log(`Serveur sur le port ${port}`);
});