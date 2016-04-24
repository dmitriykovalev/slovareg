export function getUrlParam(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export function mapToArray(dicts) {
  return Object.keys(dicts).map(function(dictId) {
    const copy = JSON.parse(JSON.stringify(dicts[dictId]));
    copy.id = dictId;
    return copy;
  });
}

export function interleave(array, value) {
  const res = [];
  for (let i = 0; i < array.length; ++i) {
    res.push(array[i]);
    if (i < array.length - 1) {
      res.push(value);
    }
  }
  return res;
}
