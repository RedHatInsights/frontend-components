import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Bullseye, Menu, MenuContent, MenuItem, MenuList, Popper, SearchInput, Spinner, Text, TextContent, Title } from '@patternfly/react-core';
import Link from 'next/link';
import { createUseStyles } from 'react-jss';
import { useRouter } from 'next/router';
import classNames from 'classnames';

const useStyles = createUseStyles({
  searchResultTitle: {},
  ellipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  fragment: {
    color: 'var(--pf-global--palette--blue-200)',
  },
  fragmentMatch: {
    textDecoration: 'underline',
    color: 'var(--pf-global--link--Color)',
  },
});

const fetchSearchResults = async (term) => {
  const { data } = await fetch(`/search?term=${term}`).then((r) => r.json());
  return data;
};

const adjustResultURL = (url) => {
  const resultUrl = new URL(url);
  return `${document.location.origin}${resultUrl.pathname}${resultUrl.search}${resultUrl.hash}`;
};

const processResults = (searchResults) =>
  Object.entries(searchResults)
    .reduce((acc, [tagName, meta]) => [...acc, ...meta.map((meta) => ({ ...meta, tagName }))], [])
    .slice(0, 10);

const processLinkOption = (term, content, classes) => {
  const termMacthPos = content.toLowerCase().match(term.toLowerCase())?.['index'];
  if (isNaN(termMacthPos)) {
    return content;
  }
  const termLen = term.length;
  let contentArr = [...content].map((char, index) => (
    <span
      key={index}
      className={classNames(classes.fragment, {
        [classes.fragmentMatch]: index >= termMacthPos && index < termMacthPos + termLen,
      })}
    >
      {char}
    </span>
  ));
  if (termMacthPos > 15) {
    contentArr = [<span key="pre-1">.</span>, <span key="pre-2">.</span>, <span key="pre-3">.</span>, ...contentArr.slice(10)];
  }
  return contentArr;
};

const LoadingItem = (
  <MenuItem key="loading">
    <Bullseye>
      <Spinner className="pf-u-m-xl" size="xl" />
    </Bullseye>
  </MenuItem>
);

const DocSearch = ({ className }) => {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const router = useRouter();
  const resultCache = useRef({});

  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const searchInputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const searchCache = (query) => {
    return resultCache.current[query];
  };

  const updateCache = (query, result) => {
    resultCache.current[query] = result;
  };

  const onClear = (e) => {
    e.preventDefault();
    setValue('');
    setIsAutocompleteOpen(false);
  };

  const onChange = async (newValue) => {
    if (newValue !== '' && searchInputRef && searchInputRef.current && searchInputRef.current.contains(document.activeElement)) {
      setValue(newValue);
      setIsAutocompleteOpen(true);
      if (autocompleteOptions.length === 0) {
        setAutocompleteOptions([LoadingItem]);
      }
      let trimmedData = searchCache(newValue);

      if (!trimmedData) {
        try {
          const searchResults = await fetchSearchResults(newValue);
          trimmedData = processResults(searchResults);
          updateCache(newValue, trimmedData);
        } catch (error) {
          trimmedData = [];
          console.error(error);
        }
      }

      if (trimmedData.length === 0) {
        setAutocompleteOptions([
          <MenuItem key="empty">
            <Bullseye>
              <TextContent className="pf-u-m-xl">
                <Text>We looked everywhere but found nothing. Try something different.</Text>
              </TextContent>
            </Bullseye>
          </MenuItem>,
        ]);
        return;
      }

      let options = trimmedData.map((option, index) => {
        const adjustedUrl = adjustResultURL(option.url);
        return (
          <MenuItem onClick={() => router.push(adjustedUrl)} itemId={option.value} key={index}>
            <Link href={adjustedUrl}>
              <a>
                <Title className={classes.ellipsis} headingLevel="h2" size="md">
                  {processLinkOption(newValue, option.value, classes)}
                </Title>
                <TextContent>
                  <Text className={classes.ellipsis} component="small">
                    {adjustResultURL(adjustedUrl)}
                  </Text>
                </TextContent>
              </a>
            </Link>
          </MenuItem>
        );
      });
      setAutocompleteOptions(options);
    } else {
      setIsAutocompleteOpen(false);
    }
  };

  const onSelect = (e, itemId) => {
    e.stopPropagation();
    setValue(itemId);
    setIsAutocompleteOpen(false);
    searchInputRef.current.focus();
  };

  const searchInput = (
    <SearchInput
      placeholder="Search for docs"
      className={className}
      value={value}
      onChange={onChange}
      onClear={onClear}
      ref={searchInputRef}
      id="autocomplete-search"
    />
  );

  const autocomplete = (
    <Menu ref={autocompleteRef} onSelect={onSelect}>
      <MenuContent>
        <MenuList>{autocompleteOptions}</MenuList>
      </MenuContent>
    </Menu>
  );
  return (
    <Popper
      trigger={searchInput}
      popper={autocomplete}
      isVisible={isAutocompleteOpen}
      enableFlip={false}
      // append the autocomplete menu to the search input in the DOM for the sake of the keyboard navigation experience
      appendTo={() => document.querySelector('#autocomplete-search')}
    />
  );
};

DocSearch.propTypes = {
  className: PropTypes.string,
};

export default DocSearch;
