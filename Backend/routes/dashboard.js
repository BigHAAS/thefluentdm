var express = require("express");
const pool = require("../../../Private/db");
var router = express.Router();

/*POST new dashboard */
router.post('/', async(req, res) => {
    try {
        const { userid, name } = req.body;
        const newDashboard = await pool.query(
            "INSERT INTO public.\"Dashboard\" (userid,name) VALUES($1,$2) RETURNING dashboardid;",
            [userid, name]
        );
        res.send(newDashboard.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
});

/*GET all of users dashboard*/
router.get('/:userid',async(req,res) => {
    try {
        const userDashboardList = await pool.query( 
            "SELECT * FROM public.\"Dashboard\" WHERE userid=$1;",
            [req.params.userid]
        );
        res.send(userDashboardList.rows);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;