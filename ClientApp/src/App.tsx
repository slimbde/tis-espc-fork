import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { Home } from "components/home";
import { Redirect, Route, Switch } from "react-router-dom";
import { TPA } from "components/overview/tpa";
import { Technology } from "components/technology";
import { NotAuthorized } from "components/notAuthorized";
import { Diagnostic } from "components/diagnostic";
import { Admin } from "components/admin";
import { Dispatcher } from "components/overview/dispatcher";
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import Layout from "components/layout";


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
    //<Route exact path="/tpa" component={TPA} key="tpa" />,
    //<Route exact path="/dispatcher" component={Dispatcher} key="dispatcher" />
  ]

  const technologistRoutes = [
    ...userRoutes,
    //<Route path="/tech-params" component={Technology} key="technology" />
  ]

  const programmerRoutes = [
    ...technologistRoutes,
    //<Route path="/diagnostic" component={Diagnostic} key="diagnostic" />
  ]

  const adminRoutes = [
    ...programmerRoutes,
    //<Route path="/admin" component={Admin} key="admin" />
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
