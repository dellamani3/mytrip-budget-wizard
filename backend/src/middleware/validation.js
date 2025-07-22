const { body } = require('express-validator');

// Validation rules for user registration
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
    
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
];

// Validation rules for user login
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for profile update
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
    
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be a valid object')
];

// Validation rules for trip planning
const validateTripPlanning = [
  body('destination')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Destination must be between 1 and 100 characters'),
    
  body('budget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
    
  body('travelers')
    .notEmpty()
    .withMessage('Number of travelers is required'),
    
  body('duration')
    .notEmpty()
    .withMessage('Trip duration is required'),
    
  body('travelStyle')
    .optional()
    .isIn(['adventure', 'cultural', 'relaxation', 'city', 'nature', 'luxury', 'budget'])
    .withMessage('Invalid travel style'),
    
  body('specialRequirements')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Special requirements must be less than 500 characters')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateTripPlanning
}; 