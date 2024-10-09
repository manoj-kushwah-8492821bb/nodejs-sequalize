const router = require("express").Router();
const adminRouter = require("./admin.route");
const authRouter = require("./auth.route");
const userRouter = require("./user.route");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);

module.exports = router;
