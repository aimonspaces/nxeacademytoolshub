const express = require('express');
const router = express.Router();
const Script = require('../models/Script');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/scripts
 * @desc    Create a new script
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, content, language, tags, isPublic } = req.body;

    // Create new script
    const script = await Script.create({
      title,
      description,
      content,
      language,
      tags: tags || [],
      author: req.user._id,
      isPublic: isPublic !== undefined ? isPublic : true,
      isNXEAcademyTool: req.user.role === 'admin' ? req.body.isNXEAcademyTool : false,
    });

    // Add script to user's scripts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { scripts: script._id },
    });

    res.status(201).json({
      success: true,
      script,
    });
  } catch (error) {
    console.error('Script creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/scripts
 * @desc    Get all public scripts with pagination and filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = { isPublic: true };
    
    // Filter by language
    if (req.query.language) {
      query.language = req.query.language;
    }
    
    // Filter by tags
    if (req.query.tag) {
      query.tags = { $in: [req.query.tag] };
    }
    
    // Filter NXE Academy tools
    if (req.query.nxeTools === 'true') {
      query.isNXEAcademyTool = true;
    }
    
    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Get scripts with pagination
    const scripts = await Script.find(query)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Script.countDocuments(query);

    res.json({
      success: true,
      scripts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Scripts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching scripts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/scripts/nxe-tools
 * @desc    Get all NXE Academy tools
 * @access  Public
 */
router.get('/nxe-tools', async (req, res) => {
  try {
    const nxeTools = await Script.find({ isNXEAcademyTool: true, isPublic: true })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      nxeTools,
    });
  } catch (error) {
    console.error('NXE tools fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching NXE Academy tools',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/scripts/user/:userId
 * @desc    Get all public scripts by a specific user
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const scripts = await Script.find({
      author: req.params.userId,
      isPublic: true,
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      scripts,
    });
  } catch (error) {
    console.error('User scripts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user scripts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/scripts/my-scripts
 * @desc    Get all scripts created by the logged-in user
 * @access  Private
 */
router.get('/my-scripts', protect, async (req, res) => {
  try {
    const scripts = await Script.find({ author: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      scripts,
    });
  } catch (error) {
    console.error('My scripts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your scripts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   GET /api/scripts/:id
 * @desc    Get a script by ID
 * @access  Public/Private (depends on script visibility)
 */
router.get('/:id', async (req, res) => {
  try {
    const script = await Script.findById(req.params.id)
      .populate('author', 'username avatar bio');

    if (!script) {
      return res.status(404).json({
        success: false,
        message: 'Script not found',
      });
    }

    // Check if script is private and user is not the author
    const userId = req.user ? req.user._id : null;
    if (!script.isPublic && (!userId || script.author._id.toString() !== userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'This script is private',
      });
    }

    res.json({
      success: true,
      script,
    });
  } catch (error) {
    console.error('Script fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   PUT /api/scripts/:id
 * @desc    Update a script
 * @access  Private (script owner or admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: 'Script not found',
      });
    }

    // Check if user is the script author or an admin
    if (
      script.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this script',
      });
    }

    const { title, description, content, language, tags, isPublic } = req.body;

    // Update script
    const updatedScript = await Script.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(title && { title }),
          ...(description && { description }),
          ...(content && { content }),
          ...(language && { language }),
          ...(tags && { tags }),
          ...(isPublic !== undefined && { isPublic }),
          ...(req.user.role === 'admin' && 
              req.body.isNXEAcademyTool !== undefined && 
              { isNXEAcademyTool: req.body.isNXEAcademyTool }),
        },
      },
      { new: true }
    ).populate('author', 'username avatar');

    res.json({
      success: true,
      script: updatedScript,
    });
  } catch (error) {
    console.error('Script update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   DELETE /api/scripts/:id
 * @desc    Delete a script
 * @access  Private (script owner or admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: 'Script not found',
      });
    }

    // Check if user is the script author or an admin
    if (
      script.author.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this script',
      });
    }

    // Remove script from user's scripts array
    await User.findByIdAndUpdate(script.author, {
      $pull: { scripts: script._id },
    });

    // Delete script
    await script.deleteOne();

    res.json({
      success: true,
      message: 'Script deleted successfully',
    });
  } catch (error) {
    console.error('Script deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/scripts/:id/star
 * @desc    Star/unstar a script
 * @access  Private
 */
router.post('/:id/star', protect, async (req, res) => {
  try {
    const script = await Script.findById(req.params.id);

    if (!script) {
      return res.status(404).json({
        success: false,
        message: 'Script not found',
      });
    }

    // Check if script is already starred by user
    const isStarred = script.starredBy.includes(req.user._id);

    if (isStarred) {
      // Unstar script
      await Script.findByIdAndUpdate(req.params.id, {
        $pull: { starredBy: req.user._id },
        $inc: { stars: -1 },
      });

      res.json({
        success: true,
        message: 'Script unstarred successfully',
        isStarred: false,
      });
    } else {
      // Star script
      await Script.findByIdAndUpdate(req.params.id, {
        $push: { starredBy: req.user._id },
        $inc: { stars: 1 },
      });

      res.json({
        success: true,
        message: 'Script starred successfully',
        isStarred: true,
      });
    }
  } catch (error) {
    console.error('Script star error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starring/unstarring script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * @route   POST /api/scripts/:id/fork
 * @desc    Fork a script
 * @access  Private
 */
router.post('/:id/fork', protect, async (req, res) => {
  try {
    const originalScript = await Script.findById(req.params.id);

    if (!originalScript) {
      return res.status(404).json({
        success: false,
        message: 'Script not found',
      });
    }

    // Check if script is private and user is not the author
    if (
      !originalScript.isPublic &&
      originalScript.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Cannot fork a private script',
      });
    }

    // Create forked script
    const forkedScript = await Script.create({
      title: `${originalScript.title} (Forked)`,
      description: originalScript.description,
      content: originalScript.content,
      language: originalScript.language,
      tags: originalScript.tags,
      author: req.user._id,
      isPublic: true,
      isNXEAcademyTool: false,
    });

    // Add script to user's scripts array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { scripts: forkedScript._id },
    });

    // Increment fork count on original script
    await Script.findByIdAndUpdate(req.params.id, {
      $push: { forkedBy: req.user._id },
      $inc: { forks: 1 },
    });

    res.status(201).json({
      success: true,
      script: forkedScript,
      message: 'Script forked successfully',
    });
  } catch (error) {
    console.error('Script fork error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while forking script',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;