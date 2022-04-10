const express = require('express');
const { login } = require('../controllers/auth.controller');
const router = express.Router();
const { validateFirebaseToken } = require('../helpers/firebaseHelper');

router.post('/', validateFirebaseToken, login);
// const passport = require('../helpers/passport.helper');

/* GET users listing. */
// router.get(
//     '/github/',
//     passport.authenticate('github', {
//         scope: GITHUB_SCOPES
//     }),
//     login
// );

// router.get(
//     '/github/callback',
//     passport.authenticate('github', {
//         scope: GITHUB_SCOPES,
//         failureRedirect: 'http://localhost:3000/'
//     }),
//     login
// );

// /* GET users bitbucket */
// router.get(
//     '/bitbucket',
//     passport.authenticate('bitbucket', {
//         scope: BITBUCKET_SCOPES
//     }),
//     login
// );

// router.get(
//     '/bitbucket/callback',
//     passport.authenticate('bitbucket', {
//         scope: BITBUCKET_SCOPES
//     }),
//     login
// );

// /* GET users Gitlab */
// router.get(
//     '/gitlab',
//     passport.authenticate('gitlab', {
//         scope: GITLAB_SCOPES
//     }),
//     login
// );

// router.get(
//     '/gitlab/callback',
//     passport.authenticate('gitlab', {
//         scope: GITLAB_SCOPES
//     }),
//     login
// );

const authRouter = (app) => {
    app.use('/auth', router);
};
module.exports = authRouter;
