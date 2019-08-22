const express         = require('express');
const app             = express();
const cookieParser    = require('cookie-parser');
const mongoose        = require('mongoose');
const path            = require('path');
const session         = require('express-session')
const MongoStore      = require('connect-mongo')(session);
// const logger          = require('morgan');
const cors            = require("cors");

require('dotenv').config();
mongoose.Promise = global.Promise;
const db = mongoose.connection

// User Sessions
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ 
    mongooseConnection: db,
    ttl: (1 * 24 * 60 * 60), //! 12 hours
    autoremove: 'native'
  }),
  resave: true,
  saveUninitialized: true
}))

// Connecting to database
mongoose.connect(process.env.MONGO_PASS, {useNewUrlParser: true})
.then(x => {
  console.log(`Connected to Mongo Database`)
})
.catch(err => {
  console.error('Error connecting to mongo', err)
});

// Setup
// app.use(logger('dev'));
app.use(cookieParser());

// app.use("/", express.static('doc'))
app.use(express.json());
app.use(express.urlencoded({limit: '50mb', extended: true}));

function protect(req,res,next){
  if(!req.session.user) {
      next(createError(403));
  } else {
      next();
  }
}

app.use(function (err, req, res, next) {
  if(err)res.status(err.status).json({message: err.message})
  else res.status(500).json({message: "Error, something went wrong."})
})

// default value for title local
app.locals.title = 'Text-Sketch';
app.locals.host = process.env.HOST;
app.locals.port = process.env.PORT;

// Routes
app.use('/text', require('./api/routes/text'));
app.use('/auth', require('./api/routes/auth'));
app.use('/user', protect, require('./api/routes/user'));

app.use(function(req,res, next){
  res.sendStatus(418);
})

app.listen(process.env.PORT, function () {
  console.log('App listening on port 3001!');
});
module.exports = app;

