const router = require('express').Router();
const Controller = require('../controllers/index');
const sampleSchemaValidator = require('../validators/sample');

const quoteController = new Controller('Quote');
const QuoteService = require('../services/quote/quote');

const quoteService = new QuoteService(quoteController, sampleSchemaValidator);

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await quoteService.createRecord(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await quoteService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', async (request, response, next) => {
            request.payload = await quoteService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', async (request, response, next) => {
            request.payload = await quoteService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', async (request, response, next) => {
            request.payload = await quoteService.updateRecords(request, next);
            next();
        })
        .put('/:id', async (request, response, next) => {
            request.payload = await quoteService.updateRecordById(request, next);
            next();
        })
        .delete('/', async (request, response, next) => {
            request.payload = await quoteService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', async (request, response, next) => {
            request.payload = await quoteService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /quote: ${e.message}`);
} finally {
    module.exports = router;
}
