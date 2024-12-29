import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const verifyCaptcha = async (token) => {
  const secretKey = process.env.HCAPTCHA_SECRET_KEY;

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying hCaptcha:', error);
    throw new Error('Error communicating with hCaptcha service');
  }
};

export { verifyCaptcha };
