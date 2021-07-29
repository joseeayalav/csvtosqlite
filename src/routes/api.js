const express = require('express');
const router = express.Router();


//Import Controller Modules

const importController = require('../controllers/importController');
const searchController = require('../controllers/searchController');

//Routes

router.post('/import', importController.importFile);
router.get('/search',searchController.search)

module.exports = router;