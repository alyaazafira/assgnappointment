const express = require('express');
const { MongoClient } = require('mongodb');
const moment = require('moment');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection URL and Database Name
const url = 'mongodb+srv://yazap73:alyaa123.@alyaazafira.5qyapn0.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'appointment_visitor';

app.post('/appointment', async (req, res) => {
  try {
    const { newname, newcompany, newpurpose, newphoneNumber, newdate, newtime, newuser } = req.body;
    // Format the date and time using Moment.js
    const formattedDate = moment(newdate).format('YYYY-MM-DD');
    const formattedTime = moment(newtime, 'h:mm A').format('HH:mm');
    await register(newname, newcompany, newpurpose, newphoneNumber, newdate, newtime, newuser);
    res.send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

async function register(newname, newcompany, newpurpose, newphoneNumber, newdate, newtime, newuser) {
  try {
    // Connect to MongoDB
    const client = new MongoClient(url);
    await client.connect();

    console.log('Connected to MongoDB successfully');

    // Select the database
    const db = client.db(dbName);

    // Insert the appointment into the "appointments" collection
    const collection = db.collection('visitors');
    await collection.insertOne({
      name: newname,
      company: newcompany,
      purpose: newpurpose,
      phoneNumber: newphoneNumber,
      date: newdate,
      time: newtime,
      user: newuser,
    });

    // Close the database connection
    client.close();

    console.log('Appointment created successfully');
  } catch (error) {
    throw error;
  }
}


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

