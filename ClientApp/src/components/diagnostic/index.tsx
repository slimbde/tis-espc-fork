import React from "react"
import { Route, Switch } from "react-router-dom"
import { Services } from "./Services"




export const Diagnostic: React.FC = () => {

  return <div className="jumbotron">
    <Switch>
      <Route exact path={`/diagnostic/services`} component={Services} />
    </Switch>
  </div>
}
