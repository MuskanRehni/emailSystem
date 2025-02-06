const express = require('express');
const router = express.Router();

const Email = require('../models/Email');
const authenticate = require('../middleware/authenticate');
const multer=require('multer');
const path=require('path');

// ✅ Multer Storage Configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Save file with unique name
  }
});

const upload = multer({ storage: storage });








// Inbox Page
router.get('/', authenticate, async (req, res) => {
  const emails = await Email.find({ receiver: req.user.email });
  res.render('inbox', { emails });
});

// Sent Emails Page
router.get('/sent', authenticate, async (req, res) => {
  const emails = await Email.find({ sender: req.user.email });
  res.render('sent', { emails });
});


// Route to fetch details of a specific sent email
// ✅ Route to View Email Details
router.get('/sent/:id', authenticate, async (req, res) => {
  try {
    const email = await Email.findById(req.params.id); 
    if (!email) {
      return res.status(404).send('Email not found');
    }
    res.render('emailDetails', { email }); // Render email details page
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// Compose Page
router.get('/compose', authenticate, (req, res) => {
  res.render('compose');
});

// Compose Logic with file upload..
router.post('/compose', authenticate, upload.single('attachment'), async (req, res) => {
  console.log("enter");
  const { receiver, subject, content } = req.body;
  console.log(receiver, subject, content);

  const sender = req.user.email;
  console.log(sender);

  try {
    const newEmail = new Email({
      sender,
      receiver,
      subject,
      content,
      attachment: req.file ? req.file.filename : null  // ✅ Save attachment filename if uploaded
    });

    await newEmail.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email');
  }
});
// Route for '/sent' page
router.get('/sent', (req, res) => {
  res.render('sent'); // Render a view called 'sent'
});


// View Individual Email
router.get('/email/:id', authenticate, async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.redirect('/');
  res.render('email', { email });
});

module.exports = router;
