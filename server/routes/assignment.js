// Import necessary modules
var express = require('express');
var router = express.Router();  // Create a new Express router instance
let mongoose = require('mongoose');
let Assignment = require('../model/assignment.js');  // Import the Assignment model for database operations

// Route to display all assignments
router.get('/', async (req, res, next) => {
    try {
        // Fetch all assignments from the database
        const AssignmentList = await Assignment.find();
        // Render the 'list' view and pass the fetched assignments to the view
        res.render('Assignment/list', {
            title: 'Assignments',
            AssignmentList: AssignmentList,
        });
    } catch (err) {
        // Handle any errors during fetching assignments
        console.error(err);
        res.render('Assignment/list', {
            error: 'Error fetching assignments from the server',  // Display an error message if something goes wrong
        });
    }
});

// Route to render the 'add assignment' form
router.get('/add', async (req, res, next) => {
    try {
        // Render the 'add' view for creating a new assignment
        res.render('Assignment/add', {
            title: 'Add Assignment'
        });
    } catch (err) {
        // Handle errors when rendering the add form
        console.error(err);
        res.render('Assignment/list', {
            error: 'Error on the server'  // Display an error message if the server fails
        });
    }
});

// Route to handle POST request for adding a new assignment
router.post('/add', async (req, res) => {
    try {
        // Create a new assignment object with data from the request body
        let newAssignment = Assignment({
            "Name": req.body.Name,
            "Subject": req.body.Subject,
            "Topic": req.body.Topic,
            "Class": req.body.Class,
            "Due": req.body.Due,
        });

        // Save the new assignment to the database
        Assignment.create(newAssignment);
        // Redirect to the assignments list page after creating the new assignment
        res.redirect('/assignmentslist');
    } catch (err) {
        // Handle any errors during assignment creation
        console.error(err);
        res.render('Assignment/add', {
            title: 'Add Assignment',
            error: 'Error creating assignment',  // Display an error message if creation fails
        });
    }
});

// Route to render the 'edit assignment' form for a specific assignment
router.get('/edit/:id', async (req, res, next) => {
    try {
        // Retrieve the assignment ID from the URL parameter
        const id = req.params.id;
        // Fetch the assignment to be edited from the database
        const assignmentToEdit = await Assignment.findById(id);

        // Check if the assignment exists
        if (!assignmentToEdit) {
            // Return a 404 error if the assignment is not found
            return res.status(404).render('error', { message: 'Assignment not found' });
        }

        // Render the 'edit' view and pass the assignment data to the view
        res.render('Assignment/edit', {
            title: 'Edit Assignment',
            assignment: assignmentToEdit,
        });
    } catch (err) {
        // Handle any errors during fetching the assignment for editing
        console.error(err);
        next(err);
    }
});

// Route to handle POST request for updating an existing assignment
router.post('/edit/:id', async (req, res) => {
    try {
        // Retrieve the assignment ID from the URL parameter
        const id = req.params.id;
        // Prepare the updated assignment data from the request body
        const updatedAssignment = {
            "Name": req.body.Name,
            "Subject": req.body.Subject,
            "Topic": req.body.Topic,
            "Class": req.body.Class,
            "Due": req.body.Due,
        };

        // Update the assignment in the database
        await Assignment.findByIdAndUpdate(id, updatedAssignment, { new: true });
        // Redirect to the assignments list page after updating the assignment
        res.redirect('/assignmentslist');
    } catch (err) {
        // Handle any errors during assignment update
        console.error(err);
        res.render('Assignment/edit', {
            title: 'Edit Assignment',
            error: 'Error updating assignment',  // Display an error message if update fails
        });
    }
});

// Route to handle assignment deletion
router.get('/delete/:id', async (req, res) => {
    try {
        // Retrieve the assignment ID from the URL parameter
        const id = req.params.id;
        // Delete the assignment from the database by its ID
        await Assignment.findByIdAndDelete(id);
        // Redirect to the assignments list page after deletion
        res.redirect('/assignmentslist');
    } catch (err) {
        // Handle any errors during assignment deletion
        console.error(err);
        res.render('Assignment/list', {
            error: 'Error deleting assignment',  // Display an error message if deletion fails
        });
    }
});

// Export the router to be used in the main app
module.exports = router;
