const Card = require('./model');
const { generateQRCode } = require('../../utils/qrGenerator');

// Helper to remove immutables and blob URLs from payload
const cleanData = (obj) => {
  if (Array.isArray(obj)) return obj.map(cleanData);
  if (obj !== null && typeof obj === 'object') {
    const newObj = { ...obj };
    delete newObj._id;
    delete newObj.__v;
    delete newObj.userId;
    Object.keys(newObj).forEach(key => {
      // Prevent saving temporary blob URLs
      if (typeof newObj[key] === 'string' && newObj[key].startsWith('blob:')) {
        newObj[key] = '';
      } else {
        newObj[key] = cleanData(newObj[key]);
      }
    });
    return newObj;
  }
  return obj;
};

// Publish/Save Card (Upsert: Create if doesn't exist, Update if it does)
exports.publishCard = async (req, res) => {
  try {
    const data = cleanData(req.body);
    const userId = req.user._id;

    let card = await Card.findOne({ userId });

    if (!card) {
      if (!data.name) {
        return res.status(400).json({ message: "Full Name is required to publish a new profile." });
      }
      const slug = data.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
      
      const frontendUrl = process.env.FRONTEND_URL || 'https://digital-visiting-card-alpha.vercel.app';
      const qrCode = await generateQRCode(`${frontendUrl}/p/${slug}`);

      card = await Card.create({
        ...data,
        userId,
        slug,
        qrCodeUrl: qrCode
      });
      return res.status(201).json(card);
    } else {
      if (!card.qrCodeUrl) {
         const frontendUrl = process.env.FRONTEND_URL || 'https://digital-visiting-card-alpha.vercel.app';
         const qrCode = await generateQRCode(`${frontendUrl}/p/${card.slug}`);
         data.qrCodeUrl = qrCode;
      }

      const updatedCard = await Card.findOneAndUpdate(
        { userId },
        data,
        { new: true, runValidators: true }
      );
      
      if (!updatedCard) {
        return res.status(404).json({ message: "Card not found during update." });
      }

      return res.json(updatedCard);
    }
  } catch (err) {
    console.error("Publish Error:", err);
    res.status(500).json({ 
      message: "Server Error: " + err.message,
      error: err 
    });
  }
};

// Create Card (Legacy)
exports.createCard = async (req, res) => {
  try {
    const data = req.body;
    const slug = data.name.toLowerCase().replace(/\s+/g,'-') + '-' + Date.now();
    const frontendUrl = process.env.FRONTEND_URL || 'https://digital-visiting-card-alpha.vercel.app';

    const qrCode = await generateQRCode(
      `${frontendUrl}/p/${slug}`
    );

    const card = await Card.create({
      ...data,
      userId: req.user._id,
      slug,
      qrCodeUrl: qrCode
    });

    res.status(201).json(card);
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get Card by Slug (QR scan + views count)
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findOne({ slug: req.params.slug }).populate('userId', 'permission_active');

    if(!card) return res.status(404).json({ message: 'Card not found' });

    const today = new Date().setHours(0, 0, 0, 0);
    const lastView = card.lastViewDate ? new Date(card.lastViewDate).setHours(0, 0, 0, 0) : 0;
    
    if (today === lastView) {
      card.todayViewsCount += 1;
    } else {
      card.todayViewsCount = 1;
      card.lastViewDate = Date.now();
    }
    card.viewsCount += 1;
    await card.save();

    const permissionStatus = card.userId ? card.userId.permission_active : 0;

    res.json({
      ...card._doc,
      user_permission: permissionStatus
    });
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get My Cards
exports.getMyCards = async (req, res) => {
  try {
    let queryUserId = req.user._id;

    if (req.user.role === 'admin' && req.query.userId) {
      queryUserId = req.query.userId;
    }

    const cards = await Card.find({ userId: queryUserId });
    res.json(cards);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Update Card
exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) return res.status(404).json({ message: 'Card not found' });

    if (card.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await Card.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get Public Cards List (for Home Page Showcase)
exports.getPublicCards = async (req, res) => {
  try {
    // Find cards and populate user info to check activity
    const cards = await Card.find()
      .populate({
        path: 'userId',
        select: 'permission_active'
      })
      .limit(10);

    // Filter cards by active user permission
    const activeCards = cards.filter(card => card.userId && card.userId.permission_active === 1);
    
    res.json(activeCards);
  } catch (err) {
    console.error("Fetch Public Cards Error:", err);
    res.status(500).json({ message: err.message });
  }
};