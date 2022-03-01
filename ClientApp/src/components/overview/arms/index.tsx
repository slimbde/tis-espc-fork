import "./arms.scss"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const armsList = (window as any).config.armsList


type State = {
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



export const ARMOverview: React.FC = () => {

  const [state, setState] = useState<State>({
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
    document.title = "ТИС ЭСПЦ: Мониторинг"
    const interval = setInterval(() => {
      const random = Math.random()
      setState({
        ...state,
        ccmArm1: `${armsList["ccmArm1"]}?r=${random}`,
        ccmArm2: `${armsList["ccmArm2"]}?r=${random}`,
        gega: `${armsList["gega"]}?r=${random}`,
        fda: `${armsList["fda"]}?r=${random}`,
        mbps: `${armsList["mbps"]}?r=${random}`,
        akpArm1: `${armsList["akpArm1"]}?r=${random}`,
        akpArm2: `${armsList["akpArm2"]}?r=${random}`,
        hiReg: `${armsList["hiReg"]}?r=${random}`,
        vdArm1: `${armsList["vdArm1"]}?r=${random}`,
        vdArm2: `${armsList["vdArm2"]}?r=${random}`,
        vdArm3: `${armsList["vdArm3"]}?r=${random}`,
      })
    }, 5000)

    return () => clearInterval(interval)
    // eslint-disable-next-line
  }, [])


  return <div className="overview-wrapper jumbotron">
    <div className="arm-overview">
      <Link to="/overview/ccmArm1" style={{ gridArea: "ccm-arm1" }}>
        <div className="card">
          <span>МНЛЗ АРМ1</span>
          <img src={state.ccmArm1} alt="" />
        </div>
      </Link>

      <Link to="/overview/ccmArm2" style={{ gridArea: "ccm-arm2" }}>
        <div className="card">
          <span>МНЛЗ АРМ2</span>
          <img src={state.ccmArm2} alt="" />
        </div>
      </Link>

      <Link to="/overview/gega" style={{ gridArea: "gega" }}>
        <div className="card">
          <span>МНЛЗ Гега</span>
          <img src={state.gega} alt="" />
        </div>
      </Link>

      <Link to="/overview/fda" style={{ gridArea: "fda" }}>
        <div className="card">
          <span>FDA</span>
          <img src={state.fda} alt="" />
        </div>
      </Link>

      <Link to="/overview/mbps" style={{ gridArea: "mbps" }}>
        <div className="card">
          <span>MBPS</span>
          <img src={state.mbps} alt="" />
        </div>
      </Link>

      <Link to="/overview/akpArm1" style={{ gridArea: "akp-arm1" }}>
        <div className="card">
          <span>АКП АРМ1</span>
          <img src={state.akpArm1} alt="" />
        </div>
      </Link>

      <Link to="/overview/akpArm2" style={{ gridArea: "akp-arm2" }}>
        <div className="card">
          <span>АКП АРМ2</span>
          <img src={state.akpArm2} alt="" />
        </div>
      </Link>

      <Link to="/overview/hiReg" style={{ gridArea: "hi-reg" }}>
        <div className="card">
          <span>Hi REG</span>
          <img src={state.hiReg} alt="" />
        </div>
      </Link>

      <Link to="/overview/vdArm1" style={{ gridArea: "vd-arm1" }}>
        <div className="card">
          <span>Вакууматор АРМ1</span>
          <img src={state.vdArm1} alt="" />
        </div>
      </Link>

      <Link to="/overview/vdArm2" style={{ gridArea: "vd-arm2" }}>
        <div className="card">
          <span>Вакууматор АРМ2</span>
          <img src={state.vdArm2} alt="" />
        </div>
      </Link>

      <Link to="/overview/vdArm3" style={{ gridArea: "vd-arm3" }}>
        <div className="card">
          <span>Вакууматор АРМ3</span>
          <img src={state.vdArm3} alt="" />
        </div>
      </Link>
    </div>
  </div>
}
