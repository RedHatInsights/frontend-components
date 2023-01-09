const chromeState = () => {
  const state: {
    lastVisitedPages: string[];
  } = {
    lastVisitedPages: [],
  };

  function setLastVisited(pages: string[]) {
    state.lastVisitedPages = pages;
  }
  return {
    ...state
  };
};
