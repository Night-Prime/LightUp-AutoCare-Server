const router = require('express').Router();
const Controller = require('../controllers/index');
const sampleSchemaValidator = require('../validators/sample');

const vehicleController = new Controller('Vehicle');
const VehicleService = require('../services/vehicle/vehicle');

const vehicleService = new VehicleService(vehicleController, sampleSchemaValidator);

try {
    router
        .post('/', async (request, response, next) => {
            request.payload = await vehicleService.createRecord(request, next);
            next();
        })
        .get('/', async (request, response, next) => {
            request.payload = await vehicleService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', async (request, response, next) => {
            request.payload = await vehicleService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', async (request, response, next) => {
            request.payload = await vehicleService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', async (request, response, next) => {
            request.payload = await vehicleService.updateRecords(request, next);
            next();
        })
        .put('/:id', async (request, response, next) => {
            request.payload = await vehicleService.updateRecordById(request, next);
            next();
        })
        .delete('/', async (request, response, next) => {
            request.payload = await vehicleService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', async (request, response, next) => {
            request.payload = await vehicleService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /vehicle: ${e.message}`);
} finally {
    module.exports = router;
}
