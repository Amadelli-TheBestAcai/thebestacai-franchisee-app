import React from 'react'
import { Switch, Route, RouteProps } from 'react-router-dom'
import Layout from '../containers/Layout'

import Home from '../pages/Home'
import Cashier from '../pages/Cashier'
import Command from '../pages/Command'
import Delivery from '../pages/Delivery'
import Login from '../pages/Login'
import Balance from '../pages/Balance'
import Sale from '../pages/Sale'
import Handler from '../pages/Handler'
import Settings from '../pages/Settings'
import Stock from '../pages/Stock'
import Nfce from '../pages/Nfce'

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
    <RouteWithLayout exact path="/balance" component={Balance} />
    <RouteWithLayout exact path="/sale" component={Sale} />
    <RouteWithLayout exact path="/handler" component={Handler} />
    <RouteWithLayout exact path="/settings" component={Settings} />
    <RouteWithLayout exact path="/stock" component={Stock} />
    <RouteWithLayout exact path="/nfce" component={Nfce} />
    <Route path="*" component={Login} />
  </Switch>
)

export default Routes
