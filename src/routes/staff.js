const router = require('express').Router();

const Controller = require('../controllers/index');
const StaffService = require('../services/staff/staff');

const staffSchemaValidator = require('../validators/staff');
const { checkAdminAccess, verifyToken } = require('../middlewares/permission');

const staffController = new Controller('Staff');
const staffService = new StaffService(staffController, staffSchemaValidator);

try {
    router
        .post('/signup', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.createRecord(request, next);
            next();
        })
        .put('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.updateRecordById(request, next);
            next();
        })
        .put('/password/create', verifyToken, async (request, response, next) => {
            request.payload = await staffService.createPassword(request, next);
            next();
        })
        .post('/login', async (request, response, next) => {
            request.payload = await staffService.authenticateUser(request, next);
            next();
        })
        .get('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.readRecordById(request, next);
            next();
        })
        .get(
            '/search/:keys/:keyword',
            verifyToken,
            checkAdminAccess,
            async (request, response, next) => {
                request.payload = await staffService.readRecordsByWildcard(request, next);
                next();
            }
        )
        .put('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.updateRecords(request, next);
            next();
        })

        .delete('/', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', verifyToken, checkAdminAccess, async (request, response, next) => {
            request.payload = await staffService.deleteRecordById(request, next);
            next();
        });
} catch (e) {
    console.log(`[Route Error] /staff: ${e.message}`);
} finally {
    module.exports = router;
}
