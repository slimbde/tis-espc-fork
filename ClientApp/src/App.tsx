import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Home } from "components/home";
import { Redirect, Route, Switch } from "react-router-dom";
import { Production } from "components/technology/production";
import { NotAuthorized } from "components/notAuthorized";
import { Diagnostic } from "components/diagnostic";
import { Admin } from "components/admin";
import Layout from "components/layout";
import { VMExplorer } from "components/admin/vm";
import { ARMOverview } from "components/overview/arms";
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import { ARM } from "components/overview/arms/ARM";
import { Compressor } from "components/overview/compressor";
import { Dryers } from "components/agregates/Dryers";
import { Journal } from "components/technology/Journal";



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
  ]

  const technologistRoutes = [
    ...userRoutes,
    <Route path="/technology/production" component={Production} key="production" />,
    <Route exact path="/technology/operator" component={Journal} key="operator1" />,
    <Route exact path="/technology/operator/:AREAID/:FROM/:TO" component={Journal} key="operator2" />,
    <Route path="/agregates/dryers/:ID/:VIEW" component={Dryers} key="dryer" />,
  ]

  const programmerRoutes = [
    ...technologistRoutes,
    <Route path="/diagnostic" component={Diagnostic} key="diagnostic" />
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
