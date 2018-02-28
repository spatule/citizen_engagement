const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for a user
const issueSchema = new Schema({
    status: {
        type: String, // Type validation
        required: true, // Mandatory
        enum: ['new', 'inProgress', 'canceled', 'completed'], // Limit valid values
        default: 'new' // Default value
    },
    description: {
        type: String, // Type validation
        maxlength: [1000, 'Description is too long'] // Maximum length
    },
    imageUrl: {
        type: String, // Type validation
        maxlength: [500, 'ImageUrl is too long'] // Maximum length
    },
    latitude: {
        type: Number, // Type validation
        required: true, // Mandatory
    },
    longitude: {
        type: Number, // Type validation
        required: true, // Mandatory
    },
    tags: {
        type: [String], // Type validation
        required: true, // Mandatory
    },
    user: {
        type: Schema.Types.ObjectId, // Type validation
        required: true, // Mandatory
    },
    createdAt: {
        type: Date, // Type validation
        required: true, // Mandatory
        default: Date.now // Default value
    },
    updatedAt: {
        type: Date, // Type validation
        required: true, // Mandatory
        default: Date.now // Default value
    }
});
// Create the user model and export it
module.exports = mongoose.model('Issue', issueSchema);