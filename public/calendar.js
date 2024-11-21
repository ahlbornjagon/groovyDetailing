const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

let appointments = []; // In-memory storage for appointments

app.use(bodyParser.json());

// Endpoint to get existing appointments
app.get('/get-appointments', (req, res) => {
  res.json(appointments);
});

// Endpoint to book an appointment
app.post('/book-appointment', (req, res) => {
  const { title, start, end } = req.body;
  const appointment = { title, start, end, status: 'pending' };
  appointments.push(appointment);

  // Send email to admin for approval
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'admin-email@gmail.com',
    subject: 'New Appointment Request',
    text: `New appointment request:\n\nTitle: ${title}\nStart: ${start}\nEnd: ${end}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });

  res.status(200).send('Booking request sent!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});