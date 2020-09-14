import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'

const Routes = () => (
  <Switch>
    <Route exact path="/home" component={Home} />
    <Route path="*" component={Login} />
  </Switch>
)

export default Routes
