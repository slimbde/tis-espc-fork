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
                <DropdownToggle nav className={location.indexOf("/overview") > -1 || location.indexOf("/tpa") > -1 || location.indexOf("/dispatcher") > -1 ? "active" : ""}>Обзор</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag={Link} to="/dispatcher">Обзор ОНРС ККЦ</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={Link} to="/tpa">МНЛЗ-5. Простои ТПА</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>,

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav >Ресурсы</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag={"a"} href="http://chmk-web02.chmk.mechelgroup.ru/kkc/">Веб-сервер АСИС «ККЦ-Прокат»</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={"a"} href="http://10.2.59.136/">Веб-сервер More Intelligence</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              {this.state.userRoleRating > 1 &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/tech-params") > -1 ? "active" : ""}>Технология</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} to="/tech-params">МНЛЗ-5. Корректив параметров</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}

              {this.state.userRoleRating > 2 &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/diagnostic") > -1 ? "active" : ""}>Диагностика</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} to="/diagnostic">Состояние сервисов</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}

              {this.state.userRoleRating > 3 &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/admin") > -1 || location.indexOf("/hpe") > -1 ? "active" : ""}>Администрирование</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} to="/admin">Администрирование пользователей</NavLink></DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><NavLink tag={Link} to="/hpe">HPE VM Explorer</NavLink></DropdownItem>
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
