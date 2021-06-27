const Carparks = require('../models/carpark_model');
var js = require('../env');


async function MyTimer(result) {
    for (let j = 0; j < result.length; j++) {
        let areasx = result[j].areas;
        for (let i = 0; i < areasx.length; i++) {
            var val = areasx[i].remainingTime;
            //console.log(val);
            let id = result[j]._id;
            let areaid = result[j].areas[i]._id
            if (val != 0) {
                val = val - 1
                const resultx = await Carparks.updateOne({ '_id': id, 'areas._id': areaid }, {
                    $set: {
                        'areas.$.remainingTime': val
                    }
                })
            } else {
                const resultx = await Carparks.updateOne({ '_id': id, 'areas._id': areaid }, {
                    $set: {
                        'areas.$.reservationState': false
                    }
                })
            }
        }
        //console.log(JSON.stringify(result));
    }
}
setInterval(async() => {
    let result = await Carparks.find({}, { _id: 1, areas: 1 })
    MyTimer(result);
}, 60000)