import { UpdateCam } from "components/extra/UpdateCam"
import { useEffect, useRef } from "react"
import { Link, useRouteMatch } from "react-router-dom"

const armsList = (window as any).config.armsList
const armsNames = (window as any).config.armsNames


export const ARM: React.FC = () => {
  const imgRef = useRef<HTMLImageElement>(null)
  const match = useRouteMatch<{ ARM_ID: string }>()

  useEffect(() => {
    const token = new AbortController()
    const url = (armsList as any)[match.params.ARM_ID]

    UpdateCam(url, imgRef.current!, token)

    return () => token.abort()
    //eslint-disable-next-line
  }, [])

  return <div className="arm-wrapper">
    <Link style={{ gridArea: "back" }} to="/overview/arms">Назад</Link>
    <span style={{ gridArea: "title" }}>{(armsNames as any)[match.params.ARM_ID]}</span>
    <img style={{ gridArea: "arm" }} ref={imgRef} alt="" />
  </div>
}