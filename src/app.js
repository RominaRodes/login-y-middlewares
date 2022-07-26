// ************ Require's ************
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const express = require('express');
const logger = require('morgan');
const path = require('path');
const session = require('express-session')
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware')
// ************ express() - (don't touch) ************
const app = express();

// ************ Middlewares - (don't touch) ************
app.use(express.static(path.join(__dirname, '../public')));  // Necesario para los archivos estáticos en el folder /public
app.use(express.urlencoded({ extended: false }));            //para que se pueda realizar el metodo post etc
app.use(logger('dev'));
app.use(express.json());   //para que express pueda leer archivos jason
app.use(cookieParser());
app.use(session({
  secret: 'Secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(userLoggedMiddleware);

// ************ Template Engine - (don't touch) ************
app.set('view engine', 'ejs');      //view engine para vistas dinamicas con ejs
app.set('views', path.join(__dirname, '/views')); // Seteo de la ubicación de la carpeta "views"



// ************ WRITE YOUR CODE FROM HERE ************
// ************ Route System require and use() ************
const mainRouter = require('./routes/main');    // requiero las rutas de main
const userRouter = require('./routes/user')
app.use('/', mainRouter);  
app.use('/', userRouter) ;                   



// ************ DON'T TOUCH FROM HERE ************
// ************ catch 404 and forward to error handler ************
app.use((req, res, next) => next(createError(404)));

// ************ error handler ************
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.path = req.path;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// ************ exports app - dont'touch ************
module.exports = app;
