import React from 'react';

import Toolbar from './Toolbar';
import WordList from './WordList';

const Dictionary = React.createClass({
  propTypes: {
    dict: React.PropTypes.object.isRequired,
    onAddWords: React.PropTypes.func.isRequired,
    onDeleteWords: React.PropTypes.func.isRequired,
    onMoveWords: React.PropTypes.func.isRequired,
    moveToItems: React.PropTypes.arrayOf(React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      key: React.PropTypes.string.isRequired
    })).isRequired,
    getLookup: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {selection: []};
  },

  setSelection(selection) {
    this.setState({selection: selection});
  },

  handleSelectionChange(wordId, selected) {
    const ids = this.state.selection;

    if (selected) {
      this.setSelection([...ids, wordId]);
    } else {
      const index = ids.indexOf(wordId);
      this.setSelection([...ids.slice(0, index),
                         ...ids.slice(index + 1)]);
    }
  },

  handleSelect(eventKey) {
    switch (eventKey) {
      case 'all':
        this.setSelection(Object.keys(this.props.dict.words));
        break;
      case 'none':
        this.setSelection([]);
        break;
    }
  },

  handleDeleteWords() {
    this.props.onDeleteWords(this.state.selection);
    this.setSelection([]);
  },

  handleMoveWords(dictId) {
    this.props.onMoveWords(dictId, this.state.selection);
    this.setSelection([]);
  },

  render() {
    return (
      <div className='content'>
        <div className='toolbar'>
          <Toolbar
            selection={this.state.selection}
            moveToItems={this.props.moveToItems}
            onSelect={this.handleSelect}
            onAddWords={this.props.onAddWords}
            onDeleteWords={this.handleDeleteWords}
            onMoveWords={this.handleMoveWords}/>
        </div>

        <div className='words'>
          <WordList
            words={this.props.dict.words}
            lookup={this.props.getLookup()}
            selection={this.state.selection}
            onSelectionChange={this.handleSelectionChange}/>
        </div>
      </div>
    );
  },
});

export default Dictionary;
