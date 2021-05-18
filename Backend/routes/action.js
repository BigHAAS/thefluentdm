var express = require("express");
const pool = require("../../../Private/db");
var router = express.Router();

/*GET specified all actions per dashboard*/
router.get('/get-dashboard-actions/:dashboardid',async(req,res) => {
    try {
        const query = 
        "SELECT public.\"Action\".actionid, public.\"Action\".name, public.\"Action\".type "+ 
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

router.post('/new-dashboard-action/diceRoller', async(req,res) => {
    try {
        const { actionName, actionType, dashboardid, position } = req.body;
        const insertActionQuery = "INSERT INTO public.\"Action\" (name, type) VALUES ($1,$2) RETURNING actionid";
        const action = await pool.query(
            insertActionQuery,
            [actionName,actionType]
        );
        const actionId = action.rows[0].actionid;

        const updateDashboardActionQuery = "UPDATE public.\"DashboardActionList\" SET position=position+1 WHERE dashboardid=$1"
        const updateDashboardAction = await pool.query(
            updateDashboardActionQuery,
            [dashboardid]
        );

        const insertDashboardActionQuery = "INSERT INTO public.\"DashboardActionList\" (dashboardid, actionid,position) VALUES ($1,$2,$3)";
        const dashboardAction = await pool.query(
            insertDashboardActionQuery,
            [dashboardid,actionId,position]
        );
        if(actionType===1){
            const insertDiceRollerQuery = "INSERT INTO public.\"DiceRoller\" (actionid) VALUES ($1)";
            const diceRoller = await pool.query(
                insertDiceRollerQuery,
                [actionId]
            );
        }
        res.send("complete");
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;