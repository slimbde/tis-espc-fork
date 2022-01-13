import "./dsp.scss"

type Props = {
  energy: boolean
  refining: boolean
}


export const DSPView: React.FC<Props> = ({
  energy,
  refining,
}) => {

  return <div id="AF" className={`dsp${energy ? " energy" : ""}${refining ? " filling" : ""}`}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38.301 29.487"
      preserveAspectRatio="xMinYMin"
    >
      <defs>
        <linearGradient
          id="electrodeGradient"
          x1="83.34375"
          y1="0%"
          x2="83.34375"
          y2="100%"
          gradientUnits="objectBoundingBox">
          <stop style={{ stopColor: "#030303" }} offset="0" id="stop6594"></stop>
          <stop style={{ stopColor: "#ff0000" }} id="stop6610" offset="0.5526315"></stop>
          <stop style={{ stopColor: "#ffc000" }} offset="0.86842096" id="stop6612"></stop>
          <stop style={{ stopColor: "#ffffff" }} offset="1" id="stop6596"></stop>
        </linearGradient>
        <linearGradient
          id="metalGradient"
          x1="3.34375"
          y1="100%"
          x2="3.34375"
          y2="0%"
          gradientUnits="objectBoundingBox">
          <stop style={{ stopColor: "#030303" }} offset="0" id="stop6594"></stop>
          <stop style={{ stopColor: "#ff0000" }} id="stop6610" offset="0.1526315"></stop>
          <stop style={{ stopColor: "#ffc000" }} offset="0.56842096" id="stop6612"></stop>
          <stop style={{ stopColor: "#ffffff" }} offset="1" id="stop6596"></stop>
        </linearGradient>
        <linearGradient
          id="metalGradient1"
          x1="3.34375"
          y1="100%"
          x2="3.34375"
          y2="0%"
          gradientUnits="objectBoundingBox">
          <stop style={{ stopColor: "#030303" }} offset="0" id="stop6594"></stop>
          <stop style={{ stopColor: "#ff0000" }} id="stop6610" offset="0.1526315"></stop>
          <stop style={{ stopColor: "#ffc000" }} offset="0.66842096" id="stop6612"></stop>
          <stop style={{ stopColor: "#ffffff" }} offset="1" id="stop6596"></stop>
        </linearGradient>
        <linearGradient
          id="metalGradient2"
          x1="3.34375"
          y1="100%"
          x2="3.34375"
          y2="0%"
          gradientUnits="objectBoundingBox">
          <stop style={{ stopColor: "#030303" }} offset="0" id="stop6594"></stop>
          <stop style={{ stopColor: "#ff0000" }} id="stop6610" offset="0.1526315"></stop>
          <stop style={{ stopColor: "#ffc000" }} offset="0.86842096" id="stop6612"></stop>
          <stop style={{ stopColor: "#ffffff" }} offset="1" id="stop6596"></stop>
        </linearGradient>
        <linearGradient id="arcGradient" x1="50%" y1="147.02814" x2="140%" y2="147.02814" spreadMethod="reflect" gradientUnits="objectBoundingBox" gradientTransform="matrix(1.0000027,0,0,1,-9.6730384e-5,-2.5085033e-6)">
          <stop style={{ stopColor: "#ffffff" }} offset="0" id="stop6493"></stop>
          <stop id="stop6505" offset="0.9" style={{ stopColor: "#00c0ff" }}></stop>
        </linearGradient>
      </defs>
      <g strokeWidth={0.132} stroke="#000">
        <path id="basement" d="M2.894 18.956H.066v1.771l.476 2.197h.934v2.882H4.24s1.99.952 4.48 1.74c2.491.789 6.321 1.89 9.954 1.875 3.633-.016 8.402-.8 10.595-1.581 2.194-.782 2.541-1.162 3.467-2.034.926-.871 1.52-3.268 3.3-4.157 2.25-1.03 2.198-2.693 2.198-2.693v-2.457H2.894z" />
        <path id="backstage" d="M3.307 18.956h0l.366-9.492h2.774v-1.12l7.573-1.862h11.198l5.718 1.863v8.933h7.298v1.005s-2.214 2.232-3.304 3.366c-5.408 5.627-15.779 2.835-23.856 2.835l-4.627-3.757z" />
        <g id="arcs">
          <path
            transform="matrix(1 0 0 1.98251 -6.832 -277.305)"
            d="M31 146.335l-1.235 1.323.53-.088-.618 1.234L31 147.04l-.617.265z"
          />
          <path
            transform="matrix(1 0 0 1.98251 -11.832 -277.305)"
            d="M31 146.335l-1.235 1.323.53-.088-.618 1.234L31 147.04l-.617.265z"
          />
          <path
            transform="matrix(1 0 0 1.98251 -16.832 -277.305)"
            d="M31 146.335l-1.235 1.323.53-.088-.618 1.234L31 147.04l-.617.265z"
          />
        </g>
        <path id="metal" d="M3.307 18.956h0l.068-1.678h34.86v1.005s-2.215 2.232-3.305 3.366c-5.408 5.626-15.779 2.835-23.856 2.835l-4.627-3.757z" />
        <path id="drainmetal" d="M3.307 18.956h0l4.146 1.442L30.936 8.345v8.933h7.298v1.005s-2.214 2.232-3.304 3.366c-5.408 5.626-15.779 2.835-23.856 2.835l-4.627-3.757z" />
        <g id="electrodes">
          <path d="M17.736 2.58h1.981v11h-1.98z" />
          <path d="M22.451 2.58h1.981v11h-1.98z" />
          <path d="M12.991 2.58h1.981v11h-1.98z" />
        </g>
        <path
          d="M22.052 25.806c-7.323.52-16.513-2.645-16.513-2.645H3.673v-2.433h-.78v-1.772h2.74s3.097 2.498 5.198 3.213c1.6.544 4.7.904 6.875.945 2.527.047 8.111-.19 9.255-.212 1.144-.021 5.913-1.253 5.913-1.253l5.36-3.366s-1.136.978-3.323 3.366c-2.186 2.387-5.535 3.638-12.859 4.157z"
          fill="#d3d3d3"
          id="brickwork"
        />
        <g id="TopLoad" fill="#999">
          <path d="M3.088 10.606l.679.08-.873 7.355-.678-.08z" />
          <path d="M6.447 9.464h-2.97v5.19h2.97zM30.914 9.442h1.328v5.233h-1.328z" />
          <g>
            <path d="M4.168 6.693l4.5-2h19l4.5 2v2h0-28 0z" />
            <path fill="#d3d3d3" d="M4.168 7.393h28v2h-28z" />
          </g>
          <path d="M12.644.066h12.103V2.58H12.644z" />
        </g>
        <path id="gate" d="M32.874 21.649l-1.938-4.37h7.298v1.004z" />
      </g>
    </svg>
  </div>
}