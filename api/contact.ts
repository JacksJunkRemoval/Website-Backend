import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';
import Cors from 'cors';

dotenv.config();

// Initialize the cors middleware
const cors = Cors({
  methods: ['POST', 'OPTIONS'],
  origin: '*',  // Set this to your frontend domain for better security
});

// Helper method to wait for middleware to complete
function runMiddleware(req: VercelRequest, res: VercelResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { firstname, lastname, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
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
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email', error });
  }
}
