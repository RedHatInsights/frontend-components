import get from 'lodash/get';

export const redirectToInventoryList = (id, onBackToListClick) => {
  if (onBackToListClick) {
    onBackToListClick();
  } else {
    if (document.referrer) {
      history.back();
    } else {
      location.href = location.pathname.replace(new RegExp(`${[id]}.*`, 'g'), '');
    }
  }
};

export const getFact = (path, factDict) => get(factDict, path, undefined);
