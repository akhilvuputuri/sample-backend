
const router = require('express').Router();
const multer = require('multer');

const upload = multer({ dest: 'tmp/csv/' });
const {getUsers, uploadUsers} = require('./userController')


// get users
router.get('/users', getUsers);

// upload a user
router.post("/upload", upload.single('file'), uploadUsers);

module.exports = router;