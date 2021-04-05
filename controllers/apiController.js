const getCurrentUser = (req, res) => {
    res.status(200).json({
        "success": true,
        "code": 200,
        "message": "Başarılı current user",
        "data": req.user
    })
}

module.exports = {
    getCurrentUser
}