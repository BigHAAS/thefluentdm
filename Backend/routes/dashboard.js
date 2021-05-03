var express = require("express");
const pool = require("../../../Private/db");
var router = express.Router();

/*POST new dashboard */
router.post('/', async(req, res) => {
    try {
        console.log(req.body);
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
router.get('/list-dashboards/:userid',async(req,res) => {
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

/*GET specified dashboard*/
router.get('/get-dashboard/:dashboardid',async(req,res) => {
    try {
        const dashboard = await pool.query( 
            "SELECT * FROM public.\"Dashboard\" WHERE dashboardid=$1;",
            [req.params.dashboardid]
        );
        res.send(dashboard.rows[0]);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;