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

const NavigationGroup = ({ group, items, packageName }) => {
    const classes = useStyles();
    const { pathname } = useRouter();
    if (items.length === 1) {
        const  item = items[0];
        const title = typeof item === 'object' ? item.title : item;
        const name = typeof item === 'object' ? item.name : item;
        return (
            <NavItem
                id={`/${packageName}/${name}`}
                to={`/${packageName}/${name}`}
                ouiaId={`/${packageName}/${name}`}
                key={name}
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
                {title}
            </NavItem>
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
                    <NavItem
                        id={`/${packageName}/${name}`}
                        to={`/${packageName}/${name}`}
                        ouiaId={`/${packageName}/${name}`}
                        key={name}
                        component={({ children, ...props }) => (
                            <Link {...props}>
                                <a className={classnames('pf-c-nav__link', classes.groupLink, {
                                // eslint-disable-next-line react/prop-types
                                    'pf-m-current': props.href === pathname
                                })}>
                                    {children}
                                </a>
                            </Link>
                        )}
                    >
                        {title}
                    </NavItem>
                );
            })}
        </NavGroup>
    );
};

NavigationGroup.propTypes = {
    group: PropTypes.string.isRequired,
    packageName: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            href: PropTypes.string.isRequired,
            title: PropTypes.string,
            name: PropTypes.string
        })
    ]))
};

const Navigation = () => {
    const { pathname } = useRouter();
    const classes = useStyles();
    return (
        <Nav ouiaId="docs-nav">
            <NavList>
                {data.map(({ packageName, groups }) => (
                    <NavExpandable
                        className={classes.capitalize}
                        key={packageName}
                        ouiaId={packageName}
                        id={packageName}
                        title={packageName.replace(/-/gm, ' ')}
                        isExpanded={pathname.includes(`/${packageName}`)}
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
