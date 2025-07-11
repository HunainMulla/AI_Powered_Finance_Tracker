const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { aiService } = require('../services/aiService');

const router = express.Router();

// Chat with AI
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Messages array is required' 
      });
    }

    const result = await aiService.chat(messages);
    res.json(result);
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get financial advice
router.post('/advice', authenticateToken, async (req, res) => {
  try {
    const { context } = req.body;
    
    if (!context) {
      return res.status(400).json({ 
        success: false, 
        message: 'Context is required' 
      });
    }

    const result = await aiService.getFinancialAdvice(context);
    res.json(result);
  } catch (error) {
    console.error('AI Advice Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get financial advice' 
    });
  }
});

module.exports = router;
