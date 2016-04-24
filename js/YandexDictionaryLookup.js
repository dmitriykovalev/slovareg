import YandexDict from './YandexDictionaryAPI';

// { "head": {}
//   "def":  [{"pos":  "существительное",
//             "text": "ping",
//             "ts":   "pɪŋ"
//             "tr":   [{"pos":  "существительное",
//                       "text": "пинг"},
//                      {"pos":  "существительное",
//                       "text": "свист"},
//                      {"pos":  "существительное",
//                       "text":  "пингование"},
//                      {"pos":  "существительное",
//                       "text": "свист пули"},
//                      {"pos":  "существительное",
//                       "text": "проверка связи"},
//                      {"pos":  "существительное",
//                       "text": "тестовый опрос"},
//                      {"pos":  "существительное",
//                       "text": "утилита ping"}
//                     ],
//            },
//            {"pos":  "глагол",
//             "text": "ping",
//             "ts":   "pɪŋ"
//             "tr":   [{"pos":  "глагол",
//                       "text": "пинговать"},
//                      {"pos":  "глагол",
//                       "text": "свистеть"}
//                     ],
//            }
//           ],
// }
//
// {ts:   "pɪŋ"
//  tr: [
//    {pos: "существительное",
//     tr:  ["пинг", "свист",  "пингование", "свист пули", "проверка связи", "тестовый опрос", "утилита ping"]},
//    {pos: "глагол",
//     tr:  ["пинговать", "свистеть"]}
//  ]}

const posShort = {
  'существительное': 'сущ.',
  'глагол': 'гл.',
  'прилагательное': 'прил.',
  'наречие': 'нар.',
  'междометие': 'межд.',
  'союз': 'союз',
  'причастие': 'прич.',
  'деепричастие': 'дееприч.',
  'частица': 'част.',
  'вводное слово': 'ввод.&nbsp;сл.',
  'местоимение': 'мест.',
  'неизменяемое': 'неизм.'
};

const convert = res => {
  const def = res.def;

  return {
    transcription: (def.length > 0) ? `[${def[0].ts}]` : '',
    translations: def.map(defElem => {
      return {
        pos: posShort[defElem.pos] || defElem.pos,
        variants: defElem.tr.map(trElem => trElem.text)
      };
    })
  };
};

const lookup = (apiKey, word, langFrom, langTo) => {
  const params = {
    text: word,
    lang: `${langFrom}-${langTo}`,
    ui: 'ru'
  };

  return fetch(YandexDict.lookup(apiKey, params)).then(response => {
    if (response.status === 200) {
      return response.json();
    } else {
      return Promise.reject(Error(`HTTP error ${response.status}`));
    }
  });
};

function getLookup(apiKeyPromise, cache) {
  return (word, langFrom, langTo) => {
    return apiKeyPromise.then(apiKey => {
      const key = `${word}-${langFrom}-${langTo}`;

      if (cache && key in cache) {
        return Promise.resolve(cache[key]);
      } else {
        return lookup(apiKey, word, langFrom, langTo).then(convert).then(res => {
          if (cache) {
            cache[key] = res;
          }
          return res;
        });
      }
    });
  };
};

export default getLookup;
