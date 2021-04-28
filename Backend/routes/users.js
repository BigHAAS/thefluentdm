var express = require('express');
const pool = require("../../../Private/db");
var router = express.Router();

/* GET users listing. */
router.get('/', async(req, res, next) => {
  try{
    const userList = await pool.query(
      "SELECT * FROM Users",
      []
    );
    console.log(userList);
    res.send(userList);
  } catch (err) {
    console.error(err.message);
  }
});

/* POST unew users. */
router.post('/', async(req,res) => {
  try{
    const { email, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO public.\"Users\" (email,password) VALUES($1,crypt($2,gen_salt('bf')));",
      [email, password]
    );
  } catch (err) {
    console.error(err.message);
  }
  res.send("complete");
})
module.exports = router;
