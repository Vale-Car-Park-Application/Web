const router = require('express').Router();

const passport = require('passport');
const homepageController = require('../controllers/homepage_controller')
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const apiController = require('../controllers/apiController');

router.get('/', homepageController);

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.json("ok")
})
router.get('/api/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.post('/api/signin', authController.signIn);
router.post('/api/signUp', authController.signUp);
router.get('/api/current_user', auth, apiController.getCurrentUser);

module.exports = router;