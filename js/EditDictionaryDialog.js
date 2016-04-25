import React from 'react';
import {Button, FormGroup, FormControl, Input, Modal} from 'react-bootstrap';

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

  handleNameChange(event) {
    this.setState({name: event.target.value});
  },

  handleWordsChange(event) {
    this.setState({words: event.target.value});
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

          <FormGroup controlId='name'>
            <FormControl
              type='text'
              placeholder='Name'
              value={this.state.name}
              onChange={this.handleNameChange}
              autoFocus/>
          </FormGroup>
          <FormGroup controlId='words'>
            <FormControl
              componentClass='textarea'
              placeholder='Words'
              value={this.state.words}
              onChange={this.handleWordsChange}/>
          </FormGroup>

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
