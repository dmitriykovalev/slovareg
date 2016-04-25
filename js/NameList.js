import React from 'react';
import ReactDOM from 'react-dom';
import {Glyphicon, Badge} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {mapToArray} from './Util';

const WordCount = ({words}) => <Badge pullRight>{Object.keys(words).length}</Badge>;

const NameList = React.createClass({
  propTypes: {
    dicts: React.PropTypes.object.isRequired,
    selectedId: React.PropTypes.string, // TODO: .isRequired
    onSelectionChange: React.PropTypes.func.isRequired,
    onEditDict: React.PropTypes.func.isRequired,
    onDeleteDict: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {selectedId: null};
  },

  renderActions(id) {
    return (
      <span>
        <Glyphicon
          className='pull-right'
          style={{opacity: 0.8, fontSize: '120%', paddingLeft: '8px', cursor: 'pointer'}}
          glyph='trash'
          onClick={() => this.props.onDeleteDict(id)}/>
        <Glyphicon
          className='pull-right'
          style={{opacity: 0.8, fontSize: '120%', paddingLeft: '8px', cursor: 'pointer'}}
          glyph='edit'
          onClick={() => this.props.onEditDict(id)}/>
      </span>
    );
  },

  render() {
    const dicts = mapToArray(this.props.dicts);
    dicts.sort((a, b) => a.name.localeCompare(b.name));

    return (
      <ul className='dict-list'>
        <ReactCSSTransitionGroup
          transitionName='dict'
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {dicts.map(dict =>
            <li
              onMouseEnter={() => this.setState({selectedId: dict.id})}
              onMouseLeave={() => this.setState({selectedId: null})}
              key={dict.id}
              className={dict.id === this.props.selectedId ? 'selected' : ''}
              onClick={() => this.props.onSelectionChange(dict.id)}>

              {this.state.selectedId === dict.id ? this.renderActions(dict.id)
                                                 : <WordCount words={dict.words}/>}
              {dict.name}
            </li>
          )}
        </ReactCSSTransitionGroup>
      </ul>
    );
  }
});

export default NameList;
