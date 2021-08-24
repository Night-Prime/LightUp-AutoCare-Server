/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
 * */

const router = require('express').Router();
const { handle404, handleError, setupRequest, processResponse } = require('../middlewares/http');

/** Route Handlers */
const sampleRouteHandler = require('./sample');

/** Cross Origin Handling */
router.use(setupRequest);
router.use('/samples', sampleRouteHandler);
router.use(processResponse);

/** Static Routes */
router.use('/image/:imageName', () => {});

router.use(handle404);
router.use(handleError);

module.exports = router;
