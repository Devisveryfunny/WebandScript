// Import the express module to create the router
var express = require('express'); 

// Create a new router instance
var router = express.Router(); 

// Define a GET route for the root path ('/')
router.get('/', function(req, res, next) {
  // Send a response when the root route is accessed
  res.send('respond with a resource');
});

// Export the router so it can be used in other parts of the application
module.exports = router;
