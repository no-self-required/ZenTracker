const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.header('token')
    if(!token){
        return res.status(401).json({msg: "No Token - Authorization Denied"})
    }
    try{
        const verified = jwt.verify(token, 'secretcode123')
        if(!verified){
            return res.status(401).json({msg: "Cannot Verify - Authorization Denied"})
        }
        req.user = verified
        next()
    } catch(err){
        res.status(401).json({msg: err})
    }
}