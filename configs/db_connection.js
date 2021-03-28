const mongoose = require('mongoose')
const env = require('../env')

mongoose.connect(env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB'ye bağlanldı"))
    .catch(err => console.log("DB'ye bağlanırken hata oluştu: " + err))