import { setFluid } from "components/extra/SetFluid"
import { useEffect } from "react"
import "./vm.scss"


export const VMExplorer: React.FC = () => {

  useEffect(() => {
    setFluid(true)
    return setFluid
  }, [])

  return <div className="vm-wrapper">
    <iframe
      id="hpeRoot"
      src="https://10.2.19.193"
      width="100%"
      frameBorder="0"
      title="explorer"
    ></iframe>
  </div>
}