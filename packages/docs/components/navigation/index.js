import data from './components-navigation.json';
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
    }
});

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
                            <NavGroup
                                key={group}
                                title={group}
                                className={classes.capitalize}
                            >
                                {items.map(name => (
                                    <NavItem
                                        id={`/${packageName}/${name}`}
                                        to={`/${packageName}/${name}`}
                                        ouiaId={`/${packageName}/${name}`}
                                        key={name}
                                        component={({ children, ...props }) => (
                                            <Link {...props}>
                                                <a className={classnames('pf-c-nav__link', {
                                                    // eslint-disable-next-line react/prop-types
                                                    'pf-m-current': props.href === pathname
                                                })}>
                                                    {children}
                                                </a>
                                            </Link>
                                        )}
                                    >
                                        {name}
                                    </NavItem>
                                ))}
                            </NavGroup>
                        ))}
                    </NavExpandable>
                ))}
            </NavList>
        </Nav>
    );
};

export default Navigation;
