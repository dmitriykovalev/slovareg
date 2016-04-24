import React from 'react';
import ReactDOM from 'react-dom';
import {Overlay, Popover, Glyphicon} from 'react-bootstrap';

const links = [{
  name: 'Yandex Slovari',
  url: (word) => `https://slovari.yandex.ru/${word}/перевод/`
}, {
  name: 'Google Translate',
  url: (word) => `https://translate.google.com/#en/ru/${word}`
}, {
  name: 'Merriam Webster',
  url: (word) => `http://www.merriam-webster.com/dictionary/${word}`},
{
  name: 'Multitran',
  url: (word) => `http://www.multitran.ru/c/m.exe?CL=1&l1=1&s=${word}`
}, {
  name: 'Glosbe',
  url: (word) => `https://glosbe.com/en/ru/${word}`
}];

const LookupPopover = React.createClass({
  propTypes: {
    word: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return {show: false};
  },

  showOverlay() {
    this.setState({show: true});
  },

  hideOverlay() {
    this.setState({show: false});
  },

  renderPopover() {
    return (
      <Popover
        id='external-look-up'
        title='Look up'
        placement='right'
        onMouseLeave={this.hideOverlay}>
        <ul>
          {links.map(link =>
            <li key={link.name}>
              <a target='_blank' href={link.url(this.props.word)}>{link.name}</a>
            </li>
          )}
        </ul>
      </Popover>
    );
  },

  render() {
    return (
      <span>
        <Glyphicon
          style={{cursor: 'pointer', fontSize: '10px'}}
          glyph='new-window'
          onClick={this.showOverlay}
          ref='target'/>

        <Overlay
          rootClose
          show={this.state.show}
          target={() => ReactDOM.findDOMNode(this.refs.target)}
          placement='right'
          onHide={this.hideOverlay}>
          {this.renderPopover()}
        </Overlay>
      </span>
    );
  }
});

export default LookupPopover;
