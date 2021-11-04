import "./ccm12.scss"

export const CCMView: React.FC<{ cast: boolean, head: string }> = ({
  cast,
  head,
}) => {


  return <div className="ccm">
    <div className={`head ${head}`}></div>
    <div className={`strand ${cast ? "cast" : ""}`}></div>
  </div>
}