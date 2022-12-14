import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Home } from "components/home";
import { Redirect, Route, Switch } from "react-router-dom";
import { Production } from "components/technology/production";
import { NotAuthorized } from "components/notAuthorized";
import { Diagnostic } from "components/diagnostic";
import { Admin } from "components/admin";
import { VMExplorer } from "components/admin/vm";
import { ARMOverview } from "components/overview/arms";
import { ARM } from "components/overview/arms/ARM";
import { Compressor } from "components/overview/compressor";
import { Dryers } from "components/agregates/Dryers";
import { Journal } from "components/diagnostic/Journal";
import { Staples } from "components/agregates/Staples";
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import Layout from "components/layout";
import { CCM2Details } from "components/agregates/Staples/CCM2Details";
import { CCM1Details } from "components/agregates/Staples/CCM1Details";
import { DSPDetails } from "components/agregates/Staples/DSPDetails";
import { AKOSDetails } from "components/agregates/Staples/AKOSDetails";
import { AKPDetails } from "components/agregates/Staples/AKPDetails";
import { VODDetails } from "components/agregates/Staples/VODDetails";
import { Schedule } from "components/technology/schedule";
import { CamAkos } from "components/cams/CamAkos";




type AppState = {
  authorized: boolean
  routes: JSX.Element[]
}



const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    authorized: false,
    routes: [],
  })

  useEffect(() => {

    aHandler.GetUserRoleAsync()
      .then(role => {
        aHandler.StashRole(role)

        const routes = role === "Пользователь"
          ? userRoutes
          : role === "Технолог"
            ? technologistRoutes
            : role === "Программист"
              ? programmerRoutes
              : role === "Администратор"
                ? adminRoutes : []

        setState({ authorized: true, routes })
      })
      .catch(console.log)
    // eslint-disable-next-line
  }, [])


  const notFound = () => <div className="not-found">404 - Запрашиваемая страница не найдена на сервере</div>

  const userRoutes = [
    <Route exact path="/home" component={Home} key="home" />,
    <Route exact path="/overview/arms" component={ARMOverview} key="arms-overview" />,
    <Route path="/overview/compressor" component={Compressor} key="compressor" />,
    <Route exact path="/overview/:ARM_ID" component={ARM} key="arm-overview" />,
    <Route exact path="/agregates/dryers/:ID/:VIEW" component={Dryers} key="dryer" />,
    <Route exact path="/agregates/staple" component={Staples} key="staple" />,
    <Route exact path="/agregates/staple/ccm1" component={CCM1Details} key="ccm1details" />,
    <Route exact path="/agregates/staple/ccm2" component={CCM2Details} key="ccm2details" />,
    <Route exact path="/agregates/staple/dsp" component={DSPDetails} key="dspdetails" />,
    <Route exact path="/agregates/staple/akos" component={AKOSDetails} key="akosdetails" />,
    <Route exact path="/agregates/staple/akp/:TankId/:HeatId" component={AKPDetails} key="akpdetails" />,
    <Route exact path="/agregates/staple/vd/:TankId/:HeatId" component={VODDetails} key="vddetails" />,
  ]

  const technologistRoutes = [
    ...userRoutes,
    <Route path="/technology/production" component={Production} key="production" />,
    <Route path="/technology/schedule/" component={Schedule} key="schedule" />,
  ]

  const programmerRoutes = [
    ...technologistRoutes,
    <Route exact path="/diagnostic/services" component={Diagnostic} key="diagnostic" />,
    <Route exact path="/diagnostic/operator" component={Journal} key="operator1" />,
    <Route exact path="/diagnostic/operator/:AREAID/:FROM/:TO" component={Journal} key="operator2" />,
    <Route exact path="/cams/akos" component={CamAkos} key="camakos" />,
  ]

  const adminRoutes = [
    ...programmerRoutes,
    <Route path="/admin/hpe" component={VMExplorer} key="hpe" />,
    <Route exact path="/admin" component={Admin} key="admin" />,
  ]


  return state.authorized
    ? <Layout>
      <Switch>
        <Redirect exact from="/" to="/home" />
        {state.routes}
        <Route path="/*" component={notFound} />
      </Switch>
    </Layout>
    : <NotAuthorized />
}

export default App;
