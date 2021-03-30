module.exports = (req, res) => {
    res.render('homepage');
}

/**
 * @swagger
 * /homepage:
 *  get:
 *      security:
 *          - OAuth2: [admin]# Use OAuth with a different scope
 *      summary: Bu bir deneme kullanımıdır
 *      description: API ile alaksı yoktur. Anasayfaya yönlendirir.
 *  post:
 *      summary: Bu da ayrı bir deneme kullanımı
 *      description: askmdamk.
*/