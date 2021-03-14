const router = require('express').Router();

const homepageController = require('../controllers/homepage_controller')

router.get('/', homepageController);

module.exports = router;