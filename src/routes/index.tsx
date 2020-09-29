import React from 'react'
import { Switch, Route, RouteProps } from 'react-router-dom'
import Layout from '../containers/Layout'

import Home from '../pages/Home'
import Cashier from '../pages/Cashier'
import Command from '../pages/Command'
import Delivery from '../pages/Delivery'
import Login from '../pages/Login'

interface RouteWithLayoutProps extends RouteProps {
  component: any
}

const RouteWithLayout = (props: RouteWithLayoutProps) => {
  const { component: Component, ...rest } = props
  return (
    <Route
      {...rest}
      render={(routeProps) => (
        <Layout>
          <Component {...routeProps} />
        </Layout>
      )}
    />
  )
}

const Routes = () => (
  <Switch>
    <RouteWithLayout exact path="/home" component={Home} />
    <RouteWithLayout exact path="/cashier" component={Cashier} />
    <RouteWithLayout exact path="/command" component={Command} />
    <RouteWithLayout exact path="/delivery" component={Delivery} />
    <Route path="*" component={Login} />
  </Switch>
)

export default Routes
