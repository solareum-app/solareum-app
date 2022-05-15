export const updateQueryStringParameter = (
  uri: String,
  key: String,
  value: String,
) => {
  var re = new RegExp('([?&])' + key + '=.*?(&|#|$)', 'i');
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + '=' + value + '$2');
  } else {
    var hash = '';
    if (uri.indexOf('#') !== -1) {
      hash = uri.replace(/.*#/, '#');
      uri = uri.replace(/#.*/, '');
    }
    var separator = uri.indexOf('?') !== -1 ? '&' : '?';
    return uri + separator + key + '=' + value + hash;
  }
};

export const getParamsInURL = (url: String) => {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};
