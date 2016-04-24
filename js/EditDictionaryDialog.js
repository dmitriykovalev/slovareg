import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Button, ButtonInput, Input, Modal} from 'react-bootstrap';

const EditDictionaryDialog = React.createClass({
  propTypes: {
    show: React.PropTypes.bool.isRequired,
    onDone: React.PropTypes.func.isRequired, // f(name, words)
    onHide: React.PropTypes.func.isRequired, // f()

    title: React.PropTypes.string.isRequired,
    submitText: React.PropTypes.string.isRequired,

    name: React.PropTypes.string,
    words: React.PropTypes.string,
  },

  mixins: [LinkedStateMixin],

  getDefaultProps() {
    return {
      name: '',
      words: ''
    };
  },

  getInitialState() {
    return {
      name: '',
      words: ''
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
      words: nextProps.words
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    const {name, words} = this.state;
    if (name.trim()) {
      this.props.onDone(name, words);
      this.props.onHide();
    }
  },

  render() {
    return (
      <Modal
        bsSize='large'
        animation={false}
        onHide={this.props.onHide}
        show={this.props.show}>
        <form>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Input
              ref='name'
              type='text'
              placeholder='Name'
              valueLink={this.linkState('name')}
              autoFocus/>
            <Input
              ref='words'
              type='textarea'
              style={{height: '200px'}}
              placeholder='Words'
              valueLink={this.linkState('words')}/>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Cancel</Button>
            <Button
              bsStyle='primary'
              disabled={!this.state.name.trim()}
              onClick={this.handleSubmit}>{this.props.submitText}</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});

export default EditDictionaryDialog;
