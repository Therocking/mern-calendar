const { response } = require('express');

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { generarJWT } = require('../helper/jwt');
const { dicErrors } = require('../errors/DicErrors');

const crearUsuario = async(req, res = response) => {

   const { email, password } = req.body;
 
    try {
        let usuario = await Usuario.findOne({ email });

        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: dicErrors.CORREO_EN_USO
            });
        }

        usuario = new Usuario(req.body);
    
        // Encriptar pass
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name)
    
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: dicErrors.ERROR_DEL_SISTEMA
        });
    }
};


const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });
        
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: dicErrors.CORREO_NO_EXISTE
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password )
        
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: dicErrors.PASSWORD_INNCORRECTO,
            });
        };
        
        // Generar JWT
        const token = await generarJWT( usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: dicErrors.ERROR_DEL_SISTEMA
        });
    }

}


const revalidarToken = async(req, res = response) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name)

    res.json({
        ok: true,
        token
    });
}




module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}