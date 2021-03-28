const router = require('express').Router();

const passport = require('passport');
const homepageController = require('../controllers/homepage_controller')

router.get('/', homepageController);

router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    res.json("ok")
})
router.get('/api/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

module.exports = router;