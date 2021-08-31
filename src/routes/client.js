const router = require('express').Router();
const Controller = require('../controllers/index');
const clientSchemaValidator = require('../validators/client');
const { checkAccessRight, verifyToken } = require('../middlewares/permission');

const clientController = new Controller('Client');
const ClientService = require('../services/client/client');

const clientService = new ClientService(clientController, clientSchemaValidator);

try {
    router
        .post('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await clientService.createRecord(request, next);
            next();
        })
        .get('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await clientService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', verifyToken, async (request, response, next) => {
            request.payload = await clientService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', verifyToken, async (request, response, next) => {
            request.payload = await clientService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await clientService.updateRecords(request, next);
            next();
        })
        .put('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await clientService.updateRecordById(request, next);
            next();
        })
        .delete('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await clientService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await clientService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /client: ${e.message}`);
} finally {
    module.exports = router;
}
