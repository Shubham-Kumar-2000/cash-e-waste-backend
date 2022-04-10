const Admin = require('firebase-admin');
const serviceAccount = require('../credentials/firebase.json');

Admin.initializeApp({
    credential: Admin.credential.cert(serviceAccount)
});

exports.validateFirebaseToken = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken)
        return res.status(200).json({
            error: true,
            message: 'No token provided'
        });
    Admin.auth()
        .verifyIdToken(authToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            Admin.auth()
                .getUser(uid)
                .then((userRecord) => {
                    if (!userRecord.email || userRecord.email.length < 1) {
                        userRecord.email = userRecord.providerData
                            .map((provider) => provider.email)
                            .find(Boolean);
                    }
                    if (!userRecord.email || userRecord.email.length < 1) {
                        throw new Error('No email found');
                    }
                    req.user = {
                        email: userRecord.email,
                        name: userRecord.displayName,
                        avatar: userRecord.photoURL,
                        phone: userRecord.phoneNumber,
                        uid: userRecord.uid
                    };
                    console.log(req.user);
                    next();
                })
                .catch((e) => {
                    console.log(e);
                    res.status(200).json({
                        error: true,
                        message: String(e)
                    });
                });
        })
        .catch((e) => {
            console.log(e);
            res.status(200).json({
                error: true,
                message: String(e)
            });
        });
};
