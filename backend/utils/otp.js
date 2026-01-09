// Simple OTP generator and validator (for demo)
// In production, use a proper SMS service like Twilio

const otpStore = new Map();

const generateOTP = (phone) => {
  // For demo, use fixed OTP: 123456
  // In production, generate random 6-digit OTP
  const otp = process.env.NODE_ENV === 'production' 
    ? Math.floor(100000 + Math.random() * 900000).toString()
    : '123456';
  
  otpStore.set(phone, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
  });

  // Log OTP for demo (in production, send via SMS)
  console.log(`OTP for ${phone}: ${otp}`);
  
  return otp;
};

const verifyOTP = (phone, otp) => {
  const stored = otpStore.get(phone);
  
  if (!stored) {
    return { valid: false, error: 'OTP not found or expired' };
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return { valid: false, error: 'OTP expired' };
  }

  if (stored.otp !== otp) {
    return { valid: false, error: 'Invalid OTP' };
  }

  otpStore.delete(phone);
  return { valid: true };
};

module.exports = { generateOTP, verifyOTP };
