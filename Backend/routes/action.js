var express = require("express");
const pool = require("../../../Private/db");
var router = express.Router();

/*GET specified all actions per dashboard*/
router.get('/get-dashboard-actions/:dashboardid',async(req,res) => {
    try {
        const query = 
        "SELECT public.\"Action\".actionid, public.\"Action\".name "+ 
            "FROM public.\"Action\" "+
        "LEFT OUTER JOIN public.\"DashboardActionList\" "+
            "ON public.\"Action\".actionid = public.\"DashboardActionList\".actionid "+
            "AND public.\"DashboardActionList\".dashboardid = $1";
        const actionList = await pool.query( 
            query,
            [req.params.dashboardid]
        );
        res.send(actionList.rows);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;