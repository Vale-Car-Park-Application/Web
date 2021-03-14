const express = require('express');
const app = express();
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const router = require('./routes/router');
const result = require('dotenv').config()

// DOTENV
if (result.error) {
    throw result.error
}

//Express Options
app.use(cors());
app.use(express.urlencoded({
    'extended': 'true'
}));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', router);

//MongoDB Connection
require('./configs/db_connection');

app.listen(process.env.PORT, (err) => {
    if(!err) console.log('Sunucu çalıştırıldı');
    if(err) console.log('Sunucu çalışırken hata');
});