import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import NavBar from './component/layout/Navbar';
import Landing from './component/layout/Landing';
import Register from './component/auth/Register'
import Login from './component/auth/Login'
import Alert from './component/layout/Alert'
import Dashboard from './component/dashboard/Dashboard'
import PrivateRoute from './component/routing/PrivateRoute'
import ProfileForm from './component/profile-form/ProfileForm';
import AddEducation from './component/profile-form/AddEducation';
import AddExperience from './component/profile-form/AddExperience'
import Profiles from './component/profile/Profiles'
import Test from './component/Test'
import Profile from './component/profile/Profile';


// Redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { loadUser } from './redux/actions/auth';
import setAuthToken from './redux/utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);


  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <NavBar />
          <Route style={{ overflow: 'hidden' }} exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/create-profile' component={ProfileForm} />
              <PrivateRoute exact path="/edit-profile" component={ProfileForm} />
              <PrivateRoute exact path="/add-education" component={AddEducation} />
              <PrivateRoute exact path="/add-experience" component={AddExperience} />
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />

              <Route exact path="/test" component={Test} />


            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>


  )
}

export default App;
