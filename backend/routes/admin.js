const express = require('express');
const router = express.Router();
const { loginAdmin,getTutorDetails,approveTutor, updateReview, deleteReview, getUnverifiedTutors } = require('../controller/adminController.js');

const authMiddleware = require('../middleware/authMiddleware.js');
const roleMiddleware = require('../middleware/roleMiddleware.js');

router.post("/login", loginAdmin);

router.put('/userReviewsByAdmin/:id'
    // , authMiddleware, roleMiddleware('admin'),
,     updateReview);


router.delete('/userReviewsByAdmin/:id',
    //  authMiddleware, roleMiddleware('admin'), 
     deleteReview);

router.get('/unverified-tutors', getUnverifiedTutors);


router.get('/getUnverifiedTutors/:id', getTutorDetails);

router.post('/approve-tutor/:id', approveTutor);

// router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);

// router.post('/create-user',authMiddleware,roleMiddleware('admin'),createUser)

// router.delete('/delete-user',authMiddleware,roleMiddleware('admin'),deleteUser)

// router.put('/verify-users/:id', authMiddleware, roleMiddleware('admin'), verifyUser);

// router.get('/allreviewsByAdmin', authMiddleware, roleMiddleware('admin'), getAllReviews); 
// router.get('/userReviewsByAdmin/:id', authMiddleware, roleMiddleware('admin'), getReviewById); 
 
 
// router.post('/userReviewsByAdmin', authMiddleware, roleMiddleware('admin'), createReview); 

module.exports = router;
