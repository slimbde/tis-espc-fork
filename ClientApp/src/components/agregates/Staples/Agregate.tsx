import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { AgregateState, ccmState, vdState } from "models/types/Agregates/Staples/AgregateState"
import { Link } from "react-router-dom"
import { Card, CardBody, CardHeader } from "reactstrap"
import { AKPView } from "./views/akp"
import { CCMView } from "./views/ccm12"
import { DSPView } from "./views/dsp"




export const Agregate: React.FC<AgregateInfo> = ({
  name,
  heatId,
  series,
  steelGrade,
  flowSpeed,
  castingSpeed,
  heatStart,
  heatTime,
  heatWeight,
  heatCurrentTime,
  eeHeatActive,
  ladleId,
  argonFlow,
  argonTime,
  argonPressure,
  tgs,
  streamCast,
  slabWidth,
  slabThickness,
  castedMeters,
  castedTonns,
  currentTemp,
  energy,
  argon,
  capdown,
  empty,
  vacuum,
  flushSteel,
  flushSlag,
  state,

  dataDelayed,
  lastUpdate,
}) => {

  const detailsLink = () => {
    switch (name) {
      case "МНЛЗ-1": return "staple/ccm1"
      case "МНЛЗ-2": return "staple/ccm2"
      case "ДСП": return "staple/dsp"
      case "АКОС": return "staple/akos"
      case "АКП2-1поз": return "staple/akp/1"
      case "АКП2-2поз": return "staple/akp/2"
      case "ВД-1поз": return "staple/vd1"
      case "ВД-2поз": return "staple/vd2"
      default: return "staple"
    }
  }

  const cardStatusStyle = () => {
    switch (name) {
      case "МНЛЗ-1":
      case "МНЛЗ-2":
        return ccmState(streamCast, castingSpeed)
      case "ВД-1поз":
      case "ВД-2поз":
        return vdState(energy, argon, empty)
      default: return state
    }
  }


  return <Card className={`${dataDelayed ? "delayed" : ""}`}>
    <CardHeader className={cardStatusStyle()}>
      <div>{name}</div>
      <div>
        {name === "МНЛЗ-2" || name === "МНЛЗ-1" || name === "ДСП" || name?.indexOf("АК") !== -1 ? <Link title="Посмотреть подробно" to={detailsLink}>{heatId}</Link> : <>{heatId}</>}
        {series && <div title="Номер в серии">&nbsp;({series})</div>}
      </div>

    </CardHeader>

    <CardBody className={cardStatusStyle()}>
      {name === "МНЛЗ-1" && <CCMView cast={streamCast!} head={`s10`} />}
      {name === "МНЛЗ-2" && <CCMView cast={streamCast!} head={tgs!} />}
      {name === "ДСП" && <DSPView energy={energy!} coldIdle={state === AgregateState.IDLE} flushSteel={flushSteel!} flushSlag={flushSlag!} />}
      {name === "АКОС" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "АКП2-1поз" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "АКП2-2поз" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "ВД-1поз" && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "ВД-2поз" && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}

      <div className="info">
        {steelGrade && <div>
          <div>Марка</div>
          <div>{`${steelGrade} `}</div>
        </div>}

        {slabWidth && <div>
          <div>Раскрой</div>
          <div>{`${slabWidth ? `${slabWidth}*` : ""}${slabThickness ? slabThickness : ""}`}</div>
        </div>}

        {castingSpeed && <div>
          <div>V, м/мин</div>
          <div>{castingSpeed}</div>
        </div>}

        {heatStart && <div>
          <div>Начало</div>
          <div>{heatStart}</div>
        </div>}

        {heatTime && <div>
          <div>Длительн.</div>
          <div>{heatTime}</div>
        </div>}

        {castedMeters && <div>
          <div>Отлито,м/т</div>
          <div>{castedMeters} {castedTonns}</div>
        </div>}

        {eeHeatActive && <div>
          <div>Расход ЭЭ</div>
          <div>{eeHeatActive}</div>
        </div>}

        {currentTemp && <div>
          <div>T, ℃</div>
          <div>{currentTemp}</div>
        </div>}

        {ladleId && name?.indexOf("АК") !== -1 && <div>
          <div>Номер с/к</div>
          <div>{ladleId}</div>
        </div>}

        {argonPressure && name === "АКОС" && <div>
          <div>Ar, атм м&sup3;/ч</div>
          <div>{argonPressure}&nbsp;&nbsp;&nbsp;{argonFlow}</div>
        </div>}

        {argonFlow && name?.indexOf("АКП") !== -1 && <div>
          <div>Ar, м&sup3;/ч</div>
          <div>{argonFlow}</div>
        </div>}

        {heatCurrentTime && <div>
          <div>Под током</div>
          <div>{heatCurrentTime}</div>
        </div>}

        {heatWeight && <div>
          <div>Вес Ме, тн</div>
          <div>{heatWeight}</div>
        </div>}

        {energy && <div>
          <div>Энергия</div>
          <div>Подана</div>
        </div>}

        {argon && <div>
          <div>Аргон</div>
          <div>Включен</div>
        </div>}

        {vacuum && <div>
          <div>Вакуум</div>
          <div>Включен</div>
        </div>}
      </div>
    </CardBody>
  </Card>
}