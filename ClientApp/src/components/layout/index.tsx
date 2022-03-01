import "./layout.scss";
import * as React from "react";
import NavMenu from './NavMenu';
import Footer from './Footer';
import { Container } from "reactstrap";


type LayoutProps = {
  children?: React.ReactElement
}

const Layout: React.FC<LayoutProps> = (props: LayoutProps) => {
  document.title = "ТИС ЭСПЦ"

  return <>
    <NavMenu />
    <main>
      <div id="shade"></div>
      <Container className="root-wrapper">{props.children}</Container>
      <Footer />
    </main>
  </>
}


export default Layout