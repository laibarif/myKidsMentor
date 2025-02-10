const Review = require('../models/reviews.js');
const User = require('../models/user.js')




const addReview = async (req, res) => {
  const { tutor_id, parent_id, rating, comment } = req.body;

 
console.log(rating,comment)
  try {
    const newReview = await Review.create({
      tutor_id,
      parent_id,
      rating,
      comment
    });
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

const getReviewsByTutor = async (req, res) => {
    const tutorId = req.params.id;
  
    try {
      
      const reviews = await Review.findAll({
        where: { tutor_id: tutorId },
        include: {
          model: User,
          as: 'parent', 
          attributes: ['name', 'profilePicture'], 
        }
      });
  
      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this tutor' });
      }
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
  };
  



  const getReviewsWithParentDetails = async (req, res) => {
    try {
      const reviews = await Review.findAll({
        include: [
          {
            model: User,
            as: 'parent',  // Alias for parent
            attributes: ['name', 'profilePicture'],  // Selecting parent details
          },
        ],
      });
  
      // Check if reviews are found
      if (!reviews) {
        return res.status(404).json({ message: 'No reviews found' });
      }
  
      // Return the reviews along with parent details
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };



  const updateReview = async (req, res) => {
    const reviewId = req.params.id; 
    const { rating, comment } = req.body; 
  
    
    const userId = req.user.id;   // send user.id from parent from token
  
    // Validate input fields
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      const review = await Review.findOne({ where: { id: reviewId } });
  
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
        if (review.parent_id !== userId) {
        return res.status(403).json({ message: 'You are not authorized to update this review' });
      }
  
  
      review.rating = rating;
      review.comment = comment;
      await review.save();
  
      res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  };
  
// Delete Review
const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.user.id;

  try {
    const review = await Review.findOne({ where: { id: reviewId } });

    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.parent_id !== userId) return res.status(403).json({ message: 'Unauthorized' });

    await review.destroy();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
};

module.exports = { addReview, getReviewsByTutor,getReviewsWithParentDetails ,updateReview ,deleteReview};
