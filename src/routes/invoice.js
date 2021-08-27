

 const router = require('express').Router();
 const Controller = require('../controllers/index');
 const sampleSchemaValidator = require('../validators/sample');
 
 const invoiceController = new Controller('Invoice');
 const InvoiceService = require('../services/invoice/invoice.js');
 const verifyToken = require('../middlewares/verifyToken');
 const checkAccessRight = require('../middlewares/checkAccessRight');

 const invoiceService = new InvoiceService(invoiceController, sampleSchemaValidator);
 
 try {
     router.use('/', verifyToken, checkAccessRight,
     router
         .post('/', async (request, response, next) => {
             request.payload = await invoiceService.createRecord(request, next);
             next();
         })
         .get('/', async (request, response, next) => {
             request.payload = await invoiceService.readRecordsByFilter(request, next);
             next();
         })
         .get('/:id', async (request, response, next) => {
             request.payload = await invoiceService.readRecordById(request, next);
             next();
         })
         .get('/search/:keys/:keyword', async (request, response, next) => {
             request.payload = await invoiceService.readRecordsByWildcard(request, next);
             next();
         })
         .put('/', async (request, response, next) => {
             request.payload = await invoiceService.updateRecords(request, next);
             next();
         })
         .put('/:id', async (request, response, next) => {
             request.payload = await invoiceService.updateRecordById(request, next);
             next();
         })
         .delete('/', async (request, response, next) => {
             request.payload = await invoiceService.deleteRecords(request, next);
             next();
         })
         .delete('/:id', async (request, response, next) => {
             request.payload = await invoiceService.deleteRecordById(request, next);
             next();
         }));
 } catch (e) {
     console.log(`[Route Error] /invoice: ${e.message}`);
 } finally {
     module.exports = router;
 }
 