/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

const router = require('express').Router();
const { handle404, handleError, setupRequest, processResponse } = require('../middlewares/http');

/** Route Handlers */
const sampleRouteHandler = require('./sample');
const clientRouteHandler = require('./client');
const vehicleRouteHandler = require('./vehicle');
const quoteRouteHandler = require('./quote');
const sampleRouteHandler = require('./sample'),
    invoiceRouteHandler = require('./invoice'),
    staffRouteHandler = require('./staff'),
    personalisedServiceRouteHandler = require('./personalisedService');

/** Cross Origin Handling */
router.use(setupRequest);
router.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Light-AutoCare',
        payload: null,
    });
});
router.use('/samples', sampleRouteHandler);
router.use('/client', clientRouteHandler);
router.use('/vehicle', vehicleRouteHandler);
router.use('/quote', quoteRouteHandler);
router.use('/invoice', invoiceRouteHandler);
router.use('/staff', staffRouteHandler);
router.use('/personalisedService', personalisedServiceRouteHandler);
router.use(processResponse);

/** Static Routes */
router.use('/image/:imageName', () => {});

router.use(handle404);
router.use(handleError);

module.exports = router;
