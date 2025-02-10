const express = require("express");
const router = express.Router();
const {
  getTutorProfile,
  updateTutorProfile,
  getAllTutorProfiles,
  getTutorProfileById,
  addCertificate,
  getTutorCertificates,
  deleteCertificate
} = require("../controller/tutorController.js");
const authMiddleware = require("../middleware/authMiddleware.js");
const roleMiddleware = require("../middleware/roleMiddleware.js");
const upload = require("../config/multerConfig.js");

router.get("/allprofile", getAllTutorProfiles);

// Get tutor profile
router.get("/profile", authMiddleware, getTutorProfile);

router.get("/:tutorId", getTutorProfileById);

// Update tutor profile
router.put(
  "/profile/:id",
  authMiddleware,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "certifications", maxCount: 10 }
  ]),
//   roleMiddleware("tutor"),
  updateTutorProfile
);

//Add addCertifications


router.put(
  '/addcertificate/:tutorId',
  upload.fields([{ name: 'certifications', maxCount: 10 }]),
  addCertificate
);

router.get('/getCertificates/:tutorId', getTutorCertificates); 

router.delete('/deleteCertificate/:tutorId', deleteCertificate);


module.exports = router;


