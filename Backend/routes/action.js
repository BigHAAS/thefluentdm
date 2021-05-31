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
            "WHERE public.\"DashboardActionList\".dashboardid = $1";
        const actionList = await pool.query( 
            query,
            [req.params.dashboardid]
        );
        res.send(actionList.rows);
    } catch (error) {
        console.error(error.message);
    }
})

/*Create a new Action*/
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



/*Get DiceRoller Action*/
router.get('/diceroller/:actionid', async(req,res) => {
    try {
        const diceQuery ="SELECT dice FROM public.\"DiceRoller\" WHERE actionid=$1";
        const diceRollerDice = await pool.query(
            diceQuery,
            [req.params.actionid]
        );

        const encounterListQuery = 
        "SELECT public.\"Encounter\".description AS col2, public.\"EncounterActionList\".position AS col1 \n"+
            "FROM public.\"EncounterActionList\" \n"+
        "FULL OUTER JOIN public.\"Encounter\" \n"+
            "ON public.\"EncounterActionList\".encounterid = public.\"Encounter\".encounterid \n"+
        "WHERE public.\"EncounterActionList\".actionid=$1 \n"+
        "ORDER BY public.\"EncounterActionList\".position";
        const encounterList = await pool.query(
            encounterListQuery,
            [req.params.actionid]
        )
        const diceValue = (diceRollerDice.rows[0].dice===null) ? "" : diceRollerDice.rows[0].dice;
        res.send({diceValue:diceValue, diceEncounterArr:encounterList.rows });
    } catch (error) {
        console.error(error.message);
    }
})

router.put('/diceroller/update/:actionid', async(req,res) => {
    try {
        const { diceToBeSet } = req.body;
        const diceUpdateQuery = "UPDATE public.\"DiceRoller\" SET dice=$1 WHERE actionid=$2"
        const diceUpdate = await pool.query(
            diceUpdateQuery,
            [diceToBeSet,req.params.actionid]
        )
        res.send("Complete");
    } catch (error) {
        console.error(error.message);
    }
});

/*GET all encounters by user*/
router.get('/list-encounters/:userid',async(req,res) => {
    try {
        const query = 
        "SELECT public.\"Encounter\".encounterid, public.\"Encounter\".description "+ 
            "FROM public.\"Encounter\" "+
        "LEFT OUTER JOIN public.\"UserEncounterList\" "+
            "ON public.\"Encounter\".encounterid = public.\"UserEncounterList\".encounterid "+
            "WHERE public.\"UserEncounterList\".userid = $1";
        const encounterList = await pool.query( 
            query,
            [req.params.userid]
        );
        res.send(encounterList.rows);
    } catch (error) {
        console.error(error.message);
    }
})

/*POST new encounter*/
router.post('/new-encounter/:userid',async(req,res) => {
    try {
        const { description } = req.body;
        const insertEncounterQuery = "INSERT INTO public.\"Encounter\" (description) VALUES ($1) RETURNING encounterid";
        const encounterList = await pool.query( 
            insertEncounterQuery,
            [description]
        );
        const encounterID = encounterList.rows[0].encounterid;
        const insertUserEncounterListQuery = "INSERT INTO public.\"UserEncounterList\" (userid,encounterid) VALUES ($1,$2)";
        const insertUserEncounterList = await pool.query(
            insertUserEncounterListQuery,
            [req.params.userid,encounterID]
        )
        res.send(""+encounterID);
    } catch (error) {
        console.error(error.message);
    }
})

router.post('/new-encounter-action-rel', async(req,res) => {
    try {
        const { encounterid, actionid, position } = req.body;
        const deleteRelQuery = "DELETE FROM public.\"EncounterActionList\" WHERE actionid=$1 AND position=$2";
        const deleteRel = await pool.query(
            deleteRelQuery,
            [actionid,position]
        )
        const insertRelQuery = "INSERT INTO public.\"EncounterActionList\" (actionid,encounterid,position) VALUES ($1,$2,$3) RETURNING linkid";
        const insertRelList = await pool.query(
            insertRelQuery,
            [actionid,encounterid,position]
        )
        const linkID = insertRelList.rows[0].linkid;
        res.send(""+linkID);
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;