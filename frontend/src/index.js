import ReactDOM from 'react-dom';

import Login from "./login-screen";
import HomeScreen from "./homeScreen";
import Dashboard from "./dashboard";
import useToken from './useToken';
import "./styles.css";

import {
    BrowserRouter as Router, 
    Redirect, 
    Route,
    Switch
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({ 
    palette: {
        primary: {
            main: '#ffb887',
        },
        secondary: {
            main: '#ffa9a9',
        },
    },
})

function App(){
    const { token, setToken } = useToken();

    return(
        <Switch>
            {
                !token && <Route path="/"> <Redirect exact from="/" to="/login"/></Route>
            }
            <Route exact path="/">
                <Redirect exact from="/" to="/home" />
            </Route>
            <Route exact path="/login">
                <Login setToken={setToken}/>  
            </Route>
            <Route path="/home">
                <HomeScreen setToken={setToken}/>
            </Route>
            <Route path="/dashboard/:dashboardname/:dashboardid">
                <Dashboard />
            </Route>
        </Switch>
    );
}


ReactDOM.render(
    <ThemeProvider theme={theme}>
    <Router>
    <App />
    </Router>
    </ThemeProvider>,
    document.getElementById('root')
);