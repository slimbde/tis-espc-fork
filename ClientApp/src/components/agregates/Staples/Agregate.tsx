import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"




export const Agregate: React.FC<AgregateInfo> = ({
  className,
  name,
  heatId,
  series,
  steelGrade,
  flow,
  castingSpeed,
  smeltStart,
  smeltTime,
  castingStart,
  state,

  heatIdDelayed,
  seriesDelayed,
  steelGradeDelayed,
  flowDelayed,
  castingSpeedDelayed,
  smeltStartDelayed,
  smeltTimeDelayed,
  castingStartDelayed,
  stateDelayed,
}) => {

  return <Card className={className}>
    <CardHeader>
      <div>{name}</div>
      <div title="Плавка" className={heatIdDelayed ? "delayed" : ""}>{heatId}</div>
      {series && <div title="Номер в серии">&nbsp;({series})</div>}
    </CardHeader>
    <CardBody></CardBody>
    <CardFooter>
      {steelGrade && <div className={steelGradeDelayed ? "delayed" : ""}>
        <div>Марка стали</div>
        <div>{steelGrade}</div>
      </div>}

      {flow && <div className={flowDelayed ? "delayed" : ""}>
        <div>Поток, т/ч</div>
        <div>{flow}</div>
      </div>}

      {castingSpeed && <div className={castingSpeedDelayed ? "delayed" : ""}>
        <div>Скорость</div>
        <div>{castingSpeed}</div>
      </div>}

      {smeltStart && <div className={smeltStartDelayed ? "delayed" : ""}>
        <div>Начало плавки</div>
        <div>{smeltStart}</div>
      </div>}

      {smeltTime && <div className={smeltTimeDelayed ? "delayed" : ""}>
        <div>Время плавки</div>
        <div>{smeltTime}</div>
      </div>}

      {castingStart && <div className={castingStartDelayed ? "delayed" : ""}>
        <div>Продолжительность</div>
        <div>{castingStart}</div>
      </div>}

      {state && <div className={stateDelayed ? "delayed" : ""}>
        <div>Состояние</div>
        <div>{state}</div>
      </div>}
    </CardFooter>
  </Card>
}