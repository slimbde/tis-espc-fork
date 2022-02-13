import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
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

  dataDelayed,
  lastUpdate,
}) => {

  const detailsLink = () => {
    switch (name) {
      case "МНЛЗ-1": return "staple/ccm1"
      case "МНЛЗ-2": return "staple/ccm2"
      case "ДСП": return "staple/dsp"
      case "АКОС": return "staple/akos"
      case "АКП2-1поз": return "staple/akp1"
      case "АКП2-2поз": return "staple/akp2"
      case "ВД-1поз": return "staple/vd1"
      case "ВД-2поз": return "staple/vd2"
      default: return "staple"
    }
  }

  const cardStatusStyle = () => {
    let className = ""

    if (castingSpeed && flowSpeed && +castingSpeed > 0 && +flowSpeed > 0) className += "process"
    if (energy || argon || vacuum || (eeHeatActive && eeHeatActive !== "0")) className += "process"

    return className
  }


  return <Card className={`${dataDelayed ? "delayed" : ""}`}>
    <CardHeader className={cardStatusStyle()}>
      <div>{name}</div>
      <div>
        {name === "МНЛЗ-2" || name === "МНЛЗ-1" || name === "ДСП" || name === "АКОС" ? <Link title="Посмотреть подробно" to={detailsLink}>{heatId}</Link> : <>{heatId}</>}
        {series && <div title="Номер в серии">&nbsp;({series})</div>}
      </div>

    </CardHeader>

    <CardBody className={cardStatusStyle()}>
      {name === "МНЛЗ-1" && <CCMView cast={streamCast!} head={`s10`} />}
      {name === "МНЛЗ-2" && <CCMView cast={streamCast!} head={tgs!} />}
      {name === "ДСП" && <DSPView energy={energy!} coldIdle={!eeHeatActive} flushSteel={flushSteel!} flushSlag={flushSlag!} />}
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
          <div>Время</div>
          <div>{heatTime}</div>
        </div>}

        {castedMeters && <div>
          <div>Отлито, м</div>
          <div>{castedMeters}</div>
        </div>}

        {castedTonns && <div>
          <div>Отлито, т</div>
          <div>{castedTonns}</div>
        </div>}

        {eeHeatActive && <div>
          <div>Расход ЭЭ</div>
          <div>{eeHeatActive}</div>
        </div>}

        {currentTemp && name === "АКОС" && <div>
          <div>Температура</div>
          <div>{currentTemp}</div>
        </div>}

        {ladleId && name === "АКОС" && <div>
          <div>Номер с/к</div>
          <div>{ladleId}</div>
        </div>}

        {argonPressure && name === "АКОС" && <div>
          <div>Ar, атм м&sup3;/ч</div>
          <div>{argonPressure}&nbsp;&nbsp;&nbsp;{argonFlow}</div>
        </div>}

        {heatCurrentTime && <div>
          <div>Под током</div>
          <div>{heatCurrentTime}</div>
        </div>}

        {heatWeight && name === "АКОС" && <div>
          <div>Вес Ме</div>
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