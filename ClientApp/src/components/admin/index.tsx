import "./admin.scss"
import { useEffect, useRef, useState } from "react"
import { Alert, Button, Input, InputGroup, InputGroupAddon, Label, Table } from "reactstrap"
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import { blinkAlert } from "components/extra/Alert"


type State = {
  role: string
  roleUsers: string[]
  name: string
}


export const Admin: React.FC = () => {
  const nameInput = useRef<HTMLInputElement>(null)

  const [state, setState] = useState<State>({
    role: "Технолог",
    roleUsers: [],
    name: "",
  })

  useEffect(() => {
    aHandler.GetUsersForRoleAsync(state.role)
      .then(roleUsers => setState({ ...state, roleUsers }))
      .catch(console.log)
    // eslint-disable-next-line
  }, [state.role])


  const append = async () => {
    if (nameInput.current!.value === "") {
      blinkAlert("Вы не ввели имя пользователя", false)
      return
    }

    const found = state.roleUsers.filter(u => u.toUpperCase() === state.name.toUpperCase())
    if (found.length > 0) {
      blinkAlert("Пользователь уже зарегистрирован", false)
      return
    }

    try {
      await aHandler.AddUserToRoleAsync(state.name, state.role)
      blinkAlert("Пользователь успешно зарегистрирован", true)
      setState({ ...state, roleUsers: [...state.roleUsers, state.name] })
      nameInput.current!.value = ""
    }
    catch (error) {
      blinkAlert("Не удалось добавить пользователя", false)
      console.log(error)
    }
  }


  const deleteUser = async (user: string) => {
    if (window.confirm("Удалить пользователя?")) {
      try {
        await aHandler.DeleteUserAsync(user, state.role)
        blinkAlert("Пользователь удален", true)
        setState({ ...state, roleUsers: state.roleUsers.filter(u => u !== user) })
      } catch (error) {
        blinkAlert("Не удалось удалить пользователя", false)
        console.log(error)
      }
    }
  }



  return <div className="admin-wrapper jumbotron">
    <Alert id="alert">Hello</Alert>
    <div className="title display-5">Администрирование пользователей</div>

    <div className="role">
      <Label htmlFor="role">Роль</Label>
      <InputGroup size="sm">
        <Input
          className="col-sm-10"
          id="role"
          type="select"
          value={state.role}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, role: e.target.value })}
        >
          <option>Технолог</option>
          <option>Программист</option>
          <option>Пользователь</option>
          <option>Администратор</option>
        </Input>
      </InputGroup>
    </div>

    <div className="input">
      <Label htmlFor="user">Пользователь</Label>
      <InputGroup size="sm">
        <Input
          type="text"
          id="user"
          innerRef={nameInput}
          value={state.name}
          autoComplete="off"
          placeholder="MECHEL\IvanovNA..."
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setState({ ...state, name: e.target.value })}
        />
        <InputGroupAddon addonType="append">
          <Button outline color="secondary" onClick={append}>Добавить</Button>
        </InputGroupAddon>
      </InputGroup>
    </div>

    <Table size="sm" hover>
      <thead>
        <tr>
          <th>№</th>
          <th>Пользователь</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {state.roleUsers.length > 0 && state.roleUsers
          .sort((a, b) => a < b ? -1 : a > b ? 1 : 0)
          .map((u: string, idx: number) =>
            <tr key={u}>
              <td>{idx + 1}</td>
              <td>{u}</td>
              <td><p className="a-like" title="Удалить" onClick={() => deleteUser(u)}>[-]</p></td>
            </tr>)}
      </tbody>
    </Table>

    <div className="img"></div>
  </div>
}