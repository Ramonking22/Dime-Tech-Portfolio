const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, "../")));

// Nodemailer transporter (Gmail)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "dimetechacademy@gmail.com",
        pass: "rzlv kthr zpvx mzkz" // App Password
    }
});

// Contact form endpoint
app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    console.log("📩 Incoming form submission:", req.body);

    if (!name || !email || !message) {
        console.warn("⚠ Missing form fields");
        return res.status(400).send("All fields are required!");
    }

    const entry = `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n---\n`;

    // Save to messages.txt
    fs.appendFile("messages.txt", entry, (err) => {
        if (err) {
            console.error("❌ Error saving message to file:", err);
        } else {
            console.log("✅ Message saved to messages.txt");
        }
    });

    // Send email
    const mailOptions = {
        from: `"Portfolio Website" <dimetechacademy@gmail.com>`,
        to: "dimetechacademy@gmail.com",
        subject: "New Contact Form Message",
        text: `You have a new message from your website:\n\n${entry}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Email sending failed:", error);
            return res.status(500).send("Error sending email");
        }
        console.log("✅ Email sent successfully!");
        console.log("📨 Gmail response:", info.response);
        res.send("Message received and email sent successfully!");
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
