const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../common/jwt_config")
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateUser } = require("../model/user");

router.post("/join", async (req, res, next) => {
    const { name, email, password } = req.body;
    if (validateUser(req.body).error) {
        res.status(400).json({ result: false });
        next();
        return;
    }
    const saltRound = 10;
    const hashedPW = await bcrypt.hash(password, saltRound);
    const user = new User({ name, email, password: hashedPW });
    const saveResult = await user.save();
    res.json({ result: true });
    next();
});

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    const DB_user = await User.findOne({ email: email });
    if (!DB_user) {
        res.json({ result: false });
        next();
        return;
    }
    const result = await bcrypt.compare(password, DB_user.password);
    if (result) { // 비번이 맞으면 토큰 발행
        const token = jwt.sign(
            { id: DB_user._id, name: DB_user.name, email: DB_user.email, admin: DB_user.admin },
            jwtSecret,
            { expiresIn: "20m" }
        );
        res.json({ result: true, token, admin: DB_user.admin });
    } else {
        res.status(400).json({ result: false });
        next();
    }
});

router.get("/email", async (req, res, next) => {
    const email = req.query.email;
    const DB_user = await User.findOne({ email });
    if (DB_user) {
        res.json({ result: false });
    } else {
        res.json({ result: true });
    }
    next();
})

module.exports = router;