const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Thêm crypto
const sendEmail = require('../utils/sendEmail'); // Thêm sendEmail

// Đăng ký
exports.register = async (req, res) => {
    try {
        const { email, password, ho_ten } = req.body;
        // 1. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 2. Tạo user mới
        const newUser = await User.create({
            email,
            password_hash,
            ho_ten
        });
        res.status(201).json({ message: "Đăng ký thành công!", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: "Lỗi đăng ký", error: error.message });
    }
};

// Đăng nhập
// backend/controllers/authController.js

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Email không tồn tại" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai mật khẩu" });
        }

        // === 1. THÊM "ho_ten" VÀO TOKEN ===
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role, 
                ho_ten: user.ho_ten // <-- THÊM DÒNG NÀY
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // === 2. THÊM "user" VÀO JSON TRẢ VỀ ===
        res.status(200).json({
            message: "Đăng nhập thành công",
            token,
            user: { // <-- THÊM OBJECT NÀY
                id: user.id,
                email: user.email,
                ho_ten: user.ho_ten,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server" });
    }
};
// Quên mật khẩu
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy email" });
        }

        // 1. Tạo token reset
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // 2. Lưu token vào DB (chỉ có hiệu lực 10 phút)
        user.reset_token = hashedToken;
        user.reset_token_expiry = Date.now() + 10 * 60 * 1000; // 10 phút
        await user.save();

        // 3. Gửi link reset qua email
        // Lưu ý: Link này trỏ đến trang frontend
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const message = `
            <p>Bạn nhận được email này vì bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu.</p>
            <p>Vui lòng click vào link sau để đặt lại mật khẩu:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>Link này sẽ hết hạn sau 10 phút.</p>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            message
        });

        res.status(200).json({ message: "Email đặt lại mật khẩu đã được gửi." });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Đặt lại mật khẩu
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // 1. Hash token từ URL để so sánh với DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // 2. Tìm user bằng token VÀ token chưa hết hạn
        const user = await User.findOne({
            where: {
                reset_token: hashedToken,
                // reset_token_expiry: { [Op.gt]: Date.now() } // Cần 'Op' từ sequelize
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }

        // Kiểm tra hết hạn (Sequelize Op.gt phức tạp, làm thủ công)
        if (user.reset_token_expiry < Date.now()) {
             return res.status(400).json({ message: "Token đã hết hạn" });
        }

        // 3. Đặt mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(password, salt);
        user.reset_token = null; // Xóa token
        user.reset_token_expiry = null;
        await user.save();

        res.status(200).json({ message: "Đặt lại mật khẩu thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};