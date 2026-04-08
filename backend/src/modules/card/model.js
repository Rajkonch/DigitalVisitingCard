const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slug: { type: String, unique: true, required: true },
  
  // Profile Basics
  name: { type: String, required: true },
  designation: String,
  bio: String,
  cardType: { type: String, enum: ['business', 'shopkeeper'], default: 'business' },
  avatar: String,
  
  // Contact Info
  mobile: String,
  showMobile: { type: Boolean, default: true },
  email: String,
  showEmail: { type: Boolean, default: true },
  address: String,
  showAddress: { type: Boolean, default: true },

  // Design Theme
  themeColor: { type: String, default: '#00647b' },
  textColor: { type: String, default: '#1a1c1e' },
  subTextColor: { type: String, default: '#40484c' },
  bgColor: { type: String, default: '#f0f4f8' },
  bgPattern: { type: String, default: 'none' },

  // Dynamic Sections
  sectionOrder: [String],
  
  links: [{
    title: String,
    content: String,
    icon: String,
    isActive: { type: Boolean, default: true }
  }],

  products: [{
    title: String,
    price: String,
    offer: String,
    stock: String,
    icon: String,
    isActive: { type: Boolean, default: true },
    isOutOfStock: { type: Boolean, default: false }
  }],

  projects: [{
    type: { type: String },
    title: String,
    description: String,
    link: String,
    isActive: { type: Boolean, default: true }
  }],

  experience: [{
    company: String,
    role: String,
    start: String,
    end: String,
    isCurrent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  }],

  customHeadings: [{
    title: String,
    isActive: { type: Boolean, default: true },
    items: [{
      title: String,
      subtitle: String,
      isActive: { type: Boolean, default: true }
    }]
  }],

  dailyActivities: [{
    title: String,
    time: String,
    isActive: { type: Boolean, default: true }
  }],

  languages: [{
    name: String,
    isActive: { type: Boolean, default: true }
  }],

  hobbies: [{
    name: String,
    isActive: { type: Boolean, default: true }
  }],

  // Metadata
  qrCodeUrl: String,
  isActive: { type: Boolean, default: true },
  viewsCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Card', cardSchema);