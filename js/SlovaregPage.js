import animate from './BetaAnimation';
import LoginDialog from './LoginDialog';
import DictionaryList from './DictionaryList';

import React from 'react';
import {Nav, Navbar, NavDropdown, MenuItem} from 'react-bootstrap';

const Header = ({title, onSelect}) =>
  <Navbar fixedTop fluid>
    <Navbar.Header>
      <Navbar.Brand>
        <a href='#'>
          <span id='slovareg'>Slovareg</span>
          <span id='beta'>BETA</span>
        </a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>

    <Navbar.Collapse>
      <Nav onSelect={onSelect} pullRight>
        <NavDropdown
          id='navigation'
          title={title}>
          <MenuItem eventKey='profile'>Profile</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey='logout'>Log Out</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>;

const Footer = () =>
  <div className='footer'>
    Реализовано с помощью сервиса API <a href='http://api.yandex.ru/dictionary/'>«Яндекс.Словарь»</a>
  </div>;

const SlovaregPage = React.createClass({
  propTypes: {
    // fb
    // globalConfig -- promise
    onLogout: React.PropTypes.func,
    onLogin: React.PropTypes.func,  // returns promise
  },

  componentDidMount() {
    if (this.props.fb.getAuth()) {
      const beta = document.getElementById('beta');
      animate(beta, 90.0, 0.0);
    }
  },

  handleSelect(eventKey) {
    if (eventKey === 'logout') {
      this.props.onLogout();
    } else if (eventKey === 'profile') {
      // TODO:
    }
  },

  render() {
    if (this.props.fb.getAuth()) {
      return (
        <div>
          <Header title={this.props.fb.getAuth().password.email} onSelect={this.handleSelect} />
          <DictionaryList fb={this.props.fb}/>
          <Footer/>
        </div>
      );
    } else {
      return (
        <LoginDialog onSubmit={this.props.onLogin}/>
      );
    }
  }
});

export default SlovaregPage;
