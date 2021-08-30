const router = require('express').Router();
const Controller = require('../controllers/index');
const quoteSchemaValidator = require('../validators/quote');
const { checkAccessRight, verifyToken } = require('../middlewares/permission');

const quoteController = new Controller('Quote');
const QuoteService = require('../services/quote/quote');

const quoteService = new QuoteService(quoteController, quoteSchemaValidator);

try {
    router
        .post('/', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.createRecord(request, next);
            next();
        })
        .get('/', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.updateRecords(request, next);
            next();
        })
        .put('/:id', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.updateRecordById(request, next);
            next();
        })
        .delete('/', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', verifyToken, async (request, response, next) => {
            request.payload = await quoteService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /quote: ${e.message}`);
} finally {
    module.exports = router;
}
