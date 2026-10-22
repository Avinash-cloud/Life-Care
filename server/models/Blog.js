const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  content: {
    type: String,
    required: [true, 'Please add content']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  featuredImage: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  readTime: {
    type: Number, // in minutes
    default: 5
  },
  // SEO Fields
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot be more than 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot be more than 160 characters']
  },
  metaKeywords: {
    type: String
  },
  canonicalUrl: {
    type: String
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Helper to calculate reading time from Lexical JSON or HTML
function calculateReadTime(content) {
  if (!content || typeof content !== 'string') return 1;
  let text = content;
  if ((content.startsWith('{') || content.startsWith('[')) && content.includes('"root"')) {
    try {
      const parsed = JSON.parse(content);
      const extract = (node) => {
        if (!node) return '';
        if (node.text) return node.text;
        if (Array.isArray(node.children)) return node.children.map(extract).join(' ');
        return '';
      };
      text = extract(parsed.root);
    } catch {
      text = content;
    }
  }
  text = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Pre-save hook: slug resolution, duplicate handling, publishedAt and readTime
blogSchema.pre('save', async function(next) {
  try {
    // 1. Slug handling: only generate from title if slug is empty
    let baseSlug = '';
    if (this.slug && this.slug.trim()) {
      baseSlug = this.slug
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    } else if (this.title) {
      baseSlug = this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (!baseSlug) baseSlug = 'blog-post';

    // Resolve duplicate slugs by checking existence in database
    if (this.isModified('slug') || this.isModified('title') || this.isNew) {
      let candidateSlug = baseSlug;
      let counter = 1;
      const BlogModel = this.constructor;
      while (await BlogModel.exists({ slug: candidateSlug, _id: { $ne: this._id } })) {
        candidateSlug = `${baseSlug}-${counter++}`;
      }
      this.slug = candidateSlug;
    }

    // 2. Set published date if status is changed to published
    if (this.status === 'published' && !this.publishedAt) {
      this.publishedAt = Date.now();
    }

    // 3. Auto-calculate read time
    if (this.isModified('content')) {
      this.readTime = calculateReadTime(this.content);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Virtual for comments (if implemented)
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog'
});

// Indexes for faster queries
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ categories: 1 });
blogSchema.index({ author: 1 });

module.exports = mongoose.model('Blog', blogSchema);