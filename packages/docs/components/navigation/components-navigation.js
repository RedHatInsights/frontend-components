import data from './components-navigation.json';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Nav, NavExpandable, NavGroup, NavItem, NavList } from '@patternfly/react-core';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    capitalize: {
        textTransform: 'capitalize',
        '& > button': {
            textTransform: 'capitalize'
        }
    },
    groupLink: {
        'font-size': 14
    }
});

const NavLink = ({ href, children }) => {
    const { pathname } = useRouter();
    return (
        <NavItem
            id={href}
            to={href}
            ouiaId={href}
            component={({ children, ...props }) => (
                <Link {...props}>
                    <a className={classnames('pf-c-nav__link', {
                        'pf-m-current': props.href === pathname
                    })}>
                        {children}
                    </a>
                </Link>
            )}
        >
            {children}
        </NavItem>

    );
};

const NavigationGroup = ({ group, items, packageName }) => {
    const classes = useStyles();
    if (items.length === 1) {
        const  item = items[0];
        const title = typeof item === 'object' ? item.title : item;
        const name = typeof item === 'object' ? item.name : item;
        return (
            <NavLink href={`/fec/${packageName}/${name}`} key={name}>
                {title}
            </NavLink>
        );
    }

    return (
        <NavGroup
            key={group}
            title={group}
            className={classes.capitalize}
        >
            {items.map(item => {
                const title = typeof item === 'object' ? item.title : item;
                const name = typeof item === 'object' ? item.name : item;
                return (
                    <NavLink key={name} href={`/fec/${packageName}/${name}`}>
                        {title}
                    </NavLink>
                );
            })}
        </NavGroup>
    );
};

NavigationGroup.propTypes = {
    group: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({ name: PropTypes.string, title: PropTypes.string }) ])),
    packageName: PropTypes.string.isRequired
};

const Navigation = () => {
    const { pathname } = useRouter();
    return (
        <Nav ouiaId="docs-nav">
            <NavList>
                {data.map(({ packageName, groups }) => (
                    <NavExpandable
                        key={packageName}
                        ouiaId={packageName}
                        id={packageName}
                        title={packageName.replace(/-/gm, ' ')}
                        isExpanded={pathname.includes(`/fec/${packageName}`)}
                    >
                        {groups.map(({ group, items }) => (
                            <NavigationGroup key={group} group={group} items={items} packageName={packageName} />
                        ))}
                    </NavExpandable>
                ))}
            </NavList>
        </Nav>
    );
};

export default Navigation;
