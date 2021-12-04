import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"
import { AKPView } from "./akp"
import { CCMView } from "./ccm12"
import { DSPView } from "./dsp"




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
  streamCast,
  tsg,
  energy,
  refining,
  argon,
  capdown,
  empty,
  vacuum,

  dataDelayed,
  lastUpdate,
}) => {

  return <Card className={`${className ?? ""} ${dataDelayed ? "delayed" : ""}`}>
    <CardHeader>
      <div>{name}</div>
      <div title="Плавка">{heatId}</div>
      {series && <div title="Номер в серии">&nbsp;({series})</div>}
    </CardHeader>

    <CardBody>
      {name === "МНЛЗ-1" && <CCMView cast={streamCast!} head={`s10`} />}
      {name === "МНЛЗ-2" && <CCMView cast={streamCast!} head={tsg!} />}
      {name === "ДСП" && <DSPView energy={energy!} refining={refining!} />}
      {name === "АКОС" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "АКП-1" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "АКП-2" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "ВД-1" && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "ВД-2" && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}
    </CardBody>

    <CardFooter>
      {steelGrade && <div>
        <div>Марка стали</div>
        <div>{steelGrade}</div>
      </div>}

      {flow && <div>
        <div>Поток, т/ч</div>
        <div>{flow}</div>
      </div>}

      {castingSpeed && <div>
        <div>Скорость, м&sup3;/мин</div>
        <div>{castingSpeed}</div>
      </div>}

      {smeltStart && <div>
        <div>Начало плавки</div>
        <div>{smeltStart}</div>
      </div>}

      {smeltTime && <div>
        <div>Продолжительность</div>
        <div>{smeltTime}</div>
      </div>}

      {castingStart && <div>
        <div>Продолжительность</div>
        <div>{castingStart}</div>
      </div>}

      {state && <div>
        <div>Состояние</div>
        <div>{state}</div>
      </div>}

      {argon && <div>
        <div>Аргон</div>
        <div>Включен</div>
      </div>}

      {energy && <div>
        <div>Энергия</div>
        <div>Подана</div>
      </div>}

      {vacuum && <div>
        <div>Вакуумирование</div>
        <div>Включено</div>
      </div>}
    </CardFooter>
  </Card>
}