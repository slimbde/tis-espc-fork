import "./compressor.scss"
import { Route, Switch } from "react-router-dom"
import { Alert } from "reactstrap"
import { Main } from "./main"


export const Compressor: React.FC = () => {

  return <div className="compressor-wrapper jumbotron">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">Компрессорная</div>

    <Switch>
      <Route exact path={`/overview/compressor/main`} component={Main} />
    </Switch>
  </div>
}