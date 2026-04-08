const QRCode = require('qrcode');

exports.generateQRCode = async (url) => {
  try {
    return await QRCode.toDataURL(url);
  } catch(err) {
    console.error(err);
    return null;
  }
};