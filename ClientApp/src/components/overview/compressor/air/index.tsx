import "./air.scss"
import { useEffect } from "react"
import cHandler from "models/handlers/DbHandlers/CompressorDbHandler"
import { blinkAlert } from "components/extra/Alert"
import { mHandler } from "models/handlers/Compressor/ICompressorSensorHandler"
import { Link } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"


type Props = {
  setTitle: Dispatch<SetStateAction<string>>
}


export const Air: React.FC<Props> = ({ setTitle }) => {

  useEffect(() => {
    setTitle("Компрессорная. Сжатый воздух")
    //  dispatch()
    //  const interval = setInterval(() => dispatch(), 5000)
    //  return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])


  const dispatch = () => {
    cHandler.ReadCompressorAsync()
      .then(sensors => mHandler.Handle(sensors))
      .catch(error => {
        blinkAlert(error.message, false)
        console.log(error)
      })
  }



  return <div className="air-wrapper">
    <Link to="/overview/compressor/main" className="btn btn-outline-dark">Назад</Link>


  </div>
}