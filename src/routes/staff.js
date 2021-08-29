const router = require('express').Router();
const Controller = require('../controllers/index');
const sampleSchemaValidator = require('../validators/sample');

const staffController = new Controller('Staff');
const StaffService = require('../services/staff/staff');

const staffService = new StaffService(staffController, sampleSchemaValidator);

try {
    router
        .post('/signup', async (request, response, next) => {
            request.payload = await staffService.createRecord(request, next);
            next();
        })
        .post('/login', async (request, response, next) => {
            const { email, password } = request.body;
            const [user] = await staffController.model
                .findOne({ email: `${email}` }, 'name role')
                .exec();
            if (user) {
                await bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        const token = jwt.sign(
                            { _id: user.id, email: user.email },
                            process.env.secret_token,
                            { expiresIn: '24h' }
                        );

                        return response.status(200).json({
                            message: 'Successfully logged in',
                            payload: user,
                            token: token,
                        });
                    } else {
                        const error = {
                            status: 401,
                            error: 'Check password',
                            payload: null,
                        };
                        next(error);
                    }
                });
            } else {
                next();
            }
        });

    router.use(
        '/',
        verifyToken,
        router
            .get('/', async (request, response, next) => {
                request.payload = await staffService.readRecordsByFilter(request, next);
                next();
            })
            .get('/:id', async (request, response, next) => {
                request.payload = await staffService.readRecordById(request, next);
                next();
            })
            .get('/search/:keys/:keyword', async (request, response, next) => {
                request.payload = await staffService.readRecordsByWildcard(request, next);
                next();
            })
            .put('/', async (request, response, next) => {
                request.payload = await staffService.updateRecords(request, next);
                next();
            })
            .put('/:id', async (request, response, next) => {
                request.payload = await staffService.updateRecordById(request, next);
                next();
            })
            .delete('/', async (request, response, next) => {
                request.payload = await staffService.deleteRecords(request, next);
                next();
            })
            .delete('/:id', async (request, response, next) => {
                request.payload = await staffService.deleteRecordById(request, next);
                next();
            })
    );
} catch (e) {
    console.log(`[Route Error] /sample: ${e.message}`);
} finally {
    module.exports = router;
}
