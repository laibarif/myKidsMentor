const  User  = require('../models/user.js')
const cloudinary = require('../config/cloudinaryConfig.js');
const fs = require('fs');

exports.getAllTutorProfiles = async (req, res) => {
  try {
    // Fetch all users with the role 'tutor'
    const tutors = await User.findAll({
      where: { role: 'tutor' }, // Ensure only tutors are fetched
      attributes: [
        'id',
        'name',
        'email',
        'phoneNumber',
        'profilePicture',
        'qualifications',
        'subjectsTaught',
        'gradesHandled',
        'certifications',
        'hourlyRates',
        'availability',
        'city',
        'postcode',
      ], // Select only the necessary fields
    });

    // Check if tutors exist
    if (tutors.length === 0) {
      return res.status(404).json({ message: 'No tutors found' });
    }

    // Return the list of tutors
    return res.status(200).json({ success: true, tutors });
  } catch (error) {
    console.error('Error fetching all tutor profiles:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getTutorProfile = async (req, res) => {
  try {
    const user = req.user;  // user is an object containing 'user' as a key with the actual data
    if (!user || !user.user || !user.user.dataValues) {
      return res.status(404).json({ message: 'User data not found' });
    }

    // Correctly access data within dataValues
    const id = user.user.dataValues.id; // Add id here
    const phoneNumber = user.user.dataValues.phoneNumber;
    const profilePicture = user.user.dataValues.profilePicture;
    const qualifications = user.user.dataValues.qualifications;
    const subjectsTaught = user.user.dataValues.subjectsTaught;
    const gradesHandled = user.user.dataValues.gradesHandled;
    const certifications = user.user.dataValues.certifications;
    const hourlyRates = user.user.dataValues.hourlyRates;
    const availability = user.user.dataValues.availability;
    const city = user.user.dataValues.city;
    const postcode = user.user.dataValues.postcode;

    // Construct tutor profile and include id
    const tutorProfile = {
      id, // Send id in the response
      phoneNumber,
      profilePicture,
      qualifications,
      subjectsTaught,
      gradesHandled,
      certifications,
      hourlyRates,
      availability,
      city,
      postcode,
    };

    return res.status(200).json(tutorProfile);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTutorProfileById = async (req, res) => {
  try {
    const { tutorId } = req.params; // Get tutorId from the route parameter

    // Fetch the tutor's profile by ID
    const tutor = await User.findByPk(tutorId); // Adjust this to your database query method

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Construct and return the tutor profile
    const tutorProfile = {
      id: tutor.id,
      name: tutor.name,
      phoneNumber: tutor.phoneNumber,
      profilePicture: tutor.profilePicture,
      qualifications: tutor.qualifications,
      subjectsTaught: tutor.subjectsTaught,
      gradesHandled: tutor.gradesHandled,
      certifications: tutor.certifications,
      hourlyRates: tutor.hourlyRates,
      availability: tutor.availability,
      city: tutor.city,
      postcode: tutor.postcode,
    };

    return res.status(200).json(tutorProfile);
  } catch (error) {
    console.error('Error fetching tutor profile:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTutorProfile = async (req, res) => {
  try {
    // Find the tutor by their ID
    const tutor = await User.findByPk(req.params.id);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    if (req.files?.profilePicture) {
      // Delete old profile picture if it exists
      if (tutor.profilePicture) {
        const oldProfilePicturePath = `uploads/${tutor.profilePicture}`;
        if (fs.existsSync(oldProfilePicturePath)) {
          fs.unlinkSync(oldProfilePicturePath);
        }
      }
    
      // Save the new profile picture filename
      const profilePicture = req.files.profilePicture[0];
      tutor.setDataValue('profilePicture', profilePicture.filename);
    
      console.log("Updated Profile Picture Field:", tutor.profilePicture);
    }
    
   


    // Handle availability data update (only if provided)
    if (req.body.availability) {
      const availabilityData = req.body.availability.map((item) => {
        try {
          return JSON.parse(item); // Parse stringified JSON
        } catch (error) {
          console.error("Error parsing availability item:", error);
          return null; // Ignore invalid items
        }
      }).filter((item) => item !== null);
      tutor.availability = availabilityData;
    }
  
    // Update other fields
    const updatableFields = [
      "name",
      "email",
      "phoneNumber",
      "qualifications",
      "subjectsTaught",
      "gradesHandled",
      "teachingExperience",
      "hourlyRates",
      "city",
      "postcode",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        let value = req.body[field];

        // Remove extra quotes for specific fields
        if (field === "qualifications" && typeof value === "string") {
          value = value.replace(/^"(.*)"$/, "$1"); // Remove surrounding quotes
        }

        // Split comma-separated values for specific fields
        if (["subjectsTaught", "gradesHandled"].includes(field) && typeof value === "string") {
          value = value.split(",").map((item) => item.trim());
        }

        tutor[field] = value;
      }
    });

    console.log("Before Save Profile Picture:", tutor.profilePicture);
await tutor.save();
console.log("Changed Fields After Setting Profile Picture:", tutor.changed());


    res.status(200).json({ message: "Profile updated successfully", tutor });
  } catch (error) {
    console.error("Error updating tutor profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Controller to add certificates
exports.addCertificate = async (req, res) => {
  try {
    const tutor = await User.findByPk(req.params.tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Log received files
    console.log("Files received:", req.files);
    const uploadedFiles = req.files?.certifications || [];

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Parse existing certifications or initialize as an empty array
    let existingCertifications = tutor.certifications || [];
    if (typeof existingCertifications === "string") {
      existingCertifications = JSON.parse(existingCertifications);
    }

    // Add new file names to certifications array
    uploadedFiles.forEach(file => {
      existingCertifications.push(file.filename);
    });

    // Save the updated certifications back to the database
    tutor.certifications = JSON.stringify(existingCertifications);
    await tutor.save();

    res.status(200).json({
      message: "Certificate uploaded successfully",
      certifications: existingCertifications,
    });
  } catch (error) {
    console.error("Error uploading certificate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getTutorCertificates = async (req, res) => {
  try {
    console.log(req.params.tutorId)
    // Find the tutor by their ID
    const tutor = await User.findByPk(req.params.tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Parse the certifications field if stored as a JSON string
    let certifications = tutor.certifications || [];
    if (typeof certifications === "string") {
      certifications = JSON.parse(certifications);
    }

    res.status(200).json({
      message: "Certificates retrieved successfully",
      certifications,
    });
  } catch (error) {
    console.error("Error fetching certifications:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteCertificate = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { certificate } = req.body; // Certificate to delete is sent in the body
console.log(certificate,tutorId)
    // Find the tutor by ID
    const tutor = await User.findByPk(tutorId);

    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    // Parse existing certifications
    let certifications = tutor.certifications || [];
    if (typeof certifications === "string") {
      certifications = JSON.parse(certifications);
    }

    // Check if the certificate exists in the array
    if (!certifications.includes(certificate)) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Remove the specified certificate
    certifications = certifications.filter((cert) => cert !== certificate);

    // Save the updated certifications back to the database
    tutor.certifications = JSON.stringify(certifications);
    await tutor.save();

    res.status(200).json({
      message: "Certificate deleted successfully",
      certifications, // Return the updated certifications array
    });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


