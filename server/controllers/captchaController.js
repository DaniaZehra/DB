import { verifyCaptcha } from '../services/captcha.js';

const verifyCaptchaController = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, error: 'Captcha token is missing' });
  }

  try {
    const data = await verifyCaptcha(token);

    if (data.success) {
      return res.json({ success: true });
    } else {
      return res.status(400).json({ success: false, error: data['error-codes'] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server error during captcha verification' });
  }
};

export { verifyCaptchaController };
