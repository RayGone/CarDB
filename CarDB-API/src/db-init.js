const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./raygx-36a09-1f5620a837aa.json');
const data = require('./data.json');

const collectionName = "cars";

// initializeApp({
//     credential: applicationDefault(),
//     projectId: '<FIREBASE_PROJECT_ID>',
//   });
console.log("Initializing database...");
    
// Initialize Firebase
initializeApp({
    credential: cert(serviceAccount)
});
const db_context = getFirestore();

console.log("Database initialized successfully!");

async function init(){
    const snapshot = await db_context.collection(collectionName).limit(1).get();
    if(snapshot.empty){ 
        console.log("Initializing data...");
        const batch = db_context.batch();

        data.forEach(car => {
            const carRef = db_context.collection(collectionName).doc(car.id.toString());
            batch.set(carRef, car);
        });
    
        await batch.commit();
        console.log("Data initialized successfully!");
    }

    return snapshot;
}

module.exports = { init, collectionName, db_context };