const { response } = require("express");
const jwt = require("jsonwebtoken");
const { dicErrors } = require("../errors/DicErrors");


const validarJWT = (req, res = response, next) => {
    
    // x-token --header
    const token = req.header('x-token');

    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: dicErrors.NO_HAY_TOKEN
        });
    };

    try {

        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEDE,
        );

        req.uid = uid;
        req.name = name;
        
    } catch (error) {
        return res.status(401).json({
            ok:false,
            msg: dicErrors.TOKEN_NO_VALIDO
        })
    }

    next();
};

module.exports = {
    validarJWT
};