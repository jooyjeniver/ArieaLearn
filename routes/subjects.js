const express = require('express');
const {
  getSubjects,
  getSubject,
  getSubjectModules
} = require('../controllers/subjects');

const router = express.Router();

router
  .route('/')
  .get(getSubjects);

router
  .route('/:id')
  .get(getSubject);

router
  .route('/:id/modules')
  .get(getSubjectModules);

module.exports = router;