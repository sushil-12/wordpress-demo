const express = require('express');
const { getAllDomain } = require('../controllers/common/DomainOperation');
const router = express.Router();

router.get('/get-all-domains',getAllDomain );

module.exports = router;