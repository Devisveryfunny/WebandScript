// Import required modules
let createError = require('http-errors'); // For handling HTTP errors
let express = require('express'); // Express web framework
let path = require('path'); // For working with file and directory paths
let cookieParser = require('cookie-parser'); // For parsing cookies
let logger = require('morgan'); // HTTP request logger

// Create an Express application instance
let app = express();

// Import route modules
let indexRouter = require('../routes/index'); // Import the index route
let usersRouter = require('../routes/users'); // Import the users route
let assignmentRouter = require('../routes/assignment'); // Import the assignment route

// Set up view engine and views directory
app.set('views', path.join(__dirname, '../views')); // Set the views folder path
app.set('view engine', 'ejs'); // Set the view engine to EJS (Embedded JavaScript)

const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
let DB = require('./db'); // Import database configuration
mongoose.connect(DB.URI); // Connect to the MongoDB database using the URI from the DB config

let mongoDB = mongoose.connection; // Get the MongoDB connection object
mongoDB.on('error', console.error.bind(console, 'Connection Error')); // Handle connection errors
mongoDB.once('open', () => {
  console.log("Connected with the MongoDB"); // Log success when connected to MongoDB
});

// Optional options for Mongoose connection
mongoose.connect(DB.URI, { useNewURLParser: true, useUnifiedTopology: true }); // Connect to MongoDB with options

// Middleware setup
app.use(logger('dev')); // Log HTTP requests using 'dev' format
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data from forms
app.use(cookieParser()); // Parse cookies in requests
app.use(express.static(path.join(__dirname, '../../public'))); // Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../../node_modules'))); // Serve static files from node_modules

// Routing
app.use('/', indexRouter); // Use indexRouter for requests to the root path '/'
app.use('/users', usersRouter); // Use usersRouter for requests to '/users' path
app.use('/assignmentslist', assignmentRouter); // Use assignmentRouter for requests to '/assignmentslist' path

// Error handling for 404 (Page not found)
app.use(function(req, res, next) {
  next(createError(404)); // Create a 404 error and pass it to the next middleware
});

// Error handling middleware
app.use(function(err, req, res, next) {
  // Set error message and error object to be used in the view
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; // Show stack trace in development mode

  // Set the HTTP status code and render the error page
  res.status(err.status || 500); // If no specific status, default to 500 (Internal Server Error)
  res.render('error', { title: 'Error' }); // Render the error page using EJS template
});

// Export the app module so it can be used by the server
module.exports = app;