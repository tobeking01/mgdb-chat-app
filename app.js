const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const initRoutes = require("./routes/routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use((request, response, next) => {
  if (request.path.includes('login')) {
    return next();
  }
  const token = request.cookies.token;
  if (!token) {
    return response.redirect('/login/login.html');
  }
  try {
    const SECRET_KEY = process.env.SECRET_KEY;
    const decoded = jwt.verify(token, SECRET_KEY);
    request.user = decoded;
    next();
  } catch (err) {
    console.log('Cannot decode jwt token');
    response.redirect('/login.html');
  }
});


// Serve static files (frontend)
app.use(express.static("public"));

//Init routes
const router = initRoutes();
app.use('/', router);

module.exports = app;