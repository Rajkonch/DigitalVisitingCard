const Card = require('./model');
const { generateQRCode } = require('../../utils/qrGenerator');

// ✅ Create Card (user linked + protected)
exports.createCard = async (req, res) => {
  try {
    const data = req.body;

    const slug = data.name.toLowerCase().replace(/\s+/g,'-') + '-' + Date.now();

    const qrCode = await generateQRCode(
      `${req.protocol}://${req.get('host')}/api/cards/${slug}`
    );

    const card = await Card.create({
      ...data,
      userId: req.user._id, // 👈 USER LINK
      slug,
      qrCodeUrl: qrCode
    });

    res.status(201).json(card);
  } catch(err) {
    console.log(err); // 👈 ADD THIS
  res.status(500).json({ message: err.message });
  }
};

// ✅ Get Card by Slug (QR scan + views count)
exports.getCard = async (req, res) => {
  try {
    const card = await Card.findOne({ slug: req.params.slug });

    if(!card) return res.status(404).json({ message: 'Card not found' });

    // 👇 COUNT INCREASE
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