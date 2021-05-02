const router = require('express').Router();
const validate = require('../middleware/validation')
const User = require('../models/user_validation')
const passport = require('passport');
const homepageController = require('../controllers/homepage_controller')
const authController = require('../controllers/auth_controller');
const auth = require('../middleware/auth');
const apiController = require('../controllers/api_controller');
const carparkController = require('../controllers/carpark_controller')

router.get('/', homepageController);

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.json("ok")
})
router.get('/api/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.post('/api/signin', authController.signIn);
router.post('/api/signUp', validate(User), authController.signUp);
router.get('/api/current_user', auth, apiController.getCurrentUser);
router.post('/api/carparks', auth, carparkController.createCarpark);

module.exports = router;