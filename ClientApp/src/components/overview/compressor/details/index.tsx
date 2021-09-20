import "./details.scss"
import { useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { mHandler } from "models/handlers/ISensorHandler"
import { Link, useRouteMatch } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}


export const Details: React.FC<Props> = ({ setTitle }) => {
  const match = useRouteMatch<{ ID: string }>()

  useEffect(() => {
    setTitle(`Компрессорная. Компрессор ${match.params.ID}`)
    dispatch()
    //  const interval = setInterval(() => dispatch(), 5000)
    //  return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [setTitle])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => mHandler.Handle(sensors))
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="dryer-wrapper">
    <Link to="/overview/compressor/main" className="btn btn-outline-dark">Назад</Link>


  </div>
}