const router = require('express').Router();
const Controller = require('../controllers/index');
const sampleSchemaValidator = require('../validators/sample');

const personalisedServiceController = new Controller('PersonalisedService');
const PersonalisedService = require('../services/personalisedService/personalisedService');
const verifyToken = require('../middlewares/verifyToken');

const personalisedService = new PersonalisedService(
    personalisedServiceController,
    sampleSchemaValidator
);

try {
    router.use(
        '/',
        verifyToken,
        router
            .post('/', async (request, response, next) => {
                request.payload = await personalisedService.createRecord(request, next);
                next();
            })
            .get('/', async (request, response, next) => {
                request.payload = await personalisedService.readRecordsByFilter(request, next);
                next();
            })
            .get('/:id', async (request, response, next) => {
                request.payload = await personalisedService.readRecordById(request, next);
                next();
            })
            .get('/search/:keys/:keyword', async (request, response, next) => {
                request.payload = await personalisedService.readRecordsByWildcard(request, next);
                next();
            })
            .put('/', async (request, response, next) => {
                request.payload = await personalisedService.updateRecords(request, next);
                next();
            })
            .put('/:id', async (request, response, next) => {
                request.payload = await personalisedService.updateRecordById(request, next);
                next();
            })
            .delete('/', async (request, response, next) => {
                request.payload = await personalisedService.deleteRecords(request, next);
                next();
            })
            .delete('/:id', async (request, response, next) => {
                request.payload = await personalisedService.deleteRecordById(request, next);
                next();
            })
    );
} catch (e) {
    console.log(`[Route Error] /personalisedservice: ${e.message}`);
} finally {
    module.exports = router;
}
