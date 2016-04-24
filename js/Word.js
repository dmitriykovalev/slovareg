import React from 'react';
import {Glyphicon} from 'react-bootstrap';
import ReactDOM from 'react-dom';
import LookupPopover from './LookupPopover';
import {interleave} from './Util';

const WordTag = ({text}) => <span className='word'>{text}</span>;

const TranscriptionTag = ({text}) => <span className='transcription'>{text}</span>;

const PosTag = ({pos}) => <span className='pos'>{`${pos}: `}</span>;

const TranslationTag = ({text}) => <span className='translation'>{text}</span>;

const SpeakTag = ({onSpeak}) => 'speechSynthesis' in window ?
  <Glyphicon
    style={{cursor: 'pointer', fontSize: '10px'}}
    onClick={onSpeak}
    glyph='bullhorn'/> : null;

const Word = React.createClass({
  propTypes: {
    word: React.PropTypes.string.isRequired,
    lookup: React.PropTypes.func.isRequired,
    onSelectionChange: React.PropTypes.func.isRequired,
    selected: React.PropTypes.bool.isRequired
  },

  handleSpeak(event) {
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.props.word));
  },

  getTranslations(word) {
    this.props.lookup(word, 'en', 'ru').then(res => {
      if (this.isMounted()) {
        this.setState(res);
      }
    }, error => {
      this.setState({'transcription': `[${error.message}]`});
    });
  },

  handleChange(event) {
    var selected = event.target.checked;
    this.props.onSelectionChange(selected);
  },

  getInitialState() {
    return {
      transcription: '',
      translations: {}
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.word !== this.props.word) {
      this.setState(this.getInitialState());
      this.getTranslations(nextProps.word);
    }
  },

  componentDidMount() {
    this.getTranslations(this.props.word);
  },

  // <span class="word-def">
  //   <span class="word">word</span>
  //   <span class="transcription">[word]</span>
  // </span>
  // <span class="pos">сущ.: </span>
  //   <span class="translation">перевод 1</span>
  //   <span class="translation">перевод 2</span>
  // <span class="pos">гл. </span>
  //   <span class="translation">перевод 1</span>
  //   <span class="translation">перевод 2</span>
  render() {
    const translations = this.state.translations;

    const translationTags = translation => {
      const res = interleave(translation.variants.map(variant => <TranslationTag key={variant} text={variant}/>), ', ');
      return [<PosTag key={translation.pos} pos={translation.pos}/>, ...res, '; '];
    };

    const allTranslationTags = () => {
      if (translations.length > 0) {
        return [' \u2014 '].concat(...translations.map(translation => translationTags(translation)));
      } else {
        return null;
      }
    };

    return (
      <li>
        <label>
          <input
            type='checkbox'
            checked={this.props.selected}
            onChange={this.handleChange}/>
          <span className='word-def'>
            &nbsp;<WordTag text={this.props.word}/>
            &nbsp;<TranscriptionTag text={this.state.transcription}/>
          </span>
        </label>
        &nbsp;<SpeakTag onSpeak={this.handleSpeak}/>
        &nbsp;<LookupPopover word={this.props.word}/>
        {allTranslationTags()}
      </li>
    );
  }
});

export default Word;
