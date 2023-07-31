const { response } = require('express');
const Evento = require('../models/Eventos');

const { dicErrors } = require('../errors/DicErrors');

const getEvents = async(req, res = response) => {

    const eventos = await Evento.find().populate('user', 'name');

    return res.status(200).json({
        ok: true,
        eventos
    });
};

const createEvent = async(req, res = response) => {

    let evento = new Evento( req.body );

    evento.user = req.uid

    try {
        const eventoGuardado = await evento.save();

        return res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: dicErrors.ERROR_DEL_SISTEMA
        });
    }

};

const updateEvent = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid

    try {
        const evento = await Evento.findById(eventoId);

        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: dicErrors.EVENTO_NO_EXISTE
            });
        };

        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: dicErrors.USUARIO_NO_AUTORIZADO_EVENTO
            });
        };

        const nuevoEvento = {
            ...req.body,
            user: uid
        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

        res.json({
            ok: true,
            evento: eventoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: dicErrors.ERROR_DEL_SISTEMA
        })
    }
};

const deleteEvent = async(req, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        
        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: dicErrors.EVENTO_NO_EXISTE
            });
        };

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: dicErrors.USUARIO_NO_AUTORIZADO_EVENTO
            });
        }

        await Evento.findByIdAndDelete( eventoId );

        res.json({
            ok: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: dicErrors.ERROR_DEL_SISTEMA
        })
    }
}


module.exports = {
    createEvent,
    deleteEvent,
    getEvents,    
    updateEvent,
}