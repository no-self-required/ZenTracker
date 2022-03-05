const router = require("express").Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.get("/profile", auth, async (req, res) => {
  console.log('req inside users profile', req)
  const user = await User.findById(req.user.id);

  console.log('user inside /users profile', user)
  res.json({
    id: user._id,
    username: user.username,
    email: user.email,
  });
});

router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.json("false, undefined token");
    }

    const verified = jwt.verify(token, 'secretcode123');
    // console.log('verified id?', verified)
    if (!verified) {
      return res.json("false, not verified");
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.json("false, undefined user");
    }

    return res.json(true);
  } catch {
    res.status(500).json({ msg: err.message });
  }
});

//add session to current user
router.put('/:id', async (req, res) => {
  await User.updateOne({_id: req.params.id}, req.body)
  // await User.findByIdAndUpdate({_id: req.params.id}, req.body)
})

module.exports = router;