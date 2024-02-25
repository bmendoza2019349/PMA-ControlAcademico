const { request, response } = require("express")

const tieneRole = (...roles) => {
    return (req= request, res = response, next ) => {
        if(!req.user){
            return res.status(500).json({
                msg: 'Se quiere certificar un role si validar token'
            })
        }

        if(!roles.includes(req.user)){
            return res.status(400).json({
                msg: `Este endpoint necesita un rol de la siguiente lista ${roles}`
            })
        }
    }
}

module.exports = {
    tieneRole
}