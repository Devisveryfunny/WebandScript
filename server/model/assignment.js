// Import the mongoose library for MongoDB object modeling
const mongoose = require("mongoose");

// Define the schema for the Assignment3 collection
let Assignment3 = mongoose.Schema({
    // Define the fields for the Assignment3 schema
    Name: String,     // The name of the assignment
    Subject: String,  // The subject of the assignment
    Topic: String,    // The specific topic for the assignment
    Class: String,    // The class for which the assignment is given
    Due: String       // The due date of the assignment
},
{
    collection:"Assignment3"  // Specify the name of the MongoDB collection to store data
});

// Create and export a model for the Assignment3 collection using the defined schema
module.exports = mongoose.model('Assignment3', Assignment3);
