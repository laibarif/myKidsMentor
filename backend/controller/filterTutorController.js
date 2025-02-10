const { Op } = require('sequelize');
const User = require('../models/user.js');

exports.filterTutors = async (req, res) => {
  try {
    const { subjectsTaught, gradesHandled, availability, hourlyRates, city } = req.query;
    console.log(subjectsTaught, gradesHandled, availability, hourlyRates, city);

    let conditions = [];
    
    // Always include the role condition
    const roleCondition = { role: 'tutor' };

    // Filter by subjectsTaught with regex
    if (subjectsTaught) {
      conditions.push({
        subjectsTaught: {
          [Op.regexp]: subjectsTaught,
        },
      });
    }

    // Filter by gradesHandled with regex
    if (gradesHandled) {
      conditions.push({
        gradesHandled: {
          [Op.regexp]: gradesHandled,
        },
      });
    }

    // Filter by city
    if (city) {
      const sanitizedCity = city.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
      conditions.push({
        city: {
          [Op.regexp]: `^${sanitizedCity}$`,
        },
      });
    }

    // Filter by availability with regex
    if (availability) {
      let availabilityList;
      try {
        availabilityList = typeof availability === 'string' ? JSON.parse(availability) : availability;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid availability format. It must be a valid JSON string representing an array.',
        });
      }

      const availabilityRegex = availabilityList
        .map(item => `${item.day}.*${item.time}`)
        .join('|');

      conditions.push({
        availability: {
          [Op.regexp]: availabilityRegex,
        },
      });
    }

    // Filter by hourlyRates (exact match)
    if (hourlyRates) {
      const parsedRate = parseFloat(hourlyRates);
      if (isNaN(parsedRate)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid hourly rate. It must be a valid number.',
        });
      }

      conditions.push({
        hourlyRates: {
          [Op.eq]: parsedRate,
        },
      });
    }

    // Query the database
    const tutors = await User.findAll({
      where: {
        [Op.and]: [roleCondition],
        [Op.or]: conditions.length > 0 ? conditions : [roleCondition], // Ensure the query works even if no conditions are passed
      },
    });

    if (tutors.length > 0) {
      return res.status(200).json({
        success: true,
        data: tutors,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'No tutors found for the specified criteria',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};
