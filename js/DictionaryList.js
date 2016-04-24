require('whatwg-fetch');

import React from 'react';
import {Button, Input} from 'react-bootstrap';
import { hashHistory, browserHistory, IndexRoute, Redirect, Router, Route, Link, routerShape } from 'react-router';

import getYandexLookup from './YandexDictionaryLookup';
import EditDictionaryDialog from './EditDictionaryDialog';
import DeleteDictionaryDialog from './DeleteDictionaryDialog';
import NameList from './NameList';
import Dictionary from './Dictionary.js';
import {getUrlParam} from './Util';

const normalizeSnapshot = (dicts) => {
  Object.keys(dicts).forEach(dictId => {
    const dict = dicts[dictId];
    if (!('name' in dict)) {
      dict.name = '<Empty>';
    }

    if (!('words' in dict)) {
      dict.words = {};
    }
  });
};

const getDictWordList = (dict, ids) => {
  const words = dict.words;
  const wordIds = ids || Object.keys(words);
  const wordTexts = wordIds.map(wordId => words[wordId].text);
  wordTexts.sort();
  return wordTexts;
};

const parseWordsString = (wordsStr) => {
  if (wordsStr) {
    return wordsStr
      .split(',')
      .map(word => word.trim().toLowerCase())
      .filter((item, pos, array) => array.indexOf(item) == pos); // remove duplicates
  } else {
    return [];
  }
};

const getMoveToActions = (dicts, selectedDictId) => {
  return Object.keys(dicts)
    .filter(dictId => dictId !== selectedDictId)
    .map(dictId => {
      return {
        name: dicts[dictId].name,
        key: dictId
      };
    });
};

const DictionaryList = React.createClass({
  cache: {},

  contextTypes: {
    router: routerShape
  },

  getFirebase() {
    return this.props.route.fb;
  },

  getLookup() {
    const apiKeyPromise = this.getFirebase().getGlobalConfig().then(config => config.yandex.apiKey);
    const cache = getUrlParam('cache') === 'false' ? null : this.cache;
    return getYandexLookup(apiKeyPromise, cache);
  },

  getSelectedDict() {
    const id = this.getSelectedId();
    return id ? this.state.dicts[id] : null;
  },

  getSelectedId() {
    const id = this.props.params.id;
    return id in this.state.dicts ? id : null;
  },

  // Dicts
  handleSelectDict(dictId) {
    if (dictId) {
      this.context.router.push(`/dictionary/${dictId}`);
    } else {
      this.context.router.push('/');
    }
  },

  handleAddDict(name, wordsStr) {
    const dictName = (name || '').trim();
    if (dictName) {
      const dictId = this.getFirebase().addDict(dictName, parseWordsString(wordsStr));
      this.handleSelectDict(dictId);
    }
  },

  handleEditDict(name, wordsStr) {
    this.getFirebase().setDict(this.getSelectedId(),
                               this.getSelectedDict(),
                               name,
                               parseWordsString(wordsStr));
  },

  handleDeleteDict() {
    this.getFirebase().removeDict(this.getSelectedId());
  },

  // Words
  handleAddWords(wordsStr) {
    this.getFirebase().updateDict(this.getSelectedId(),
                                  this.getSelectedDict(),
                                  null,
                                  [],
                                  parseWordsString(wordsStr));
  },

  handleDeleteWords(selection) {
    this.getFirebase().updateDict(this.getSelectedId(),
                                  this.getSelectedDict(),
                                  null,
                                  selection,
                                  []);
  },

  handleMoveWords(dictId, selection) {
    const wordsToAdd = getDictWordList(this.getSelectedDict(), selection);

    this.getFirebase().updateDict(dictId,
                                  this.state.dicts[dictId],
                                  null,
                                  [],
                                  wordsToAdd);
    this.getFirebase().updateDict(this.getSelectedId(),
                                  this.getSelectedDict(),
                                  null,
                                  selection,
                                  []);
  },

  setDicts(dicts) {
    this.setState({dicts: dicts});

    const id = this.props.params.id;
    if (!(id && (id in dicts))) {
      const ids = Object.keys(dicts);
      this.handleSelectDict((ids.length > 0) ? ids[0] : null);
    }
  },

  openEditDictDialog() {
    this.setState({showEditDictDialog: true});
  },

  closeEditDictDialog() {
    this.setState({showEditDictDialog: false});
  },

  openAddDictDialog() {
    this.setState({showAddDictDialog: true});
  },

  closeAddDictDialog() {
    this.setState({showAddDictDialog: false});
  },

  openDeleteDictDialog() {
    this.setState({showDeleteDictDialog: true});
  },

  closeDeleteDictDialog() {
    this.setState({showDeleteDictDialog: false});
  },

  getInitialState() {
    return {
      // Database State
      dicts: {},                  // dictionaries

      // Internal State
      showAddDictDialog: false,   // AddDictDialog state
      showEditDictDialog: false,  // EditDictDialog state
      showDeleteDictDialog: false // DeleteDialog state
    };
  },

  componentDidMount() {
    this.getFirebase().getDicts().on('value', snapshot => {
      const dicts = snapshot.val();
      normalizeSnapshot(dicts);
      this.setDicts(dicts);
    }, this);
  },

  componentWillUnmount() {
    // TODO: this.getFirebase().getDicts().off('value');
  },

  renderSidebar() {
    return (
      <div className='sidebar'>
        <Button
          style={{marginLeft: '15px', marginBottom: '15px'}}
          bsStyle='primary'
          bsSize='small'
          onClick={this.openAddDictDialog}>
          Add Dictionary
        </Button>

        <EditDictionaryDialog
          show={this.state.showAddDictDialog}
          onHide={this.closeAddDictDialog}
          onDone={this.handleAddDict}
          title='New Dictionary'
          submitText='Add'/>

        <NameList
          dicts={this.state.dicts}
          selectedId={this.getSelectedId()}
          onSelectionChange={this.handleSelectDict}
          onEditDict={this.openEditDictDialog}
          onDeleteDict={this.openDeleteDictDialog}/>
      </div>
    );
  },

  renderDict() {
    return (
      <Dictionary dict={this.getSelectedDict()}
                  moveToItems={getMoveToActions(this.state.dicts, this.getSelectedId())}
                  onAddWords={this.handleAddWords}
                  onDeleteWords={this.handleDeleteWords}
                  onMoveWords={this.handleMoveWords}
                  getLookup={this.getLookup}/>
    );
  },

  renderDictDialogs() {
    return (
      <span>
        <EditDictionaryDialog
          show={this.state.showEditDictDialog}
          onHide={this.closeEditDictDialog}
          onDone={this.handleEditDict}
          name={this.getSelectedDict().name}
          words={getDictWordList(this.getSelectedDict()).join(', ')}
          title='Edit Dictionary'
          submitText='Save'/>
        <DeleteDictionaryDialog
          show={this.state.showDeleteDictDialog}
          name={this.getSelectedDict().name}
          onHide={this.closeDeleteDictDialog}
          onDone={this.handleDeleteDict}/>
      </span>
    );
  },

  render() {
    return (
      <div>
        {this.renderSidebar()}
        {this.getSelectedId() ? this.renderDict() : null}
        {this.getSelectedId() ? this.renderDictDialogs() : null}
      </div>
    );
  }
});

const App = React.createClass({
  render() { return this.props.children; }
});

export default React.createClass({
  propTypes: {
    fb: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={DictionaryList} fb={this.props.fb}/>
          <Route path='dictionary/:id' component={DictionaryList} fb={this.props.fb}/>
        </Route>
      </Router>
    );
  }
});
