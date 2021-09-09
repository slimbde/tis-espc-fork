import "./heatDetails.scss"
import React, { useEffect, useState } from "react"
import { Link, useRouteMatch } from "react-router-dom"
import { Alert, Breadcrumb, BreadcrumbItem, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import classnames from 'classnames';
import Summary from "./summary";
import Strands from "./strands";
import Chemistry from "./chemistry";
import Temperatures from "./samples";
import HeatEvents from "./heatEvents";
import Corrections from "./corrections";
import Chart from "./chart";
import Params from "./params";
import { setFluid } from "components/extra/SetFluid";


type Route = {
  HEAT_ID: string,
  REPORT_COUNTER: string,
  DATE: string,
  SHIFT: string
}


export const HeatDetails: React.FC = () => {
  const match = useRouteMatch<Route>()
  const REPORT_COUNTER = +match.params.REPORT_COUNTER
  const heatId = +match.params.HEAT_ID
  const date = match.params.DATE
  const shift = match.params.SHIFT

  const [activeTab, setActiveTab] = useState('Общее');

  useEffect(() => {
    // on any other link click we have the component unmounted
    // so bring back the default layout
    return () => setFluid()
  }, [])


  const toggle = (tab: React.SetStateAction<string>) => activeTab !== tab && setActiveTab(tab)


  return <div className="details-wrapper">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">ОТЧЕТ ПО РАЗЛИВКЕ ПЛАВКИ № {heatId}</div>
    <Breadcrumb>
      <BreadcrumbItem><Link to={`/tech-params/${date}/${shift}`}>ОТЧЕТ</Link></BreadcrumbItem>
      <BreadcrumbItem>{heatId}</BreadcrumbItem>
      <BreadcrumbItem active>{activeTab}</BreadcrumbItem>
    </Breadcrumb>

    <Nav tabs>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'Общее' })}
          onClick={() => { toggle('Общее'); setFluid() }}
        >Общие данные</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'Ручьи' })}
          onClick={() => { toggle('Ручьи'); setFluid() }}
        >Ручьи</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'Образцы' })}
          onClick={() => { toggle('Образцы'); setFluid() }}
        >Образцы</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'Химия' })}
          onClick={() => { toggle('Химия'); setFluid() }}
        >Хим. анализ</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'Параметры' })}
          onClick={() => { toggle('Параметры'); setFluid(true) }}
        >Параметры</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'График' })}
          onClick={() => { toggle('График'); setFluid() }}
        >График</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'События' })}
          onClick={() => { toggle('События'); setFluid() }}
        >События</NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({ active: activeTab === 'Корректив' })}
          onClick={() => { toggle('Корректив'); setFluid() }}
        >Корректив</NavLink>
      </NavItem>
    </Nav>

    <TabContent activeTab={activeTab}>
      <TabPane tabId="Общее"><Summary {...{ REPORT_COUNTER }} /></TabPane>
      <TabPane tabId="Ручьи"><Strands {...{ REPORT_COUNTER }} /></TabPane>
      <TabPane tabId="Образцы"><Temperatures {...{ REPORT_COUNTER }} /></TabPane>
      <TabPane tabId="Химия"><Chemistry {...{ REPORT_COUNTER }} /></TabPane>
      <TabPane tabId="Параметры"><Params {...{ REPORT_COUNTER }} /></TabPane>
      <TabPane tabId="График"><Chart {...{ heatId }} /></TabPane>
      <TabPane tabId="События"><HeatEvents {...{ REPORT_COUNTER }} /></TabPane>
      <TabPane tabId="Корректив"><Corrections {...{ REPORT_COUNTER }} /></TabPane>
    </TabContent>
  </div >
}