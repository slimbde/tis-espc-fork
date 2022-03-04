import "./arms.scss"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { UpdateCam } from "components/extra/UpdateCam"

const armsList = (window as any).config.armsList


type State = {
  [key: string]: string
  ccmArm1: string
  ccmArm2: string
  gega: string
  fda: string
  mbps: string
  akpArm1: string
  akpArm2: string
  hiReg: string
  vdArm1: string
  vdArm2: string
  vdArm3: string
}


const armDecoder: { [key: string]: string } = {
  ccmArm1: "МНЛЗ-2 АРМ1",
  ccmArm2: "МНЛЗ-2 АРМ2",
  gega: "ГЕГА",
  fda: "FDA",
  mbps: "MBPS",
  akpArm1: "АКП-2 АРМ1",
  akpArm2: "АКП-2 АРМ2",
  hiReg: "Hi Reg",
  vdArm1: "ВОД АРМ1",
  vdArm2: "ВОД АРМ2",
  vdArm3: "ВОД АРМ3",
}




export const ARMOverview: React.FC = () => {

  const [state] = useState<State>({
    ccmArm1: armsList["ccmArm1"],
    ccmArm2: armsList["ccmArm2"],
    gega: armsList["gega"],
    fda: armsList["fda"],
    mbps: armsList["mbps"],
    akpArm1: armsList["akpArm1"],
    akpArm2: armsList["akpArm2"],
    hiReg: armsList["hiReg"],
    vdArm1: armsList["vdArm1"],
    vdArm2: armsList["vdArm2"],
    vdArm3: armsList["vdArm3"],
  })


  useEffect(() => {
    document.title = "Мониторинг"
    const token = new AbortController()

    Object.keys(state).forEach(id => {
      const img = document.getElementById(id) as HTMLImageElement
      UpdateCam(state[id], img, token)
    })

    return () => token.abort()
    // eslint-disable-next-line
  }, [])


  return <div className="overview-wrapper jumbotron">
    <div className="arm-overview">
      {Object.keys(state).map(arm =>
        <Link to={`/overview/${arm}`} style={{ gridArea: arm }} key={arm}>
          <div className="card">
            <span>{armDecoder[arm]}</span>
            <img id={arm} alt="" />
          </div>
        </Link>
      )}
    </div>
  </div>
}
