import "./akp.scss"

type Props = {
  energy?: boolean
  argon: boolean
  capdown: boolean
  empty: boolean
  vd?: boolean
  vacuum?: boolean
}


export const AKPView: React.FC<Props> = ({
  energy,
  argon,
  capdown,
  empty,
  vd,
  vacuum,
}) => {

  return <div
    id="AKP"
    className={`${vd ? "VD" : ""}${vacuum ? " vacuum" : ""}${energy ? " energy" : ""}${argon ? " argon" : ""}${capdown ? " capdown" : ""}${empty ? " empty" : ""}`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 87.378 124.485"
    >
      <defs>
        <linearGradient
          x1="83.34375"
          y1="97.239586"
          x2="83.34375"
          y2="147.51042"
          gradientUnits="userSpaceOnUse"
          id="linearGradient6638">
          <stop offset={0} stopColor="#030303" />
          <stop offset={0.526} stopColor="red" />
          <stop offset={0.868} stopColor="#ffc000" />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
        <linearGradient id="linearGradient6598">
          <stop offset={0} stopColor="#030303" />
          <stop offset={0.553} stopColor="red" />
          <stop offset={0.868} stopColor="#ffc000" />
          <stop offset={1} stopColor="#fff" />
        </linearGradient>
        <linearGradient id="arcGradient" gradientUnits="objectBoundingBox" x1="50%" y1={150.156} x2="140%" y2={150.156} spreadMethod="reflect">
          <stop offset={0} stopColor="#fff" />
          <stop offset={1} stopColor="#00c0ff" />
        </linearGradient>
        <linearGradient id="linearGradient6052-6-4">
          <stop offset={0} stopColor="#ff0" />
          <stop offset={1} stopColor="#ff0" stopOpacity={0} />
        </linearGradient>
        <radialGradient
          xlinkHref="#linearGradient6052-6-4"
          id="radialGradient6054"
          cx={74.083}
          cy={198.431}
          fx={74.083}
          fy={198.431}
          r={11.372}
          gradientTransform="matrix(.99897 -.0454 .11633 2.5593 -23.007 -304.053)"
          gradientUnits="userSpaceOnUse"
        />
        <filter
          id="filter6312"
          x={-0.059}
          width={1.118}
          y={-0.05}
          height={1.1}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation={0.558} />
        </filter>
      </defs>
      <g id="layer1" strokeWidth={0.3} stroke="#000">
        <path
          d="M9.326 41.076h68.792v48.638l-16.51 14.862H27.212L9.326 89.714h0z"
          fill="#b3b3b3"
          id="liningwall"
        />
        <g id="electrodes">
          <rect width={10.583} height={50.271} x={78.052} y={97.24} ry={0} />
          <rect width={10.583} height={50.271} x={93.927} y={97.24} ry={0} />
          <rect width={10.583} height={50.271} x={62.177} y={97.24} ry={0} />
        </g>
        <g id="cap" transform="translate(-39.622 -97.174)">
          <path
            d="M47.625 123.698l14.552-7.938h42.333l14.552 7.938v7.937H47.626v0z"
            fill="#b3b3b3"
          />
          <rect
            width={71.438}
            height={6.615}
            x={47.625}
            y={131.635}
            ry={0}
            fill="#d3d3d3"
          />
        </g>
        <path
          d="M10.649 60.48h66.146v28.75L60.92 103.782H27.847L10.649 89.23z"
          fill="#ffc000"
          stroke="none"
          id="metal"
        />
        <path id="holders" stroke="none" d="M.066 41.076H6.68l3.969 2.646v10.583L6.68 56.951H.066zM87.378 41.076h-6.614l-3.97 2.646v10.583l3.97 2.646h6.614z" />
        <path id="tube" d="M30.493 104.576h7.937v14.552c0 2.646-1.323 5.292-5.291 5.292H.066v-7.938H29.17c.794 0 1.323-.699 1.323-1.323v-10.583z" />
        <g id="gas">
          <path transform="translate(-39.34 -97.543)" fill="url(#radialGradient6054)" filter="url(#filter6312)" stroke="none"
            d="M63.481 177.91c4.203-5.683 17.921-4.558 21.205 0 3.283 4.556-2.576 5.145-3.875 9.26-1.298 
                     4.114-3.024 13.786-3.024 13.786H70.38s-2.91-9.946-4.063-13.786c-1.154-3.84-4.755-6.666-2.835-9.26z"
          />
          <g id="bubbles" fill="#ff0">
            <circle style={{ transformOrigin: "29.963536px 92.934371px" }} cx={29.964} cy={92.934} className="buble1" r={1.291} />
            <circle style={{ transformOrigin: "31.815617px 99.284361px" }} cx={31.816} cy={99.284} className="buble2" r={2.582} />
            <circle style={{ transformOrigin: "34.726033px 93.992701px" }} cx={34.726} cy={93.993} className="buble3" r={1.291} />
            <circle style={{ transformOrigin: "37.901036px 97.961451px" }} cx={37.901} cy={97.961} className="buble4" r={1.291} />
            <circle style={{ transformOrigin: "32.344784px 82.615611px" }} cx={32.345} cy={82.616} className="buble5" r={3.582} />
            <circle style={{ transformOrigin: "37.636448px 90.023951px" }} cx={37.636} cy={90.024} className="buble6" r={2.582} />
          </g>
        </g>
        <g id="arc" transform="translate(-39.622 -97.174)" fill="url(#arcGradient)" strokeOpacity={0} stroke="none">
          <path d="M84.227 147.583l-3.567 5.702 2.672-.247-.784 5.456 3.68-7.937-2.784.74z" />
          <path d="M98.927 147.583l-3.567 5.702 2.672-.247-.784 5.456 3.68-7.937-2.784.74z" />
          <path d="M67.177 147.583l-3.567 5.702 2.672-.247-.784 5.456 3.68-7.937-2.784.74z" />
        </g>
      </g>
    </svg>
  </div>
}
