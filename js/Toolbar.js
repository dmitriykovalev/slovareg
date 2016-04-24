import React from 'react';
import {Glyphicon, Button, ButtonGroup, ButtonToolbar, DropdownButton, Input, MenuItem} from 'react-bootstrap';

const Toolbar = React.createClass({
  propTypes: {
    selection: React.PropTypes.array.isRequired,
    moveToItems: React.PropTypes.array.isRequired,
    onSelect: React.PropTypes.func.isRequired,       /* f(key=['all' or 'none'])*/
    onAddWords: React.PropTypes.func.isRequired,     /* f(wordStr) */
    onDeleteWords: React.PropTypes.func.isRequired,  /* f() */
    onMoveWords: React.PropTypes.func.isRequired,    /* f(dictId) */
  },

  handleSelect(event, eventKey) {
    this.props.onSelect(eventKey);
  },

  handleAddWords(event) {
    const wordsStr = this.refs.addWords.getValue();
    this.refs.addWords.getInputDOMNode().value = '';
    this.props.onAddWords(wordsStr);
  },

  handleAddWordsOnEnter(event) {
    if (event.keyCode === 13) {
      this.handleAddWords(event);
    }
  },

  handleDeleteWords(event) {
    this.props.onDeleteWords();
  },

  handleMoveWords(event, eventKey) {
    this.props.onMoveWords(eventKey);
  },

  render() {
    const emptySelection = (this.props.selection.length === 0);

    return (
      <ButtonToolbar>
        <DropdownButton onSelect={this.handleSelect} title='' id='select-actions'>
          <MenuItem eventKey='all'>All</MenuItem>
          <MenuItem eventKey='none'>None</MenuItem>
        </DropdownButton>

        <ButtonGroup style={{width: '200px'}}>
          <Input
            ref='addWords'
            type='text'
            onKeyUp={this.handleAddWordsOnEnter}
            buttonAfter={<Button onClick={this.handleAddWords}>Add</Button>} />
        </ButtonGroup>

        <ButtonGroup>
          <Button
            disabled={emptySelection}
            onClick={this.handleDeleteWords}>
            Delete
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <DropdownButton
            disabled={emptySelection}
            onSelect={this.handleMoveWords}
            title='Move To'
            id='word-actions'>
              {this.props.moveToItems.map(item =>
                <MenuItem key={item.key} eventKey={item.key}>{item.name}</MenuItem>
              )}
          </DropdownButton>
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
});

export default Toolbar;
