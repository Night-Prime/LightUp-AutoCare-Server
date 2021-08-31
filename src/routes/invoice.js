const router = require('express').Router();
const Controller = require('../controllers/index');
const invoiceSchemaValidator = require('../validators/invoice');

const invoiceController = new Controller('Invoice');
const InvoiceService = require('../services/invoice/invoice.js');
const { checkAccessRight, verifyToken } = require('../middlewares/permission');

const invoiceService = new InvoiceService(invoiceController, invoiceSchemaValidator);

try {
    router
        .post('/', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.createRecord(request, next);
            next();
        })
        .get('/', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.readRecordById(request, next);
            next();
        })
        .get(
            '/search/:keys/:keyword',
            verifyToken,
            checkAccessRight,
            async (request, response, next) => {
                request.payload = await invoiceService.readRecordsByWildcard(request, next);
                next();
            }
        )
        .put('/', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.updateRecords(request, next);
            next();
        })
        .put('/:id', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.updateRecordById(request, next);
            next();
        })
        .delete('/', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', verifyToken, checkAccessRight, async (request, response, next) => {
            request.payload = await invoiceService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /invoice: ${e.message}`);
} finally {
    module.exports = router;
}
