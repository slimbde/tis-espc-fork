import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { AgregateState } from "models/types/Agregates/Staples/AgregateState"
import { Link } from "react-router-dom"
import { Card, CardBody, CardHeader } from "reactstrap"
import { AKPView } from "./views/akp"
import { CCMView } from "./views/ccm12"
import { DSPView } from "./views/dsp"




export const Agregate: React.FC<AgregateInfo> = ({
  name,
  argon,
  argonFlow,
  argonPressure,
  capdown,
  castingSpeed,
  castedMeters,
  castedTonns,
  currentTemp,
  eeHeatActive,
  energy,
  empty,
  flushSteel,
  flushSlag,
  heatId,
  heatStart,
  heatTime,
  heatEnd,
  heatWeight,
  heatCurrentTime,
  ladleId,
  series,
  slabWidth,
  slabThickness,
  state,
  steelGrade,
  streamCast,
  tgs,
  vacuum,
  vacuumTime,
  vacuumPressure,

  dataDelayed,
}) => {

  const detailsLink = (heatId?: string) => {
    switch (name) {
      case "МНЛЗ-1": return "staple/ccm1"
      case "МНЛЗ-2": return "staple/ccm2"
      case "ДСП": return "staple/dsp"
      case "АКОС": return "staple/akos"
      case "АКП2-1поз": return `staple/akp/1/${heatId}`
      case "АКП2-2поз": return `staple/akp/2/${heatId}`
      case "ВД-1поз": return `staple/vd/1/${heatId}`
      case "ВД-2поз": return `staple/vd/2/${heatId}`
      default: return "staple"
    }
  }



  return <Card className={`${dataDelayed ? "delayed" : ""}`}>
    <CardHeader className={state}>
      <div>{name}</div>
      <div>
        <Link title="Посмотреть подробно" to={detailsLink(heatId)}>{heatId}</Link>
        {series && <div title="Номер в серии">&nbsp;({series})</div>}
      </div>

    </CardHeader>

    <CardBody className={state}>
      {name?.indexOf("МНЛЗ") !== -1 && <CCMView cast={streamCast!} head={tgs!} />}
      {name === "ДСП" && <DSPView energy={energy!} coldIdle={state === AgregateState.IDLE} flushSteel={flushSteel!} flushSlag={flushSlag!} />}
      {name === "АКОС" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name?.indexOf("АКП") !== -1 && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name?.indexOf("ВД") !== -1 && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}

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

        {heatStart && <div className="duration">
          <div>Начало</div>
          <div>{heatStart}</div>
        </div>}

        {heatTime !== "00:00:00" && !!heatTime && <div>
          <div>Время</div>
          <div>{heatTime}</div>
        </div>}

        {heatEnd && <div className="duration">
          <div>Конец</div>
          <div>{heatEnd}</div>
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

        {ladleId && name?.indexOf("МНЛ") === -1 && <div>
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

        {heatWeight && name?.indexOf("МНЛЗ") === -1 && <div>
          <div>Вес Ме, тн</div>
          <div>{heatWeight}</div>
        </div>}

        {vacuumTime && <div>
          <div>Вакуум время</div>
          <div>{vacuumTime}</div>
        </div>}

        {vacuumPressure && <div>
          <div>P, мм.рт.ст</div>
          <div>{vacuumPressure}</div>
        </div>}

        {vacuum && <div>
          <div>Вакуум</div>
          <div>Включен</div>
        </div>}
      </div>
    </CardBody>
  </Card>
}