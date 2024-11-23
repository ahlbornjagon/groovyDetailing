const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const app = express();
const port = 3000;

let appointments = []; // In-memory storage for appointments

app.use(bodyParser.json());

// Google API setup
const oauth2Client = new google.auth.OAuth2(
  '1028855333547-jgl0o0hmrb8o7bouka57ptm1458pbvk8.apps.googleusercontent.com',
  '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',
  // 'YOUR_REDIRECT_URI'
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Endpoint to get existing appointments
app.get('/get-appointments', (req, res) => {
  res.json(appointments);
});

// Endpoint to book an appointment
app.post('/book-appointment', (req, res) => {
  const { title, start, end, userEmail } = req.body;
  const appointment = { title, start, end, status: 'pending', userEmail };
  appointments.push(appointment);

  // Send email to admin for approval
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jagonmahlborn@gmail.com',
      pass: 'jagman12'
    }
  });

  const mailOptions = {
    from: 'jagonmahlborn@gmail.com',
    to: 'admin-email@gmail.com',
    subject: 'New Appointment Request',
    text: `New appointment request:\n\nTitle: ${title}\nStart: ${start}\nEnd: ${end}\nUser: ${userEmail}\n\nPlease reply with "approve" or "deny".`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Booking request sent!');
  });
});

// Endpoint to approve or deny appointment
app.post('/approve-appointment', async (req, res) => {
  const { appointmentId, decision } = req.body;
  const appointment = appointments.find(a => a.id === appointmentId);

  if (!appointment) {
    return res.status(404).send('Appointment not found');
  }

  if (decision === 'approve') {
    // Block the day off on Google Calendar
    const event = {
      summary: appointment.title,
      start: {
        dateTime: appointment.start,
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: appointment.end,
        timeZone: 'America/New_York',
      },
    };

    try {
      await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      appointment.status = 'approved';
      res.status(200).send('Appointment approved and added to Google Calendar');
    } catch (error) {
      res.status(500).send('Error adding to Google Calendar');
    }
  } else {
    appointment.status = 'denied';
    res.status(200).send('Appointment denied');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
