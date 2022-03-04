import "./cams.scss";
import { useEffect, useRef } from "react"
import { Alert } from "reactstrap"
import { UpdateCam } from "components/extra/UpdateCam";
import { setFluid } from "components/extra/SetFluid";

export const CamAkos: React.FC = () => {
  const akosRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setFluid(true)
    const token = new AbortController()
    UpdateCam("http://10.2.19.234/oneshotimage1", akosRef.current!, token)

    return () => {
      token.abort()
      setFluid(false)
    }
    //eslint-disable-next-line
  }, [])


  return <div className="cam-akos-wrapper">
    <Alert id="alert" style={{ gridArea: "alert" }}>Hello</Alert>
    <div className="title display-5" style={{ gridArea: "title" }}>АКОС</div>

    <img ref={akosRef} alt="" style={{ gridArea: "cam" }} />
  </div>
}