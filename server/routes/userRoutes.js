const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { authenticateToken } = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Category = require('../models/Category');

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, async (req, res) => {
    console.log(req.user);
    try{ 
        const {newPassword,oldPassword} = req.body;
        console.log(req.body);

        const user = await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({error:'User not found'});
        }

        // if(req.user.password !== oldPassword){
        //     return res.status(400).json({error:'Invalid old password'});
        // }

        await User.updateOne({ _id: req.user._id }, { $set: { password: newPassword } });

        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({message:'Password changed successfully',token});
    }
    catch(error){
        console.error('Change password error:', error);
        res.status(500).json({error:'Server error'});
    }

});

router.get('/all',async(req,res)=>{
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(error){
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
})

// @route   DELETE /api/users/delete-account
// @desc    Delete user account
// @access  Private
router.post('/delete-account', async (req, res) => {
    console.log(req.user);
    console.log(req.body);
    try {
        const { password,email } = req.body;
        
        if (!password) {
            return res.status(400).json({ error: 'Password is required' });
        }
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        
        // Get the user with password for verification
        const user = await User.findOne({ email })
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password
        const isMatch = user.password === password; // Using direct comparison since passwords aren't hashed
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Delete all user data in a transaction

        // Delete the user
        await User.deleteOne({ email });

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
