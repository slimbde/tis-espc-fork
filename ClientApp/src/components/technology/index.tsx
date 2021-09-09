import React from "react"
import { Route, Switch } from "react-router-dom"
import { List } from "./list"
import { HeatDetails } from "./heatDetails"




export const Technology: React.FC = () => {

  return <div className="jumbotron">
    <Switch>
      <Route exact path={`/tech-params`} render={() => <List />} />
      <Route exact path={`/tech-params/:DATE/:SHIFT`} render={() => <List />} />
      <Route exact path={`/tech-params/:HEAT_ID/:REPORT_COUNTER/:DATE/:SHIFT`} render={() => <HeatDetails />} />
    </Switch>
  </div>
}