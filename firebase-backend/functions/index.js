const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Your Gmail
const gmailUser = "sachingautam0b@gmail.com";
const gmailPass = "zqya rzgq krtb drkd";  

// Setup mail transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

// Trigger when a ticket is created
exports.sendTicketEmail = functions.firestore
  .document("tickets/{ticketId}")
  .onCreate((snap, context) => {
    const data = snap.data();

    const mailOptions = {
      from: `Secure App <${gmailUser}>`,
      to: gmailUser,
      subject: `New Support Ticket from ${data.name}`,
      html: `
        <h2>📩 New Support Ticket</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
        <hr />
        <p>Status: <strong>${data.status}</strong></p>
      `,
    };

    return transporter.sendMail(mailOptions);
  });
