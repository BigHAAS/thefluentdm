import React, { useEffect } from 'react';

import ListDashboard from './listDashboard';
import NewDashboard from './newDashboard';

import Link from '@material-ui/core/Link';
import MoreIcon from '@material-ui/icons/MoreVert';
import { 
    Link as RouterLink, 
    Redirect, 
    Route,
    Switch,
    useRouteMatch,
} from "react-router-dom";
import { AppBar, makeStyles, Typography, Menu, MenuItem, IconButton, Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    homescreenBanner: {
        flexGrow: 1,
    },
    homescreenContent: {
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
    },
    title: {
        marginLeft: theme.spacing(2),
        display: 'block',
    },
    sectionDesktopOption: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        marginLeft: 'auto',
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}))

function Logout( { setToken } ) {
    useEffect(() => {
        setToken({});
    })
    return (
        <Redirect to="/login"/>
    );
}

export default function HomeScreen( {setToken } ) {
    const { url } = useRouteMatch();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleMainMobileClose = () => {
        setAnchorEl(null);
    }
    const handleMainMobileOpen = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const mobileMenuId = 'primary-menu';
    const renderMobileMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin= {{ vertical:'top', horizontal:'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal:'right' }}
            open={isMenuOpen}
            onClose={handleMainMobileClose}
        >
            <MenuItem>
                <Link component={RouterLink} to="/home/create-dashboard">New Dashboard</Link>
            </MenuItem>
            <MenuItem>
                <Link component={RouterLink} to={`${url}/list-dashboard`}>Load Dashboard</Link>
            </MenuItem>
            <MenuItem>
                <Link component={RouterLink} to="/logout">Logout</Link>
            </MenuItem>
        </Menu>
    );

    return (
        <div style={{height: '100%'}}>
            <div className={classes.homescreenBanner}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography className={classes.title} variant="h5" color='textPrimary' noWrap>
                            The Fluent DM
                        </Typography>
                        <div className={classes.sectionDesktop}>
                            <div className={classes.sectionDesktopOption}><Link color='textPrimary' component={RouterLink} to="/home/create-dashboard">New Dashboard</Link></div>
                            <div className={classes.sectionDesktopOption}><Link color='textPrimary' component={RouterLink} to={`${url}/list-dashboard`}>Load Dashboard</Link></div>
                            <div className={classes.sectionDesktopOption}><Link color='textPrimary' component={RouterLink} to="/logout">Logout</Link></div>
                        </div>
                        <div className={classes.sectionMobile}>
                            <IconButton 
                                aria-label="show more"
                                aria-controla={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMainMobileOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>
                        {renderMobileMenu}
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.homescreenContent}>
                <Switch>
                    <Route exact path={`${url}/create-dashboard`}>
                        <NewDashboard />
                    </Route>
                    <Route exact path={`${url}/list-dashboard`}>
                        <ListDashboard />
                    </Route>
                    <Route path="/logout">
                        <Logout exact setToken={setToken}/>
                    </Route>
                </Switch>
            </div>
        </div>
    );
}