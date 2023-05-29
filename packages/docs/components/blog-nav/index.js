/* eslint-disable react/prop-types */
import { createUseStyles } from 'react-jss';
import Link from 'next/link';
import { MenuContent, MenuItem, MenuList, Title } from '@patternfly/react-core';
import BookOpenIcon from '@patternfly/react-icons/dist/esm/icons/book-open-icon';
import InfoIcon from '@patternfly/react-icons/dist/esm/icons/info-icon'
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

const blogSchema = [
  {
    "title": "Dynamic plugin SDK build",
    "href": "/fed/plugin-sdk",
    Icon: InfoIcon
  },
  {
    "title": "HMR available in development!",
    "href": "/frontend-components-config/hot-module-replacement",
    Icon: InfoIcon
  },

  {
    "title": "React router v6 upgrade",
    "href": "/blog/router-v6",
    Icon: BookOpenIcon
  }]

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
            {blogSchema.map(({ title, href, Icon }) => (
            <MenuItem
              key={href}
              component={({ props, children }) => (
                <Link href={href}>
                  <button className="pf-c-menu__item">
                    <a {...props} className={classNames(props?.className, classes.blogLink)} href={href}>
                      {children}
                    </a>
                  </button>
                </Link>
              )}
              icon={<Icon />}
            >
              {title}
            </MenuItem>

            ))}
          </MenuList>
        </MenuContent>
      </div>
    </div>
  );
};

export default BlogNav;
