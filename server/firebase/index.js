const admin = require('firebase-admin');
var serviceAccount = require("../../fangarde-29219-firebase-adminsdk-64kr1-c28bf06995.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'fangarde-29219.appspot.com'
});

module.exports = admin