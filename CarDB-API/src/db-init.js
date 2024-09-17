const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./raygx-36a09-1f5620a837aa.json');
const data = require('./data.json');

const collectionName = "cars";

// initializeApp({
//     credential: applicationDefault(),
//     projectId: '<FIREBASE_PROJECT_ID>',
//   });
function connect(){
    console.log("Connecting to database...");
    // Initialize Firebase
    initializeApp({
        credential: cert(serviceAccount)
    });
    console.log("Database connected successfully!");

}

function getDbContext(){
    return getFirestore();
}

async function initData(){
    const db_context = getDbContext();
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

module.exports = {connect, initData, getDbContext, collectionName};