// routes/candidateRoutes.js
const express = require('express');
const { getCandidates, addCandidate, deleteCandidatebyID } = require('../controllers/candidateController');
const router = express.Router();
const upload = require('../middlewares/uploadImageMiddleware')

router.post('/add', upload.array('image'),addCandidate)

router.post('/', getCandidates);

router.post('/delete', deleteCandidatebyID);


module.exports = router;

