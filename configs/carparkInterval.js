const Carparks = require('../models/carpark_model');
const User = require('../models/user_model')
var js = require('../env');
const {
    areas
} = require('../models/carpark_validation');
const Carpark = require('../models/carpark_model');
const mqttClient = require('../controllers/mqtt_controller');

async function MyTimer(result) {
    for (let j = 0; j < result.length; j++) {
        let areasx = result[j].areas;
        let id = result[j]._id;
        for (let i = 0; i < areasx.length; i++) {
            var val = areasx[i].remainingTime;
            //console.log(val);
            let areaid = result[j].areas[i]._id
            if (val != 0) {
                val = val - 1
                const resultx = await Carparks.updateOne({
                    '_id': id,
                    'areas._id': areaid
                }, {
                    $set: {
                        'areas.$.remainingTime': val
                    }
                })
            } else {
                const resultx = await Carparks.updateOne({
                    '_id': id,
                    'areas._id': areaid
                }, {
                    $set: {
                        'areas.$.reservationState': false,
                        'areas.$.user_id': null
                    }
                })
                if (resultx.nModified != 0) {
                    mqttClient.sendMessage('vale_rezervation', 'id: ' + id + '  carparkArea: ' + result[j].areas[i].areaName + '  reservationState: false');

                }
                if (result[j].areas[i].user_id != null) {
                    const userResult = await User.findByIdAndUpdate({
                        _id: result[j].areas[i].user_id
                    }, {
                        $set: {
                            'reservation.state': false,
                            'reservation.carParkId': null,
                            'reservation.reservationArea': null
                        }
                    })
                }
            }
        }
    }
}
setInterval(async() => {
    let result = await Carparks.find({}, {
        _id: 1,
        areas: 1
    })
    MyTimer(result);
}, 60000)