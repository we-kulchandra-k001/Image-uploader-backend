const express = require('express');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 3001;

// Use cors middleware
app.use(cors());

// Use morgan middleware to log requests
app.use(morgan('dev'));

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files to the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Append timestamp to the filename to make it unique
    }
});

const upload = multer({ storage: storage });

// Serve static files from the uploads folder
app.use(express.static(path.join(__dirname, 'uploads')));

// Endpoint for uploading image
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // File uploaded successfully, construct the URL of the uploaded file
    const fileUrl = `http://localhost:${port}/${req.file.filename}`;
    res.send(`File uploaded successfully. Access it at: ${fileUrl}`);
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
