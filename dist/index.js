"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// POST route to handle form submissions
app.post('/api/contact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, phone, subject, message } = req.body;
    // Create a transporter using Gmail SMTP (for example)
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: `
      Name: ${firstname} ${lastname}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
    };
    try {
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
