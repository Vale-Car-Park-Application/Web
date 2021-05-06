const Carpark = require('../models/carpark_model')

const createCarpark = async(req, res) => {
    if (req.err) {
        //console.log("AAA" + req.err);
        if (req.err.details[0].type == 'any.required') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen bütün alanları doldurun."
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
                        "message": `Daha önceden bu ${Object.keys(err.keyPattern)[0]} ile kaydolunmuş.`,
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
        if (req.err.details[0].type == 'any.required') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen bütün alanları doldurun."
            })
        }
    } else {
        try {
            const result = await Carpark.findByIdAndUpdate(req.params.id, req.body, { new: true })
            res.json(result)

        } catch (err) {
            //console.log(err);
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