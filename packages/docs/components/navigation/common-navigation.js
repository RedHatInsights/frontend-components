import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import classnames from 'classnames';

const NavLink = ({ href, title }) => {
  const { pathname } = useRouter();
  if (!href) {
    return null;
  }
  return (
    <NavItem
      id={href}
      to={href}
      ouiaId={href}
      component={(props) => (
        <Link {...props}>
          <a
            className={classnames('pf-c-nav__link', {
              'pf-m-current': props.href === pathname,
            })}
          >
            {title}
          </a>
        </Link>
      )}
    ></NavItem>
  );
};

NavLink.propTypes = {
  href: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
};

const Navigation = ({ items, index }) => {
  return (
    <Nav title={index.title} ouiaId="docs-nav">
      <NavList>
        <NavLink {...index} />
        {items.map(({ title, href }) => (
          <NavLink key={href} href={href} title={title} />
        ))}
      </NavList>
    </Nav>
  );
};

Navigation.propTypes = {
  index: PropTypes.shape({ title: PropTypes.node.isRequired, href: PropTypes.string.isRequired }),
  items: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.node.isRequired, href: PropTypes.string.isRequired })).isRequired,
};

export default Navigation;
