import "./services.scss"
import dHandler from "models/handlers/DbHandlers/DiagnosticDbHandler"
import { Button, Table } from "reactstrap"
import { Alert, blinkAlert } from "components/extra/Alert"
import { useEffect, useState } from "react"
import { ServiceInfo } from "models/types/Diagnostic/ServiceInfo"
import { ServerInfo } from "models/types/Diagnostic/ServerInfo"
import { Loading } from "components/extra/Loading"


type State = {
  serviceStatus: ServiceInfo | undefined
  serverStatus: ServerInfo | undefined
}



export const Services: React.FC = () => {

  const [state, setState] = useState<State>({
    serviceStatus: undefined,
    serverStatus: undefined
  })

  useEffect(() => {
    update()
    // eslint-disable-next-line
  }, [])


  const update = async () => {
    try {
      const serviceStatus = await dHandler.GetServiceStatusAsync()
      const serverStatus = await dHandler.GetServerStatusAsync()

      setState({ serviceStatus, serverStatus })
    }
    catch (error) {
      console.log(error)
      blinkAlert((error as string), false)
    }
  }

  const clearCache = () => {
    setState(state => ({ ...state, loading: true }))

    dHandler.ClearCacheAsync()
      .then(() => {
        setState(state => ({ ...state, loading: false }))
        blinkAlert("Кэш успешно очищен", true)
      })
      .catch(error => {
        setState(state => ({ ...state, loading: false }))
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="diagnostic-wrapper">
    <Alert>Hello</Alert>
    <div className="title display-5">Диагностика служб</div>

    <div className="localhost">
      <Table hover>
        <thead>
          <tr><th colSpan={2}>Состояние Web сервера</th></tr>
        </thead>
        <tbody>
          {state.serverStatus && Object.keys(state.serverStatus).map(key =>
            <tr key={key}>
              <td>{key}</td>
              <td>{state.serverStatus![key]}</td>
            </tr>)}
        </tbody>
      </Table>
      {!state.serverStatus && <Loading />}
    </div>

    <div className="service">
      <Table hover>
        <thead>
          <tr><th colSpan={2}>Состояние сервисов</th></tr>
        </thead>
        <tbody>
          {state.serviceStatus && Object.keys(state.serviceStatus).map(key => {
            const ok = (state.serviceStatus as any)[key]

            return <tr key={key}>
              <td>{key}</td>
              <td className={ok ? "ok" : "fail"}>{ok ? "OK" : "FAIL"}</td>
            </tr>
          })}
        </tbody>
      </Table>
      {!state.serviceStatus && <Loading />}
    </div>

    <div className="controls">
      <Button color="secondary" outline size="sm" onClick={update}>Обновить</Button>
    </div>

    <div className="title2 display-5">Управление сервером</div>
    <Button color="secondary" outline size="sm" onClick={clearCache} className="clear">Очистить кэш</Button>
  </div>
}
