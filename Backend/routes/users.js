var express = require('express');
const pool = require("../../../Private/db");
var router = express.Router();

/* GET users listing for specific ID. */
router.post('/login', async(req, res, next) => {
  try{
    const { email, password } = req.body;
    const userList = await pool.query(
      "SELECT userid FROM public.\"Users\" WHERE email=$1 AND password=crypt($2, password);",
      [email,password]
    );
    res.send(userList.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

/* POST new users. */
router.post('/', async(req,res) => {
  try{
    const { email, password } = req.body;
    const newUser = await pool.query(
      "INSERT INTO public.\"Users\" (email,password) VALUES($1,crypt($2,gen_salt('bf'))) RETURNING userid;",
      [email, password]
    );
    res.send(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
