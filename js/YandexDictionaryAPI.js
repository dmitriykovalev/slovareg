const REUEST_URL = 'https://dictionary.yandex.net/api/v1/dicservice.json/';

function paramsToString(params) {
  return Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
}

module.exports = {
  Flags: {
    Family: 0x0001,
    Morpho: 0x0004,
    PosFilter: 0x0008
  },

  // required: key
  getLangs: apiKey => {
    return `${REQUEST_URL}getLangs?key=${apiKey}`;
  },

  // required: key, lang, text
  // optional: ui, flags
  lookup: (apiKey, params) => {
    return `${REUEST_URL}lookup?key=${apiKey}&${paramsToString(params)}`;
  }
};
