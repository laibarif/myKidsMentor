// authController.js

const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

exports.registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phoneNumber,
    gender,
    subjectsTaught,
    gradesHandled,
    teachingExperience,
    hourlyRates,
    availability,
    qualifications,
    city,
    postcode
  } = req.body;

  console.log(name,
    email,
    password,
    role,
    phoneNumber,
    gender,
    subjectsTaught,
    gradesHandled,
    teachingExperience,
    hourlyRates,
    availability,
    qualifications,
    city,
    postcode)
  let finalSubjectsTaught = req.body.subjectsTaught ? req.body.subjectsTaught : [];
  let finalGradesHandled = req.body.gradesHandled ? req.body.gradesHandled : [];

   // Check if required fields are missing
   const missingFields = [];

   const requiredFields = ['name', 'email', 'password', 'phoneNumber'];
   
   // Check each required field for presence
   requiredFields.forEach(field => {
     if (!req.body[field] || req.body[field].trim() === "") {
       missingFields.push(field);
     }
   });
 
   // If there are missing fields, send a response with the missing fields
   if (missingFields.length > 0) {
     return res.status(400).json({
       message: "All required fields must be provided",
       missingFields: missingFields
     });
   }
   
  try {
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    let profilePictureUrl = null;
    let certificationsUrl = [];

    if (req.files?.profilePicture) {
      const profilePicture = req.files.profilePicture[0];
      profilePictureUrl = profilePicture.filename;  

    }

    // Save certifications
    if (req.files?.certifications) {
      certificationsUrl = req.files.certifications.map(file => file.filename); 
    }

    let availabilityData = [];
    if (req.body.availability) {
      availabilityData = req.body.availability.map(item => {
        try {
          let parsedItem = JSON.parse(item);
          return parsedItem;
        } catch (error) {
          console.error("Error parsing availability item:", error);
          return null;  
        }
      }).filter(item => item !== null); 
    }
    const isVerified = role === "parent" ? 1 : 0; 
    await User.create({
      name,
      email,
      password,
      role,
      gender,
      phoneNumber,
      profilePicture: profilePictureUrl,
      qualifications,
      subjectsTaught: finalSubjectsTaught,
      gradesHandled: finalGradesHandled,
      teachingExperience,
      hourlyRates,
      availability: availabilityData,
      certifications: certificationsUrl,
      city,
      postcode,
      isVerified
    });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error registering user" });
  }
};
 

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Admin has not approved your account yet" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
