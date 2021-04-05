module.exports = async function auth(req, res, next) {
    const jwt = require('jsonwebtoken')
    const User = require('../models/userModel')
    try {
        //console.log(req.headers);
        const token = await (req.headers['authorization'] || req.headers['authorization'].split(' ')[1])
            //console.log(token);
        if (token == null) {
            return res.status(401).json({
                success: false,
                code: 401,
                message: "Belirtilen token hatalı."
            })
        }
        const sonuc = jwt.verify(token, 'supersecret')

        //console.log(sonuc);
        const bulunan = await User.findById(sonuc.id)
        req.user = bulunan
        next()
    } catch (err) {
        if (err.message == 'invalid signature') {
            res.status(401).json({
                success: false,
                code: 401,
                message: "Belirtilen token hatalı."
            })
        } else if (err.name == 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                code: 401,
                message: "Token tüketim tarihini doldurmuştur."
            })
        } else {
            console.log(err);
            res.status(401).json({
                success: false,
                code: 401,
                message: "Sistemin bilmediği bir hata oluştu."
            })
        }

    }
}