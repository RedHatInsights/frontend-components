import breakpoints from './breakpoints';

const getVariant = () => {
  const width = window.innerWidth;

  let result;

  for (const [variant, size] of Object.entries(breakpoints)) {
    if (size >= width) {
      break;
    }

    result = variant;
  }

  return result;
};

export default getVariant;
