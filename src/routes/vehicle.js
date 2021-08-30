const router = require('express').Router();
const Controller = require('../controllers/index');
const vehicleSchemaValidator = require('../validators/vehicle');

const vehicleController = new Controller('Vehicle');
const VehicleService = require('../services/vehicle/vehicle');

const vehicleService = new VehicleService(vehicleController, vehicleSchemaValidator);

try {
    router
        .post('/', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.createRecord(request, next);
            next();
        })
        .get('/', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.updateRecords(request, next);
            next();
        })
        .put('/:id', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.updateRecordById(request, next);
            next();
        })
        .delete('/', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', verifyToken, async (request, response, next) => {
            request.payload = await vehicleService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /vehicle: ${e.message}`);
} finally {
    module.exports = router;
}
