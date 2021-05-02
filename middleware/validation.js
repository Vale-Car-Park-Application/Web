module.exports = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body);
            //console.log(value);
            //console.log("aa " + error)
            if (error === undefined || typeof error === "undefined") {
                return next()
            }
            // const err = new Error(
            //     error.details.map((errorObject) => errorObject.message).toString()
            // )
            error.statusCode = 400;
            //console.log(error);
            req.err = error
            next()
        } catch (err) {
            req.err = err
            next()
        }
    }
}