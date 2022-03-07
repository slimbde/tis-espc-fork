import "./compressor.scss"
import { Route, Switch } from "react-router-dom"
import { Main } from "./main"
import { KipElectro } from "./kipelectro"
import { useState } from "react"
import { Air } from "./air"
import { Dryer } from "./dryer"
import { Details } from "./details"
import { Alert } from "components/extra/Alert"


export const Compressor: React.FC = () => {

  const [title, setTitle] = useState("Компрессорная")

  return <div className="compressor-wrapper jumbotron">
    <Alert>Hello</Alert>
    <div className="title display-5">{title}</div>

    <Switch>
      <Route exact path={`/overview/compressor/main`} render={() => <Main setTitle={setTitle} />} />
      <Route exact path={`/overview/compressor/kipelectro`} render={() => <KipElectro setTitle={setTitle} />} />
      <Route exact path={`/overview/compressor/air`} render={() => <Air setTitle={setTitle} />} />
      <Route exact path={`/overview/compressor/dryer`} render={() => <Dryer setTitle={setTitle} />} />
      <Route exact path={`/overview/compressor/details/:ID`} render={() => <Details setTitle={setTitle} />} />
    </Switch>
  </div>
}