import React from 'react';
import {Button, FormGroup, FormControl, Modal} from 'react-bootstrap';

const LoginForm = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func  // f(login, password)
  },

  getInitialState() {
    return {
      login: '',
      password: '',
      error: null
    };
  },

  handleSubmit(event) {
    event.preventDefault();

    const {login, password} = this.state;
    this.props.onSubmit(login, password).then(error => {
      this.setState({
        password: (error ? '' : password),
        error: (error ? error.message : null)
      });
    });
  },

  handleLoginChange(event) {
    this.setState({login: event.target.value});
  },

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  },

  render() {
    return (
      <Modal
        bsSize='small'
        show={true}
        animation={false}>
        <form>
          <Modal.Header>
            <Modal.Title>Slovareg</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId='login'>
              <FormControl
                type='text'
                placeholder='Login'
                value={this.state.login}
                onChange={this.handleLoginChange}
                autoFocus/>
            </FormGroup>
            <FormGroup controlId='password'>
              <FormControl
                type='password'
                placeholder='Password'
                value={this.state.password}
                onChange={this.handlePasswordChange}/>
            </FormGroup>
            <p className='text-warning'><small>{this.state.error}</small></p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type='submit'
              bsStyle='primary'
              disabled={!this.state.login || !this.state.password}
              onClick={this.handleSubmit}>Login</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});

export default LoginForm;
