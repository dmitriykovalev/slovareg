import React from 'react';
import {Button, Modal} from 'react-bootstrap';

const DeleteDictionaryDialog = React.createClass({
  propTypes: {
    show: React.PropTypes.bool.isRequired,
    onDone: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,

    name: React.PropTypes.string,
  },

  handleSubmit(event) {
    event.preventDefault();
    this.props.onDone();
    this.props.onHide();
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
            <Modal.Title>Delete dictionary '{this.props.name}'</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={this.props.onHide}>Cancel</Button>
            <Button bsStyle='danger' onClick={this.handleSubmit}>Delete</Button>
          </Modal.Footer>
        </form>
      </Modal>
    );
  }
});

export default DeleteDictionaryDialog;
