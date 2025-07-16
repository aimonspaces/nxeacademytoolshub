const mongoose = require('mongoose');

const ScriptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for your script'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for your script'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the script content'],
    },
    language: {
      type: String,
      required: [true, 'Please specify the programming language'],
      enum: [
        'javascript',
        'python',
        'java',
        'csharp',
        'cpp',
        'php',
        'ruby',
        'go',
        'rust',
        'typescript',
        'bash',
        'powershell',
        'other',
      ],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stars: {
      type: Number,
      default: 0,
    },
    starredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    forks: {
      type: Number,
      default: 0,
    },
    forkedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    isNXEAcademyTool: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create index for search functionality
ScriptSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Script', ScriptSchema);