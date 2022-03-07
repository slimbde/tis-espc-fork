import "./dryers.scss"
import { useState } from "react"
import classnames from 'classnames';
import { Button, ButtonGroup, Nav, NavItem, NavLink } from "reactstrap"
import { NavLink as Link, Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import { DryerSummary } from "./Summary"
import { DryerChart } from "./Chart";
import { DryerProtocol } from "./Protocol";
import { DryerGas } from "./Gas";
import { Alert } from "components/extra/Alert";



export const Dryers: React.FC = () => {
  const match = useRouteMatch<{ ID: string, VIEW: string }>()
  const history = useHistory()

  const [state, setState] = useState({
    agregateNum: +match.params.ID,
    activeTab: match.params.VIEW,
    title: "Агрегат №2 сушки промковшей МНЛЗ-2"
  });



  return <div className="dryers-wrapper jumbotron">
    <Alert>Hello</Alert>
    <div className="title display-5" style={{ gridArea: "title" }} >{state.title}</div>

    <Nav tabs style={{ gridArea: "tabs" }}>
      <NavItem>
        <NavLink
          tag={Link}
          to={`/agregates/dryers/${state.agregateNum}/summary`}
          className={classnames({ active: state.activeTab === 'summary' })}
          onClick={() => setState({ ...state, activeTab: "summary" })}
        >Обзор</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          tag={Link}
          to={`/agregates/dryers/${state.agregateNum}/chart`}
          className={classnames({ active: state.activeTab === 'chart' })}
          onClick={() => setState({ ...state, activeTab: "chart" })}
        >График</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          tag={Link}
          to={`/agregates/dryers/${state.agregateNum}/protocol`}
          className={classnames({ active: state.activeTab === 'protocol' })}
          onClick={() => setState({ ...state, activeTab: "protocol" })}
        >Протоколы</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          tag={Link}
          to={`/agregates/dryers/${state.agregateNum}/gas`}
          className={classnames({ active: state.activeTab === 'gas' })}
          onClick={() => setState({ ...state, activeTab: "gas" })}
        >Расход газа</NavLink>
      </NavItem>
    </Nav>


    <ButtonGroup size="sm" style={{ gridArea: "agregate" }}>
      <Button
        outline
        color="info"
        active={state.agregateNum === 1}
        onClick={() => {
          setState({
            ...state,
            agregateNum: 1,
            activeTab: "summary",
            title: `Агрегат №1. Сушка промковшей МНЛЗ-2`
          })
          history.push("/agregates/dryers/1/summary")
        }}
      >1. Сушка</Button>
      <Button
        outline
        color="info"
        active={state.agregateNum === 2}
        onClick={() => {
          setState({
            ...state,
            agregateNum: 2,
            activeTab: "summary",
            title: `Агрегат №2. Сушка промковшей МНЛЗ-2`
          })
          history.push("/agregates/dryers/2/summary")
        }}
      >2. Сушка</Button>
      <Button
        outline
        color="info"
        active={state.agregateNum === 3}
        onClick={() => {
          setState({
            ...state,
            agregateNum: 3,
            activeTab: "summary",
            title: `Агрегат №3. Разогрев промковшей МНЛЗ-2`
          })
          history.push("/agregates/dryers/3/summary")
        }}
      >3. Разогрев</Button>
      <Button
        outline
        color="info"
        active={state.agregateNum === 4}
        onClick={() => {
          setState({
            ...state,
            agregateNum: 4,
            activeTab: "summary",
            title: `Агрегат №4. Разогрев промковшей МНЛЗ-2`
          })
          history.push("/agregates/dryers/4/summary")
        }}
      >4. Разогрев</Button>
    </ButtonGroup>

    {state.activeTab && <Switch>
      <Route exact path="/agregates/dryers/:ID/summary" component={DryerSummary} />
      <Route exact path="/agregates/dryers/:ID/chart" component={DryerChart} />
      <Route exact path="/agregates/dryers/:ID/protocol" component={DryerProtocol} />
      <Route exact path="/agregates/dryers/:ID/gas" component={DryerGas} />
    </Switch>}
  </div>
}