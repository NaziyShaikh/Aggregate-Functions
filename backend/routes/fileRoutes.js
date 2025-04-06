const express = require('express');
const multer = require('multer');
const File = require('../models/File'); // Adjust the path if necessary

const router = express.Router();

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

// Route to handle file uploads
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Here you can save the file information to the database if needed
    const newFile = new File({
        filename: req.file.filename,
        path: req.file.path,
        // Add other fields as necessary
    });

    newFile.save()
        .then(() => res.status(200).send('File uploaded successfully!'))
        .catch(err => res.status(500).send('Error saving file information: ' + err));
});

// Other routes can be defined here

module.exports = router;