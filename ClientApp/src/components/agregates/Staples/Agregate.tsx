import { AgregateInfo } from "models/types/Agregates/Staples/AgregateInfo"
import { Link } from "react-router-dom"
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap"
import { AKPView } from "./views/akp"
import { CCMView } from "./views/ccm12"
import { DSPView } from "./views/dsp"




export const Agregate: React.FC<AgregateInfo> = ({
  className,
  name,
  heatId,
  series,
  steelGrade,
  flowSpeed,
  castingSpeed,
  heatStart,
  heatTime,
  tgs,
  streamCast,
  slabWidth,
  slabThickness,
  castedMeters,
  castedTonns,
  energy,
  refining,
  argon,
  capdown,
  empty,
  vacuum,

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


  return <Card className={`${className ?? ""} ${dataDelayed ? "delayed" : ""}`}>
    <CardHeader>
      <div>{name}</div>
      <div>
        {name === "МНЛЗ-2" || name === "МНЛЗ-1" ? <Link title="Посмотреть подробно" to={detailsLink}>{heatId}</Link> : <>{heatId}</>}
      </div>
      {series && <div title="Номер в серии">&nbsp;({series})</div>}
    </CardHeader>

    <CardBody>
      {name === "МНЛЗ-1" && <CCMView cast={streamCast!} head={`s10`} />}
      {name === "МНЛЗ-2" && <CCMView cast={streamCast!} head={tgs!} />}
      {name === "ДСП" && <DSPView energy={energy!} refining={refining!} />}
      {name === "АКОС" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "АКП2-1поз" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "АКП2-2поз" && <AKPView energy={energy!} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "ВД-1поз" && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}
      {name === "ВД-2поз" && <AKPView vd vacuum={vacuum} argon={argon!} capdown={capdown!} empty={empty!} />}
    </CardBody>

    <CardFooter>
      {steelGrade && <div>
        <div>Марка стали</div>
        <div>{`${steelGrade} ${slabWidth ? `${slabWidth}*` : ""}${slabThickness ? slabThickness : ""}`}</div>
      </div>}

      {castingSpeed && <div>
        <div>Скорость, м&sup3;/мин</div>
        <div>{castingSpeed}</div>
      </div>}

      {heatStart && <div>
        <div>Начало плавки</div>
        <div>{heatStart}</div>
      </div>}

      {heatTime && <div>
        <div>Продолжительность</div>
        <div>{heatTime}</div>
      </div>}

      {castedMeters && <div>
        <div>Отлито м (тонн)</div>
        <div>{castedMeters} ({castedTonns})</div>
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