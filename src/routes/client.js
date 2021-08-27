const router = require('express').Router();
const Controller = require('../controllers/index');
const sampleSchemaValidator = require('../validators/sample');

const clientController = new Controller('Client');
const ClientService = require('../services/client/client');

const clientService = new ClientService(clientController, sampleSchemaValidator);

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await clientService.createRecord(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await clientService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', async (request, response, next) => {
            request.payload = await clientService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', async (request, response, next) => {
            request.payload = await clientService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', async (request, response, next) => {
            request.payload = await clientService.updateRecords(request, next);
            next();
        })
        .put('/:id', async (request, response, next) => {
            request.payload = await clientService.updateRecordById(request, next);
            next();
        })
        .delete('/', async (request, response, next) => {
            request.payload = await clientService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', async (request, response, next) => {
            request.payload = await clientService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /client: ${e.message}`);
} finally {
    module.exports = router;
}
