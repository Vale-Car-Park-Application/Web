const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user_model')
const Token = require('../models/token_model')

const signIn = async(req, res) => {
    const user = await User.findOne({
        email: req.body.email
    }, async(err, user) => {
        //console.log(user);
        if (err) {
            res.json(err)
        } else if (!user) {
            res.status(404).json({
                    "success": false,
                    "code": 404,
                    "message": "Verilen email bilgileri hatalıdır."
                }) // e posta hatalı
        } else {
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                //console.log(req.body.password + user.password);
                if (error) {
                    res.json(error)
                } else if (!result) {
                    res.status(404).json({
                            "success": false,
                            "code": 404,
                            "message": "Verilen password bilgileri hatalıdır.",
                        }) // şifre hatalı
                } else if (result) {
                    const token = jwt.sign({
                        id: user._id
                    }, 'supersecret', {
                        expiresIn: '24h'
                    })
                    res.status(200).json({
                        "success": true,
                        "code": 200,
                        "message": "Girişiniz başarıyla yapıldı.",
                        "data": {
                            profile: user,
                            token: token
                        }
                    })
                }

            })
        }
    })
}

const signUp = async(req, res) => {
    if (req.err) {
        console.log(req.err);
        if (req.err.details[0].type == 'any.required') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen bütün alanları doldurun."
            })
        } else if (req.err.details[0].type == 'string.email') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen geçerli bir email girin."
            })
        } else if (req.err.details[0].type == 'string.pattern.base') {
            res.status(req.err.statusCode).json({
                success: false,
                code: 400,
                message: "Lütfen geçerli bir telefon numarası girin."
            })
        }
    } else {
        try {
            var hashedPassword = await bcrypt.hash(req.body.password, 8);
            const user = User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                phoneNumber: req.body.phoneNumber,
                licensePlate: req.body.licensePlate,
                vehicleType: req.body.vehicleType,
                fuelType: req.body.fuelType
            }, (err, user) => {
                if (err) {
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
                } else {
                    const token = jwt.sign({
                        id: user._id
                    }, 'supersecret', {
                        expiresIn: '24h'
                    })
                    res.status(200).json({
                        "success": true,
                        "code": 200,
                        "message": "Database'e ekleme yapıldı.",
                        "data": {
                            profile: user,
                            token: token
                        }
                    })
                }
            })
        } catch (err) {
            res.json(err)
        }
    }
}

const logOut = async(req, res) => {
    //res.json(req.headers.authorization);
    const headersToken = await req.headers.authorization;
    const token = Token.create({
        token: headersToken
    }, (err, docs) => {
        if (err) {
            res.json(err)
        } else {
            // console.log(docs);
            res.status(200).json({
                "success": true,
                "code": 200,
                "message": "Çıkış işlemi başarıyla yapıldı."
            })
        }
    })

}
module.exports = {
    signIn,
    signUp,
    logOut
}