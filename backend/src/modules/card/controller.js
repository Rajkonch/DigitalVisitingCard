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

// ✅ Publish/Save Card (Upsert: Create if doesn't exist, Update if it does)
exports.publishCard = async (req, res) => {
  try {
    const data = cleanData(req.body);
    const userId = req.user._id;

    if (!data.name) {
      return res.status(400).json({ message: "Full Name is required to publish." });
    }

    // Check if card exists for this user
    let card = await Card.findOne({ userId });

    if (!card) {
      // Create new card
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
      // Update existing card
      // Ensure QR code is stable: don't overwrite if it already exists
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

// ✅ Create Card (Legacy, keeping but mostly using publishCard now)
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

// ✅ Get Card by Slug (QR scan + views count)
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findOne({ slug: req.params.slug });

    if(!card) return res.status(404).json({ message: 'Card not found' });

    // 👇 COUNT INCREASE
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

    res.json(card);
  } catch(err) {
    console.log(err); // 👈 ADD THIS
  res.status(500).json({ message: err.message });
  }
};

// ✅ Get My Cards (admin panel)
exports.getMyCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user._id });
    res.json(cards);
  } catch (err) {
    console.log(err); // 👈 ADD THIS
  res.status(500).json({ message: err.message });
  }
};

// ✅ Update Card (only owner)
exports.updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) return res.status(404).json({ message: 'Card not found' });

    // 👇 OWNER CHECK
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
    console.log(err); // 👈 ADD THIS
  res.status(500).json({ message: err.message });
  }
};