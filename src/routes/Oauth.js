const router = require('express').Router();

try {
    router.get('/', (req, res) => {
        res.send('This Works!');
    });
} catch (e) {
    console.log(`Error at Route : ${e.message}`);
} finally {
    module.exports = router;
}
