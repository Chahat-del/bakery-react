// backend/routes/feedback.js
const express = require('express');
const router = express.Router();

// ========== QUESTION 7: FEEDBACK ROUTES (UPDATED WITH FIELD-SPECIFIC ERRORS) ==========

// Store feedback in memory (no database needed for now)
let feedbacks = [];

// @route   POST /api/feedback/submit
// @desc    Submit feedback form
// @access  Public
router.post('/submit', (req, res) => {
  try {
    const { name, email, phone, orderType, message } = req.body;
    
    console.log('📩 Feedback received:', req.body);
    
    // Object to store field-specific errors
    const errors = {};
    
    // Name validation
    if (!name || name.trim() === '') {
      errors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      errors.name = 'Name should contain only letters';
    }
    
    // Email validation
    if (!email || email.trim() === '') {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Phone validation (if provided)
    if (phone && phone.trim() !== '') {
      if (!/^[0-9]{10}$/.test(phone.trim())) {
        errors.phone = 'Phone must be exactly 10 digits';
      }
    }
    
    // Order type validation
    if (!orderType || orderType === '') {
      errors.orderType = 'Please select an order type';
    }
    
    // Message validation
    if (!message || message.trim() === '') {
      errors.message = 'Message is required';
    } else if (message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (message.trim().length > 500) {
      errors.message = 'Message cannot exceed 500 characters';
    }
    
    // If there are any errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ 
        success: false, 
        errors: errors
      });
    }
    
    // Create feedback object
    const feedback = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      orderType,
      message: message.trim(),
      date: new Date().toISOString()
    };
    
    // Store in memory
    feedbacks.push(feedback);
    
    console.log('✅ Feedback saved:', feedback);
    console.log('📊 Total feedbacks:', feedbacks.length);
    
    res.json({ 
      success: true, 
      message: 'Feedback submitted successfully!',
      data: feedback 
    });
    
  } catch (error) {
    console.error('❌ Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error occurred. Please try again.' 
    });
  }
});

// @route   GET /api/feedback/all
// @desc    Get all feedback submissions
// @access  Public (or protect with auth if needed)
router.get('/all', (req, res) => {
  try {
    res.json({ 
      success: true, 
      count: feedbacks.length,
      feedbacks 
    });
  } catch (error) {
    console.error('❌ Error getting feedbacks:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete a feedback (optional)
// @access  Public
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = feedbacks.findIndex(f => f.id === id);
    
    if (index === -1) {
      return res.status(404).json({ 
        success: false, 
        error: 'Feedback not found' 
      });
    }
    
    feedbacks.splice(index, 1);
    
    res.json({ 
      success: true, 
      message: 'Feedback deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting feedback:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// ========== END QUESTION 7 ==========

module.exports = router;