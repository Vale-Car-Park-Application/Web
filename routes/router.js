const router = require('express').Router();
const validate = require('../middleware/validation')
const User = require('../models/user_validation')
const { carparkValidation, areas } = require('../models/carpark_validation')
const passport = require('passport');
const homepageController = require('../controllers/homepage_controller')
const aboutController = require('../controllers/about_controller')
const contactController = require('../controllers/contact_controller')
const authController = require('../controllers/auth_controller');
const auth = require('../middleware/auth');
const apiController = require('../controllers/api_controller');
const carparkController = require('../controllers/carpark_controller')

router.get('/', homepageController);
router.get('/about', aboutController);
router.get('/contact', contactController);

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.json("ok")
})
router.get('/api/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.post('/api/signin', authController.signIn);
router.post('/api/signUp', validate(User), authController.signUp);
router.get('/api/logout', auth, authController.logOut);
router.get('/api/current_user', auth, apiController.getCurrentUser);
router.post('/api/carparks', auth, validate(carparkValidation), carparkController.createCarpark);
router.get('/api/carparks', auth, carparkController.getCarparks)
router.get('/api/carparks/:id', auth, carparkController.getCarparkById);
router.put('/api/carparks/:id', auth, validate(areas), carparkController.updateCarparkById)

module.exports = router;