import React, { Component } from 'react';
import { Collapse, Container, DropdownItem, DropdownMenu, DropdownToggle, Navbar, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap';
import { NavLink as Link, withRouter } from 'react-router-dom';
import aHandler from "models/handlers/DbHandlers/AuthDbHandler"
import { UserRole } from "models/types/Auth/UserRole";


type NavProps = {
  location: any
}

type NavState = {
  collapsed: boolean
  userRole: UserRole
}


class NavMenu extends Component<NavProps> {

  state: NavState = {
    collapsed: true,
    userRole: UserRole.Пользователь,
  }

  componentDidMount = () => this.setState({ userRole: aHandler.GetRoleFromStash() })


  render() {
    //console.log(location)
    const location = this.props.location.pathname

    return <header className="position-relative" style={{ zIndex: 1 }}>
      <Navbar className="navbar-expand-sm bg-dark box-shadow" dark>
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
              </UncontrolledDropdown>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav className={location.indexOf("/agregates") > -1 ? "active" : ""}> Агрегаты</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag={Link} to="/agregates/staple">Основные</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag={Link} to="/agregates/dryers/2/summary">Сушка/Разогрев</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav>Ресурсы</DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem><NavLink tag="a" href="http://10.2.19.215" target="_blank">Старый веб-сервер</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag="a" href="http://10.2.19.223/espc6temp/app/main/index.php" target="_blank">Учет сыпучих материалов и ферросплавов</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag="a" href="http://10.2.19.235" target="_self">Краны ЭСПЦ</NavLink></DropdownItem>
                  <DropdownItem><NavLink tag="a" href="http://10.2.19.226" target="_self">Разливка ЭСПЦ</NavLink></DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              {this.state.userRole > UserRole.Пользователь &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/technology") > -1 ? "active" : ""}>Технология</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} to="/technology/production">Производство</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag={Link} to="/technology/schedule">График работы</NavLink></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}

              {this.state.userRole > UserRole.Технолог &&
                <>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav className={location.indexOf("/diagnostic") > -1 ? "active programmer" : "programmer"}>Диагностика</DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem><NavLink tag={Link} to="/diagnostic/services">Состояние сервисов</NavLink></DropdownItem>
                      <DropdownItem><NavLink tag={Link} to="/diagnostic/operator">Журнал действий оператора</NavLink></DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav className={location.indexOf("/cams") > -1 ? "active programmer" : "programmer"}>Камеры</DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem><NavLink tag={Link} to="/cams/akos">АКОС</NavLink></DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </>}

              {this.state.userRole > UserRole.Программист &&
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav className={location.indexOf("/admin") > -1 ? "active admin" : "admin"}>Администрирование</DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem><NavLink tag={Link} exact to="/admin">Администрирование пользователей</NavLink></DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><NavLink tag={Link} to="/admin/hpe">HPE VM Explorer</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag="a" href="https://10.2.19.201/ui/#/login" target="_blank">Гипервизор МНЛЗ</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag="a" href="https://10.2.19.200/ui/#/login" target="_blank">Гипервизор АКП-2</NavLink></DropdownItem>
                    <DropdownItem><NavLink tag="a" href="https://10.2.19.202/ui/#/login" target="_blank">Гипервизор АКП-2</NavLink></DropdownItem>
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
