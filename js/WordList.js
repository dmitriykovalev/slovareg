import React from 'react';

import Word from './Word.js';
import {mapToArray} from './Util';

const WordList = React.createClass({
  propTypes: {
    words: React.PropTypes.object.isRequired,
    selection: React.PropTypes.array.isRequired,
    lookup: React.PropTypes.func.isRequired,
    onSelectionChange: React.PropTypes.func.isRequired
  },

  render() {
    const words = mapToArray(this.props.words);
    if (words.length > 0) {
      words.sort((a, b) => a.text.localeCompare(b.text));
      return (
        <ol className='word-list'>
          {words.map(word =>
            <Word
              key={word.id}
              selected={this.props.selection.indexOf(word.id) >= 0}
              lookup={this.props.lookup}
              word={word.text}
              showTranscription={this.props.showTranscription}
              onSelectionChange={this.props.onSelectionChange.bind(null, word.id)}/>
          )}
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
