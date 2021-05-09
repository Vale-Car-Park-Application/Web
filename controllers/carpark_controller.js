const Carpark = require('../models/carpark_model')

const createCarpark = async(req, res) => {
    if (req.err) {
        //console.log("AAA" + req.err);
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
        // try {
        //     const result = await Carpark.findByIdAndUpdate(req.params.id, req.body, { new: true })
        //     res.json(result)

        // } catch (err) {
        //     //console.log(err);
        // res.status(404).json({
        //     "success": false,
        //     "code": 404,
        //     "message": "Belirtilen id'de otopark bulunamadı."
        // })
        // }
        try {
            const result = await Carpark.updateOne({ '_id': req.params.id, 'areas._id': req.body._id }, {
                $set: {
                    'areas.$.state': req.body.state,
                    'areas.$.areaName': req.body.areaName,
                    'areas.$.remainingTime': req.body.remainingTime
                }
            })
            if (result.nModified == 0) {
                res.status(409).json({
                    "success": false,
                    "code": 409,
                    "message": "Rezerve edilen yerleri tekrar rezerve edemezsiniz.",
                    "internalMessage": "Databasede bir güncelleme yapılmadı."
                })
            } else {
                res.status(200).json({
                    "success": true,
                    "code": 200,
                    "message": "Başarıyla güncelleme yapıldı.",
                })
            }

            //console.log(result);
        } catch (error) {
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