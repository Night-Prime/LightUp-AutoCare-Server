const router = require('express').Router();
const Controller = require('../controllers/index');
const personalisedServiceSchemaValidator = require('../validators/personalisedService');

const personalisedServiceController = new Controller('PersonalisedService');
const PersonalisedService = require('../services/personalisedService/personalisedService');
const { verifyToken, checkAdminAccess } = require('../middlewares/permission');

const personalisedService = new PersonalisedService(
    personalisedServiceController,
    personalisedServiceSchemaValidator
);

try {
    router
        .post('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await personalisedService.createRecord(request, next);
            next();
        })
        .get('/', verifyToken, async (request, response, next) => {
            request.payload = await personalisedService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', verifyToken, async (request, response, next) => {
            request.payload = await personalisedService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', verifyToken, async (request, response, next) => {
            request.payload = await personalisedService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await personalisedService.updateRecords(request, next);
            next();
        })
        .put('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await personalisedService.updateRecordById(request, next);
            next();
        })
        .delete('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await personalisedService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await personalisedService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /personalisedservice: ${e.message}`);
} finally {
    module.exports = router;
}
