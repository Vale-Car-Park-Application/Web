const express = require('express');
const app = express();
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const passport = require('passport')
const cookie = require('cookie-session')
const env = require('./env');

//Express Options
app.use(cors());
app.use(express.urlencoded({
    'extended': 'true'
}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/public', express.static(path.join(__dirname, 'public')));

//MongoDB Connection
require('./configs/db_connection');

//Passport Conenction
require('./middleware/passport');


//#region SwaggerUI Configs
//Swagger şu anlık iptal
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Vale API',
        version: '0.1.0',
        description: 'Express ile tasarlanmış Vale otopark sistemi için gerekli API.',
        license: {
            name: 'Licensed Under MIT',
            url: 'https://spdx.org/licenses/MIT.html',
        },
    },
    basePath: '/',
    components: {
        securitySchemes: {

        }
    },
    security: [{
        oauth: []
    }],
    servers: [{
        url: 'https://ieeevale.com',
        description: 'Ürün Sunucusu',
    }, {
        url: 'http://localhost:3000',
        description: 'Geliştirme Sunucusu',
    }],
};

const options = {
    swaggerDefinition,
    // Paths to files containing OpenAPI definitions
    apis: ['./controllers/*.js', './routes/*.js', './middleware/*.js', './configs/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
//#endregion

//Passport
app.use(
    cookie({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: ['dlkmckldsmkl']
    })
)
app.use(passport.initialize());
app.use(passport.session())

app.listen(env.PORT, (err) => {
    if (!err) console.log('Sunucu çalıştırıldı');
    if (err) console.log('Sunucu çalışırken hata');
});
const router = require('./routes/router');
app.use('/', router);