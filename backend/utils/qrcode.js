const QRCode = require("qrcode")

// Generate QR code for booking
exports.generateQRCode = async (bookingId) => {
  try {
    const qrData = {
      bookingId,
      timestamp: new Date().toISOString(),
      verified: true,
    }

    const qrString = JSON.stringify(qrData)
    const qrCodeBase64 = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: "M",
      type: "image/png",
      quality: 0.92,
      margin: 1,
      width: 256,
    })

    return qrCodeBase64
  } catch (error) {
    throw new Error("QR code generation failed: " + error.message)
  }
}

// Verify QR code
exports.verifyQRCode = (qrData) => {
  try {
    const data = JSON.parse(qrData)
    return {
      isValid: data.verified === true && data.bookingId && data.timestamp,
      bookingId: data.bookingId,
      timestamp: data.timestamp,
    }
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid QR code format",
    }
  }
}
