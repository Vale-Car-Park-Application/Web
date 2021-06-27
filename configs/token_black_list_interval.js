const Token = require('../models/token_model')

async function MyTimer(result) {
    for (let j = 0; j < result.length; j++) {
        var val = result[j].interval;
        //console.log(val);
        let id = result[j]._id;
        if (val != 0) {
            val = val - 1
            const resultx = await Token.updateOne({ '_id': id, }, {
                $set: {
                    "interval": val
                }
            })
        } else {
            Token.deleteOne({ interval: 0 }, (err, result) => {
                if (err) {
                    //console.log(err);
                } else {
                    //console.log("Silindi");
                }
            })
        }
    }
}
setInterval(async() => {
    let result = await Token.find({})
    MyTimer(result);
    //console.log(result);
}, 60000)