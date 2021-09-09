import { Loading } from "components/extra/Loading"
import "./notAuthorized.scss"

export const NotAuthorized: React.FC = () =>
  <div className="not-authorized">
    <div className="display-5 title">ТИС ЭСПЦ. Авторизация</div>
    <span>
      <div>
        Для работы с приложением необоходимо авторизоваться учетными данными доменной учетной записи.<br /> Если окно регистрации долго не появляется, попробуйте перезагрузить страницу.<br />Если доступ есть, а регистрация не проходит, необходимо обратиться в техподдержку по тел. 08. Если заявка на доступ не оформлялась, необходимо ее зарегистрировать в техподдержке "На доступ к ресурсу "ТИС ЭСПЦ".
        <hr />
        <p className="small text-muted">АСУТП 2021</p>
      </div>
      <Loading />
    </span>
  </div>