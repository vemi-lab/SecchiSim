const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure Nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service (e.g., Gmail, SendGrid)
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password", // Replace with your email password or app password
  },
});

// Function to send email reminders
exports.sendEmailReminders = functions.pubsub.schedule("0 9 1,31 3 *") // 9 AM on March 1st and 31st
  .timeZone("America/New_York") // Set your timezone
  .onRun(async (context) => {
    const usersSnapshot = await admin.firestore().collection("users").get();

    const emailPromises = [];
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const email = userData.personal?.email;

      if (email) {
        const mailOptions = {
          from: "your-email@gmail.com",
          to: email,
          subject: "Reminder: Complete Your Course Materials",
          text: `
            Dear ${userData.personal?.fullName || "User"},
            
            This is a friendly reminder to complete your course materials for the year.
            Please ensure all materials are completed by the end of March.

            Thank you,
            Lake Stewards of Maine
          `,
        };

        emailPromises.push(transporter.sendMail(mailOptions));
      }
    });

    await Promise.all(emailPromises);
    console.log("Email reminders sent successfully.");
  });
