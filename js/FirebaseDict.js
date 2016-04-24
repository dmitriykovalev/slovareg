import Firebase from 'firebase';

import {mapToArray} from './Util';

// slovareg
//   config
//     yandex
//       apiKey
//   users
//     uid
//       config
//         selectedDictId
//         showTranscription
//       dictionaries
//         dictId
//           name
//           words
//             wordId
//               text

const updateDict = (fbDict, snapshot, name, removeWordIds, addWords) => {
  var diff = {};

  // name
  if (name !== null && name !== snapshot.name) {
    diff.name = name;
  }

  // words
  const words = snapshot.words;
  const currentWords = Object.keys(words).map(wordId => words[wordId].text);

  // => removing
  if (removeWordIds.length > 0) {
    Object.keys(words).forEach(function(wordId) {
      if (removeWordIds.indexOf(wordId) !== -1) {
        diff['words/' + wordId] = null;
        const index = currentWords.indexOf(words[wordId].text);
        currentWords.splice(index, 1);
      }
    });
  }

  // => adding
  if (addWords.length > 0) {
    addWords.forEach(function(word) {
      if (currentWords.indexOf(word) === -1) {
        const wordId = fbDict.child('words').push().key();
        diff[`words/${wordId}`] = {text: word};
      }
    });
  }

  return diff;
};

const setDict = (fbDict, snapshot, name, words) => {
  const snapWords = mapToArray(snapshot.words);
  const snapTexts = snapWords.map(word => word.text);

  const removeWordIds = snapWords.filter(word => words.indexOf(word.text) === -1)
                                 .map(word => word.id);

  const addWords = words.filter(word => snapTexts.indexOf(word) === -1);

  return updateDict(fbDict, snapshot, name, removeWordIds, addWords);
};

class FirebaseDict {
  constructor(ref) {
    this.ref = ref;
  }

  getRef() {
    return this.ref;
  }

  getAuth() {
    return this.ref.getAuth();
  }

  // Configuration
  getGlobalConfig() {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.ref.child('config').once('value', snapshot => resolve(snapshot.val()), reject);
    });
  }

  getUserConfig() {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.ref.child('users').child(uid).child('config').once('value', snapshot => resolve(snapshot.val()), reject);
    });
  }

  // Dictionaries
  getDicts() {
    var uid = this.ref.getAuth().uid;
    return this.ref.child('users').child(uid).child('dictionaries');
  }

  addDict(name, words) {
    const fbDict = this.getDicts().push();
    const diff = updateDict(fbDict, {name: '', words: []}, name, [], words);
    fbDict.update(diff);
    return fbDict.key();
  }

  updateDict(dictId, dictSnapshot, name, removeWordIds, addWords) {
    const fbDict = this.getDicts().child(dictId);
    const diff = updateDict(fbDict, dictSnapshot, name, removeWordIds, addWords);
    fbDict.update(diff);
  }

  setDict(dictId, dictSnapshot, name, words) {
    const fbDict = this.getDicts().child(dictId);
    const diff = setDict(fbDict, dictSnapshot, name, words);
    fbDict.update(diff);
  }

  removeDict(dictId) {
    return this.getDicts().child(dictId).remove();
  }
}

export default FirebaseDict;
