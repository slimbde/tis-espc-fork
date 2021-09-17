import React, { Component } from 'react';
import { Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Navbar, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap';
import { NavLink as Link, withRouter } from 'react-router-dom';
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"


type NavProps = {
  location: any
}

type NavState = {
  collapsed: boolean
  userRoleRating: number
}


class NavMenu extends Component<NavProps> {

  state: NavState = {
    collapsed: true,
    userRoleRating: 0,
  }

  componentDidMount() {
    const role = aHandler.GetRoleFromStash()
    if (role) {
      switch (role) {
        case "Пользователь": this.setState({ userRoleRating: 1 }); break
        case "Технолог": this.setState({ userRoleRating: 2 }); break
        case "Программист": this.setState({ userRoleRating: 3 }); break
        case "Администратор": this.setState({ userRoleRating: 4 }); break
      }
    }
  }


  render() {
    //console.log(location)
    const location = this.props.location.pathname

    return <header className="position-relative" style={{ zIndex: 1 }}>
      <Navbar className="navbar-expand-lg navbar-toggleable-lg bg-dark box-shadow" dark>
        <Container className="pt-0">
          <Collapse className="flex-lg-row-reverse" isOpen={!this.state.collapsed} navbar>
            <ul className="navbar-nav nav-ul w-100" id="nav-ul">
              <NavItem className="float-left">
                <NavLink tag={Link} to="/home">ГЛАВНАЯ</NavLink>
              </NavItem>
              <span className="flex-grow-1">&nbsp;</span>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className={location.indexOf("/overview") > -1 ? "active" : ""}>Обзор</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag={Link} to="/overview/arms">Мониторинг АРМ</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={Link} to="/overview/compressor/main">Компрессорная</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>,

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className={location.indexOf("/agregates") > -1 ? "active" : ""}> Агрегаты</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag={Link} to="/agregates/staple">Основные</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={Link} to="/agregates/dries">Сушка</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={Link} to="/agregates/molding">Разливка</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>Ресурсы</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag={Link} to={{ pathname: "http://10.2.19.215" }} target="_blank">Старый веб-сервер</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={Link} to={{ pathname: "http://10.2.19.223/espc6temp/app/main/index.php" }} target="_blank">Учет сыпучих материалов и ферросплавов</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              {this.state.userRoleRating > 1 &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/technology") > -1 ? "active" : ""}>Технология</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} to="/technology/production">Производство</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}

              {this.state.userRoleRating > 2 &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/diagnostic") > -1 ? "active programmer" : "programmer"}>Диагностика</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} to="/diagnostic/services">Состояние сервисов</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag={Link} to="/diagnostic/operator">Журнал действий оператора</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}

              {this.state.userRoleRating > 3 &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/admin") > -1 ? "active admin" : "admin"}>Администрирование</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} exact to="/admin">Администрирование пользователей</NavLink></DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><NavLink tag={Link} to="/admin/hpe">HPE VM Explorer</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag={Link} to={{ pathname: "https://10.2.19.201/ui/#/login" }} target="_blank">Гипервизор МНЛЗ</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag={Link} to={{ pathname: "https://10.2.19.200/ui/#/login" }} target="_blank">Гипервизор АКП-2</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag={Link} to={{ pathname: "https://10.2.19.202/ui/#/login" }} target="_blank">Гипервизор АКП-2</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}

            </ul>
          </Collapse>
        </Container>
      </Navbar >
    </header >
  }
}

export default withRouter(NavMenu as any)
