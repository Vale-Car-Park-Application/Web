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

require('./configs/carparkInterval')
    //#region SwaggerUI Configs
    //Swagger şu anlık iptal

const swaggerUi = require('swagger-ui-express');

swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
//require('./controllers/mqtt_controller')
require('./configs/token_black_list_interval')
app.use('/', router);