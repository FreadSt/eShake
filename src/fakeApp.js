import React, {useEffect} from 'react';
import Layout from "./components/layout";
import HomePage from "./containers/homePage";
import LoginPage from "./containers/loginPage";
import AgreementPage from "./containers/agreementPage";
import AccuseParty from "./containers/accuseParty";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';
import PrivateRoute from "./components/privateRoute";
import { ApolloProvider } from '@apollo/client';
import { client } from "./helpers/apiClient";
import './styles.scss';

const App1 = () => {
    return (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <Router basename="/admin">
                    <div className="App">
                        <Switch>
                            <Route exact path={'/login'} component={LoginPage}/>
                            {/*<Route path={'/restore-password'} component={RestorePassword}/>*/}
                            <PrivateRoute
                              exact
                              path={'/accusing-party/:type/:name/:id'}
                              component={AccuseParty}
                              key={'user'}
                            />
                            <PrivateRoute
                              exact
                              path={'/accused-party/:type/:name/:id'}
                              key={'provider'}
                              component={AccuseParty}
                            />
                            <PrivateRoute exact path={'/home'} component={HomePage} key={'home'}/>
                            <PrivateRoute exact path={'/agreement'} component={AgreementPage}/>
                            {/* <PrivateRoute exact path={'/settings'} component={SettingsPage}/> */}
                            <PrivateRoute exact path={'/'} component={HomePage}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>
        </ApolloProvider>
    )
}

export default App1;
