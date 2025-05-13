const admin = require('firebase-admin');

let firebaseApp;
if (!admin.apps.length) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    })
  });
}

exports.handler = async (event, context) => {
  try {
    // Get language from path parameter
    const lang = event.path.split('/').pop();
    
    // Fetch translations from Firestore
    const db = admin.firestore();
    const snap = await db.collection('translations').doc(lang).get();
    
    if (!snap.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Not found' })
      };
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(snap.data())
    };
  } catch (err) {
    console.error('Function error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: err.message })
    };
  }
};