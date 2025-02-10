const Review = require('../models/reviews.js');
const User = require('../models/user.js')
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.js");


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send response with token and admin data
    res.status(200).json({
      token, 
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role  || 'admin', 
        profile_picture: admin.profile_picture,
      }
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

 console.log(comment,id)

  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.comment = comment;
    await review.save();

    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  
  const { id } = req.params;
  try {
    const review = await Review.findByPk(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();

    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller function to get all unverified tutors
exports.getUnverifiedTutors = async (req, res) => {
  try {
      // Fetch tutors with role='tutor' and isVerified=0
      const unverifiedTutors = await User.findAll({
          where: {
              role: 'tutor',
              isVerified: 0
          }
      });

      // Respond with the fetched data
      return res.status(200).json({
          success: true,
           unverifiedTutors
      });
  } catch (error) {
      console.error('Error fetching unverified tutors:', error);
      return res.status(500).json({
          success: false,
          message: 'An error occurred while fetching unverified tutors.',
      });
  }
};


// Get tutor Unverified tutor detail

exports.getTutorDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the tutor by ID
    const tutor = await User.findByPk(id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    return res.status(200).json({ tutor });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Approve Tutor
exports.approveTutor = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the tutor and update their isVerified status
    const tutor = await User.findByPk(id);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.isVerified = 1;
    await tutor.save();

    return res.status(200).json({ message: 'Tutor approved successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};



 



// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.findAll({
//       where: {
//         role: { [Op.not]: 'admin' },
//       },
//     });

//     res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// exports.verifyUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const tutor = await User.findByPk(id);
//     if (!tutor) return res.status(404).json({ message: 'User not found' });

//     tutor.isVerified = true;
//     await tutor.save();

//     res.status(200).json({ message: 'User verified successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };


// exports.createUser = async (req, res) => {
//   const { name, email, password, role, phoneNumber} = req.body;

//   try {
    
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User with this email already exists' });
//     }
//     const newUser = await User.create({
//       name,
//       email,
//       password,
//       role,
//       phoneNumber
//     });

//     res.status(201).json({ message: 'User created successfully', user: newUser });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// exports.deleteUser = async (req, res) => {
//   const { id } = req.body;

//   try {
//     const user = await User.findByPk(id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     await user.destroy();

//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

 
//                          //Reviews Portionss




// exports.getAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.findAll({
//       include: [
//         {
//           model: User,
//           as: 'parent',  
//           attributes: ['name', 'profilePicture'],  
//         },
//       ],
//     });

//     if (!reviews) {
//       return res.status(404).json({ message: 'No reviews found' });
//     }

//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error('Error fetching reviews:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.getReviewById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const review = await Review.findByPk(id, {
//       include: [
//         {
//           model: User,
//           as: 'parent',
//           attributes: ['name', 'profilePicture'],
//         }
//       ]
//     });

//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     res.status(200).json(review);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// exports.updateReview = async (req, res) => {
//   const { id } = req.params;
//   const { comment } = req.body;

//  console.log(comment,id)

//   try {
//     const review = await Review.findByPk(id);

//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }
//     review.comment = comment;
//     await review.save();

//     res.status(200).json({ message: 'Review updated successfully', review });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error updating review', error: error.message });
//   }
// };


// exports.deleteReview = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const review = await Review.findByPk(id);

//     if (!review) {
//       return res.status(404).json({ message: 'Review not found' });
//     }

//     await review.destroy();

//     res.status(200).json({ message: 'Review deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// exports.createReview = async (req, res) => {
//   const { tutor_id, parent_id, rating, comment } = req.body;

//   if (!rating || rating < 1 || rating > 5) {
//     return res.status(400).json({ message: 'Rating must be between 1 and 5' });
//   }

//   try {
//     const newReview = await Review.create({
//       tutor_id,
//       parent_id,
//       rating,
//       comment
//     });

//     res.status(201).json({ message: 'Review created successfully', review: newReview });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error creating review', error: error.message });
//   }
// };






