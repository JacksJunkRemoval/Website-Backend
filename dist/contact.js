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
exports.default = handler;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }
        const { firstname, lastname, email, phone, subject, message } = req.body;
        // Create a transporter using Gmail SMTP
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
            return res.status(200).json({ message: 'Email sent successfully!' });
        }
        catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email', error });
        }
    });
}
