const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Check if the app is already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

const { createCar } = require('./createCar'); // Import the createCar function

exports.createCar = createCar; // Use the imported function
