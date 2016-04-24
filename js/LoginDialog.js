import React from 'react';
import {Button, ButtonInput, Input, Modal} from 'react-bootstrap';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

const LoginForm = React.createClass({
  propTypes: {
    onSubmit: React.PropTypes.func  // f(login, password)
  },

  mixins: [LinkedStateMixin],

  getInitialState() {
    return {
      login: '',
      password: '',
      error: null
    };
  },

  handleSubmit(event) {
    event.preventDefault();

    this.props.onSubmit(this.state.login,
                        this.state.password).then(error => {
      this.setState({
        password: (error ? '' : self.state.password),
        error:    (error ? error.message : null)
      });
    });
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
            <Input
              ref='login'
              type='text'
              placeholder='Login'
              valueLink={this.linkState('login')}
              autoFocus />
            <Input
              ref='password'
              type='password'
              placeholder='Password'
              valueLink={this.linkState('password')} />
            <p className='text-warning'><small>{this.state.error}</small></p>
          </Modal.Body>
          <Modal.Footer>
            <ButtonInput
              type='submit'
              value='Login'
              bsStyle='primary'
              disabled={!this.state.login || !this.state.password}
              onClick={this.handleSubmit} />
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});

export default LoginForm;
