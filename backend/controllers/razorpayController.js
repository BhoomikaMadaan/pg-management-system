const Razorpay = require("razorpay");
const crypto   = require("crypto");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || "rzp_test_YourKeyHere",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "YourSecretHere",
});

// POST /api/payments/razorpay/order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100), // paise
      currency,
      receipt:  receipt || `rcpt_${Date.now()}`,
    });

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Razorpay order error:", err);
    res.status(500).json({ message: "Failed to create payment order" });
  }
};

// POST /api/payments/razorpay/verify
exports.verifyPayment = (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET || "YourSecretHere";

    const body      = razorpay_order_id + "|" + razorpay_payment_id;
    const expected  = crypto.createHmac("sha256", secret).update(body).digest("hex");
    const isValid   = expected === razorpay_signature;

    if (!isValid) return res.status(400).json({ success: false, message: "Invalid payment signature" });

    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};
