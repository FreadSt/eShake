import React from 'react';
import {Redirect, Route} from 'react-router-dom';

const PrivateRoute = ({component: Component, key, ...rest}) => {
    return(
        <Route
            {...rest}
            render={props =>
                localStorage.getItem('access-token') ? (
                    <Component key={key || ''} {...props}/>
                    ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {from: props.location}
                        }}
                    />
                )
            }
        />
    )
}

export default PrivateRoute;
