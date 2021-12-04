import { useEffect, useState } from "react"
import { Link, useRouteMatch } from "react-router-dom"

const armsList = (window as any).config.armsList
const armsNames = (window as any).config.armsNames


export const ARM: React.FC = () => {
  const match = useRouteMatch<{ ARM_ID: string }>()
  const [src, setSrc] = useState((armsList as any)[match.params.ARM_ID])

  useEffect(() => {
    const path = (armsList as any)[match.params.ARM_ID]
    const interval = setInterval(() => setSrc(`${path}?r=${Math.random()}`), 5000)

    return () => clearInterval(interval)
    //eslint-disable-next-line
  }, [])

  return <div className="arm-wrapper">
    <Link style={{ gridArea: "back" }} to="/overview/arms">Назад</Link>
    <span style={{ gridArea: "title" }}>{(armsNames as any)[match.params.ARM_ID]}</span>
    <img style={{ gridArea: "arm" }} src={src} alt="" />
  </div>
}