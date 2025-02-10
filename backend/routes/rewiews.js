const express = require('express');
const router = express.Router();
const { addReview, getReviewsByTutor,getReviewsWithParentDetails,updateReview ,deleteReview} = require('../controller/reviewController.js');

// Route to add a review
router.post('/add', addReview);

// Route to get reviews by tutor_id
router.get('/tutor/:id', getReviewsByTutor);


router.get('/getallreviews', getReviewsWithParentDetails);

router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);
module.exports = router;
