import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import * as React from "react"


const Footer = () => {
  const [state, setState] = React.useState({
    name: "",
    role: aHandler.GetRoleFromStash(),
  })

  React.useEffect(() => {
    aHandler.GetUserNameAsync()
      .then(name => setState({ ...state, name }))
      .catch(console.log)
    // eslint-disable-next-line
  }, [])

  return <div className="footer container">
    {`${state.name.replace(/"/g, "").replace("\\", "")}: ${state.role}`}
  </div>
}

export default Footer