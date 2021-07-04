const Carpark = require('../models/carpark_model')
const User = require('../models/user_model')
const mqttClient = require('../controllers/mqtt_controller');

const createCarpark = async(req, res) => {
    if (req.err) {
        console.log("AAA" + req.err);
        if (req.err.details[0].type == 'any.required') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen bütün alanları doğru bir şekilde doldurun."
            })
        }
    } else {
        try {
            const result = await Carpark.create(req.body)

            if (result) {
                res.status(200).json({
                    "success": true,
                    "code": 200,
                    "message": "Database'e ekleme yapıldı.",
                    "data": {
                        profile: result,
                    }
                })
            }

        } catch (err) {
            console.log(err);
            if (err.code == 11000) {
                res.status(409).json({
                        "success": false,
                        "code": 409,
                        "message": `Daha önceden bu ${Object.keys(err.keyPattern)[0]} ile otopark kaydedilmiş.`,
                    })
                    //console.log(err)
            } else if (err) {
                res.json(err)
            }
        }
    }
}

const getCarparks = async(req, res) => {
    try {
        const result = await Carpark.find()
            .select({ areas: 0, __v: 0 })
        res.status(200).json({
            "success": true,
            "code": 200,
            "message": "Otopark bilgileri gönderildi.",
            "data": result
        })
    } catch (err) {
        console.log(err);
    }
}

const getCarparkById = async(req, res) => {
    try {
        const result = await Carpark.findById(req.params.id)
        res.status(200).json({
            "success": true,
            "code": 200,
            "message": `${result.carparkName} bilgileri gönderildi. `,
            "data": result
        })
    } catch (error) {
        res.status(404).json({
            "success": false,
            "code": 404,
            "message": "Belirtilen id'de otopark bulunamadı."
        })
    }
}

const updateCarparkById = async(req, res) => {
    if (req.err) {
        //console.log("AAA" + req.err);
        res.status(req.err.statusCode).json({
            success: false,
            code: 400,
            message: "Lütfen bütün alanları doğru bir şekilde doldurun.",
            internalMessage: req.err.details[0].message
        })

    } else {
        try {
            const userState = await User.findById({ _id: req.user._id }, (err, docs) => {
                    if (err) {
                        console.log(err);
                    }
                })
                //console.log(userState);
            if (userState.reservation.state == true && req.body.reservationState) {
                res.status(400).json({
                    "success": false,
                    "code": 400,
                    "message": `Bu kullanıcı daha önceden rezervasyon yapmış.`
                })
            } else {
                const state = await Carpark.findById({ _id: req.params.id }, { _id: 1, areas: 1 }, (err, docs) => {
                    if (err) {
                        console.log(err);
                    }
                })
                for (let i = 0; i < state.areas.length; i++) {
                    //console.log(state.areas[i]);
                    if (state.areas[i]._id == req.body._id) {
                        if ((state.areas[i].reservationState == true || state.areas[i].isFull == true) && req.body.reservationState) {
                            // console.log("Burası dolu");
                            res.status(400).json({
                                "success": false,
                                "code": 400,
                                "message": `Araç bulunan veya daha önceden rezerve edilen bir yeri rezerve etmeye çalışıyorsunuz: ${state.areas[i].areaName} Bölgesi`,
                            })
                        } else {
                            const result = await Carpark.updateOne({ '_id': req.params.id, 'areas._id': req.body._id }, {
                                    $set: {
                                        'areas.$.reservationState': req.body.reservationState,
                                        'areas.$.areaName': req.body.areaName,
                                        'areas.$.remainingTime': req.body.remainingTime,
                                        'areas.$.isFull': req.body.isFull,
                                        'areas.$.user_id': req.user._id
                                    }
                                })
                                //console.log(req.user);
                            const userResult = await User.findByIdAndUpdate(req.user._id, {
                                $set: {
                                    'reservation.carParkId': req.params.id,
                                    'reservation.state': req.body.reservationState,
                                    'reservation.reservationArea': req.body.areaName
                                }
                            })
                            if (result.nModified == 0 || userResult.nModified == 0) {
                                res.status(409).json({
                                    "success": false,
                                    "code": 409,
                                    "message": "Beklenmedik bir hatayla karşılandı.",
                                    "internalMessage": "Databasede bir güncelleme yapılmadı."
                                })
                            } else {
                                mqttClient.sendMessage('vale_rezervation', 'id: ' + req.params.id + '  carparkArea: ' + req.body.areaName + '  reservationState: ' + req.body.reservationState);
                                res.status(200).json({
                                    "success": true,
                                    "code": 200,
                                    "message": "Başarıyla güncelleme yapıldı.",
                                })
                            }
                        }
                    }
                }

            }
            //console.log(result);
        } catch (error) {
            console.log(error);
            res.status(404).json({
                "success": false,
                "code": 404,
                "message": "Belirtilen id'de otopark bulunamadı."
            })
        }
    }
}


module.exports = {
    createCarpark,
    getCarparks,
    getCarparkById,
    updateCarparkById
}