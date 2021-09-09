import "./home.scss"
import React, { useState } from "react"


export const Home: React.FC = () => {

  const [showInfo, setShowInfo] = useState(false)

  return <div className="home-wrapper">
    <div className="jumbotron">
      <h1 className="display-5">ТИС ЭСПЦ. Электросталеплавильное отделение</h1>
      <div className="photo-wrapper">
        <div className="banner"></div>
      </div>
      <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowInfo(!showInfo)}>О системе &raquo;</button>
      <div className={`home-info${showInfo ? " visible" : ""}`}>
        <div>
          <h4>О системе</h4>
          <p>Технологическая информационная система ТИС ЭСПЦ электросталеплавильное отделение предназначена для обеспечения пользователей информацией по агрегатам АКП-2, ВКД, МНЛЗ-2</p>

          <h4>Ответвенные за систему:</h4>
          <ul>
            <li>Петрова А.Н.&nbsp;тел.: 5-23-41 (ДАСУТП)</li>
            <li>Долгий Г.Р.&nbsp;тел.: 4-17-62 (ДАСУТП)</li>
          </ul>
        </div>

        <div>
          <h4>Функции системы:</h4>
          <ul>
            <li>предоставление технологических отчетов</li>
            <li>предоставление информации о действиях операторов</li>
            <li>мониторинг экранов АРМ</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
}