const express = require('express');
const Email = require('../models/Email');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

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

// Compose Page
router.get('/compose', authenticate, (req, res) => {
  res.render('compose');
});

// Compose Logic
router.post('/compose', authenticate, async (req, res) => {
  const { receiver, subject, content } = req.body;
  const sender = req.user.email;

  try {
    const newEmail = new Email({ sender, receiver, subject, content });
    await newEmail.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending email');
  }
});

// View Individual Email
router.get('/email/:id', authenticate, async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) return res.redirect('/');
  res.render('email', { email });
});

module.exports = router;
