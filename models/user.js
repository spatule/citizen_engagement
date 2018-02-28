const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a user
const userSchema = new Schema({
    firstName: {
        type: String, // Type validation
        required: true, // Mandatory
        minlength: [2, 'Name is too short'], // Minimum length
        maxlength: [20, 'Name is too long'] // Maximum length
    },
    lastName: {
        type: String, // Type validation
        required: true, // Mandatory
        minlength: [2, 'Name is too short'], // Minimum length
        maxlength: [20, 'Name is too long'] // Maximum length
    },
    role: {
        type: String, // Type validation
        required: true, // Mandatory
        enum: ['citizen', 'manager'], // Limit valid values
        default: 'citizen' // Default value
    },
    createdAt: {
        type: Date, // Type validation
        required: true, // Mandatory
        default: Date.now // Default value
    }
});
// Create the user model and export it
module.exports = mongoose.model('User', userSchema);