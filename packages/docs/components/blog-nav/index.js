/* eslint-disable react/prop-types */
import { createUseStyles } from 'react-jss';
import Link from 'next/link';
import { MenuContent, MenuItem, MenuList, Title } from '@patternfly/react-core';
import BookOpenIcon from '@patternfly/react-icons/dist/esm/icons/book-open-icon';
import classNames from 'classnames';

const useStyles = createUseStyles({
  blogContainer: {
    padding: 8,
  },
  blogLink: {
    color: 'var(--pf-c-menu__list-item--Color)',
  },
  '@media (min-width: 1200px)': {
    blogContainer: {
      position: 'absolute',
      top: 80,
      right: 16,
    },
  },
});

const BlogNav = () => {
  const classes = useStyles();
  return (
    <div className={classes.blogContainer}>
      <div className="pf-c-menu">
        <MenuContent>
          <MenuList iconSize="large">
            <MenuItem>
              <Title headingLevel="h2">Whats new?</Title>
            </MenuItem>
            <MenuItem
              component={({ props, children }) => (
                <Link href="/blog/router-v6">
                  <button className="pf-c-menu__item">
                    <a {...props} className={classNames(props?.className, classes.blogLink)} href="/blog/router-v6">
                      {children}
                    </a>
                  </button>
                </Link>
              )}
              icon={<BookOpenIcon />}
            >
              React router v6 upgrade
            </MenuItem>
          </MenuList>
        </MenuContent>
      </div>
    </div>
  );
};

export default BlogNav;
