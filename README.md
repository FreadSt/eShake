!!!!COMMENTED ELEMENTS INSIDE agreement page!!!!


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


const App = () => {
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

                {
                  [
                    {img:avatarArr[0], 
                     name:"Bessie Cooper", 
                     disput:"Else",
                     mile:"3 milestones",
                     date:"28.08.2020",
                     agreement_name:"860 BUSD",
                    },
                    {img:avatarArr[1], 
                      name:"Bessie Cooper", 
                      disput:"Service Provider ignores my...",
                      mile:"6 milestones",
                      date:"26.08.2020",
                      agreement_name:"325 BUSD",
                    },
                    {img:avatarArr[2], 
                      name:"Theresa Webb", 
                      disput:"Service Provider ignores my...",
                      mile:"1 milestones",
                      date:"18.08.2020",
                      agreement_name:"150 BUSD",
                    }
                  ].map((item,index) => {
                    return(
                      <div className={'card'} key={index}>
                        <div className={'client'}>
                          <div className={'client-box'}>
                            <img src={item.img} className={'avatar'}/>
                            <div className={'client-title'}>
                              <div className={'name-box'}>
                                <h1 className={'name'}>{item.name}</h1>
                                <span className={'status'}>CLIENT</span>
                              </div>
                              <img src={rate} alt={''} className={'rate'}/>
                            </div>
                          </div>
                      
                          <div className={'client-about'}>
                            <h1>{item.disput}</h1>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                Quis vel at dictum...</p>
                          </div>
                        </div>

                        <div className='vl'/>

                        <div className={'agreement'}>
                          <div className={'inner-box'}>
                            <div className={'agreement-field'}>
                              <span className={'agreement-name'}>Agreement Name</span>
                              <span className={'number'}>{item.agreement_name}</span>
                            </div>

                            <div className='agreement-date'>
                              <div className='date-box'>
                                <img src={date} className={'date-img'}/>
                                <span className={'date'}>{item.date}</span>
                              </div>
                              <span>{item.mile}</span>
                            </div>
                          </div>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Quis vel at dictum nascetur nunc dui ultri dolor sit amet...</p>
                        </div>
                    </div>
                    )
                  })
                }

