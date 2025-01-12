const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require("../../"+process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
const data = require('../../'+process.env.DB_INIT_DATA_PATH);
const fs = require("fs");

const collectionName = process.env.DB_NAME;

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
    args = process.argv;
    force_db_init = args.includes("--force-db-init");
    if(force_db_init) console.log("Forcing DB Initialization");

    const db_context = getDbContext();
    const snapshot = await db_context.collection(collectionName).orderBy("id","desc").limit(1).get();
    const last_id = snapshot.empty ? 0 : snapshot.docs[0].data().id;

    do_init = snapshot.empty || force_db_init;
    if(do_init){ 
        console.log("Initializing data...");
        const batch = db_context.batch();

        data.forEach(car => {
            id = last_id + car.id
            const carRef = db_context.collection(collectionName).doc(id.toString());
            batch.set(carRef, car);
        });
    
        await batch.commit();
        console.log("Data initialized successfully!");
    }

    fs.readFile('./originIndex.json', 'utf8', (err, content) => { 
        if (err) { 
            console.error('Error reading file:', err); 
            return; 
        } 

        const originIndex = JSON.parse(content);
        if(originIndex.length == 0){
            let nI = []
            let oI = []
            data.forEach(car => {
                nI.push(car.name)
                if(!oI.some((origin) => origin == car.origin))
                    oI.push(car.origin)
            });
    
            fs.writeFile('./nameIndex.json', JSON.stringify(nI), (err) => { 
                if (err) { 
                    console.error('Error writing name index to file:', err); 
                } else { 
                    console.log('File has been written successfully.'); 
                } 
            });
    
            fs.writeFile('./originIndex.json', JSON.stringify(oI), (err) => { 
                if (err) { 
                    console.error('Error writing origin index to file:', err); 
                } else { 
                    console.log('File has been written successfully.'); 
                } 
            });
        }
    });

    return snapshot;
}

module.exports = {connect, initData, getDbContext, collectionName};