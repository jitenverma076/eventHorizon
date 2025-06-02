const nodemailer = require("nodemailer")

// Create transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === "production") {
    // Use a real email service in production
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  } else {
    // Use Ethereal for development/testing
    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ethereal.user@ethereal.email",
        pass: "ethereal.pass",
      },
    })
  }
}

// Email templates
const templates = {
  welcome: (data) => ({
    subject: "Welcome to EventHorizon!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to EventHorizon, ${data.name}!</h2>
        <p>Thank you for joining EventHorizon, your gateway to amazing events.</p>
        <p><strong>Your referral code:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${data.referralCode}</code></p>
        <p>Share this code with friends and earn rewards when they make their first booking!</p>
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/events" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Browse Events</a>
        </div>
        <p>Happy exploring!</p>
      </div>
    `,
  }),

  "booking-confirmation": (data) => ({
    subject: "Booking Confirmed - EventHorizon",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Booking Confirmed!</h2>
        <p><strong>Booking ID:</strong> ${data.bookingId}</p>
        <h3>${data.eventTitle}</h3>
        <p><strong>Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> ${data.venue}</p>
        
        <h4>Tickets:</h4>
        <ul>
          ${data.tickets
            .map((ticket) => `<li>${ticket.quantity}x ${ticket.tierName} - $${ticket.pricePerTicket} each</li>`)
            .join("")}
        </ul>
        
        <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
        
        <p>Your tickets have been sent to your account. Please present your QR code at the event entrance.</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/bookings/${data.bookingId}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Booking</a>
        </div>
      </div>
    `,
  }),

  "booking-cancellation": (data) => ({
    subject: "Booking Cancelled - EventHorizon",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Booking Cancelled</h2>
        <p>Your booking <strong>${data.bookingId}</strong> for <strong>${data.eventTitle}</strong> has been cancelled.</p>
        <p><strong>Refund Amount:</strong> $${data.refundAmount}</p>
        <p>Your refund will be processed within ${data.processingDays} business days.</p>
        <p>If you have any questions, please contact our support team.</p>
      </div>
    `,
  }),

  "waitlist-notification": (data) => ({
    subject: "Tickets Available - Your Waitlist Alert!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Great News, ${data.userName}!</h2>
        <p>Tickets are now available for the event you've been waiting for:</p>
        <h3>${data.eventTitle}</h3>
        <p><strong>Ticket Tier:</strong> ${data.ticketTier}</p>
        <p><strong>Event Date:</strong> ${new Date(data.eventDate).toLocaleDateString()}</p>
        
        <div style="margin: 30px 0;">
          <a href="${process.env.CLIENT_URL}/events/${data.eventId}" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Book Now</a>
        </div>
        
        <p><strong>Hurry!</strong> This notification expires in 24 hours.</p>
      </div>
    `,
  }),
}

// Send email function
exports.sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter()

    let mailOptions

    if (template && templates[template]) {
      const templateContent = templates[template](data)
      mailOptions = {
        from: process.env.EMAIL_FROM || "EventHorizon <noreply@eventhorizon.com>",
        to,
        subject: templateContent.subject,
        html: templateContent.html,
      }
    } else {
      mailOptions = {
        from: process.env.EMAIL_FROM || "EventHorizon <noreply@eventhorizon.com>",
        to,
        subject,
        html: data,
      }
    }

    const info = await transporter.sendMail(mailOptions)

    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info))
    }

    return info
  } catch (error) {
    console.error("Email sending failed:", error)
    throw error
  }
}

// Send bulk emails
exports.sendBulkEmail = async (recipients, { subject, template, data }) => {
  const promises = recipients.map((recipient) =>
    this.sendEmail({
      to: recipient.email,
      subject,
      template,
      data: { ...data, ...recipient },
    }),
  )

  return Promise.allSettled(promises)
}
