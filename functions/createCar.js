const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Check if the app is already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}

exports.createCar = functions.https.onCall(async (data, context) => {
    try {
        // Log the received data for debugging
        console.log('Received data:', data);

        // Validate input data
        const requiredFields = ['createdAt', 'driverName', 'driverPhone', 'model', 'passengers', 'plate'];
        for (const field of requiredFields) {
            if (!data[field]) {
                console.error(`Missing field: ${field}`);
                throw new functions.https.HttpsError('invalid-argument', `The function must be called with the argument "${field}".`);
            }
        }

        const newCar = data; // Expecting the car data to be passed in the request
        const plate = newCar.plate;

        const carRef = admin.firestore().collection('cars');
        const querySnapshot = await carRef.where('plate', '==', plate).get();

        if (!querySnapshot.empty) {
            // If a car with the same number plate already exists, throw an error
            throw new functions.https.HttpsError('already-exists', 'A car with this number plate already exists.');
        }

        // No duplicates found, proceed with creating the car document
        const docRef = await carRef.add(newCar); // Create the car document
        console.log('Car created successfully:', newCar);

        // Return only the document ID or a success message
        return { message: 'Car created successfully', id: docRef.id };
    } catch (error) {
        console.error('Error creating car:', error);
        throw new functions.https.HttpsError('internal', `An error occurred while creating the car: ${error.message}`);
    }
});