import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Word from './Word.js';
import {mapToArray} from './Util';

const WordList = React.createClass({
  propTypes: {
    words: React.PropTypes.object.isRequired,
    selection: React.PropTypes.array.isRequired,
    lookup: React.PropTypes.func.isRequired,
    onSelectionChange: React.PropTypes.func.isRequired
  },

  scrollWordIntoView(wordId) {
    var node = ReactDOM.findDOMNode(this.refs[wordId]);
    node.scrollIntoView();
  },

  render() {
    const words = mapToArray(this.props.words);
    if (words.length > 0) {
      words.sort((a, b) => a.text.localeCompare(b.text));
      return (
        <ol className='word-list'>
          <ReactCSSTransitionGroup
            transitionName='word'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}>
            {words.map(word =>
              <Word
                key={word.id}
                selected={this.props.selection.indexOf(word.id) >= 0}
                lookup={this.props.lookup}
                word={word.text}
                showTranscription={this.props.showTranscription}
                onSelectionChange={this.props.onSelectionChange.bind(null, word.id)}/>
            )}
          </ReactCSSTransitionGroup>
        </ol>
      );
    } else {
      return (
        <div>Dictionary is empty.</div>
      );
    }
  }
});

export default WordList;
