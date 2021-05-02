const Carpark = require('../models/carpark_model')

const createCarpark = async(req, res) => {
    if (req.err) {
        console.log("AAA" + req.err);
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
                console.log(err)
            } else if (err) {
                res.json(err)
            }
        }
    }
}
module.exports = {
    createCarpark
}