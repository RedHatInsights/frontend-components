let loader = async () => undefined;

export const setLoader = (implementation) => {
  loader = implementation;
};

export const loadMessages = (locale) => loader(locale);
