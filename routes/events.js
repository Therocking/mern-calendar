const { Router } = require('express');

const { getEvents, updateEvent, createEvent, deleteEvent } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const { isDate } = require('../helper/isDate');

const router = Router();

router.use( validarJWT )

//obtener eventos
router.get('/', getEvents);

// crear eventos
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de fin es obligatoria').custom( isDate ),
        validarCampos
    ],    
    createEvent
);

// actualizar evento
router.put(
    `/:id`,
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de fin es obligatoria').custom( isDate ),
        validarCampos
    ],     
    updateEvent
);

// eliminar evento
router.delete(`/:id`, deleteEvent);


module.exports = router;