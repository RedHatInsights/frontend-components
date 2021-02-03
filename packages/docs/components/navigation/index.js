import data from './components-navigation.json';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Nav, NavExpandable, NavGroup, NavItem, NavList } from '@patternfly/react-core';
import classnames from 'classnames';

const Navigation = () => {
    const { pathname } = useRouter();
    return (
        <Nav ouiaId="docs-nav">
            <NavList>
                <NavExpandable ouiaId="components" id="components" title="Components" isExpanded={pathname.includes('/components')}>
                    {data.map(({ group, items }) => (
                        <NavGroup key={group} title={group}>
                            {items.map(name => (
                                <NavItem
                                    id={`/components/${name}`}
                                    to={`/components/${name}`}
                                    ouiaId={`/components/${name}`}
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
            </NavList>
        </Nav>
    );
};

export default Navigation;
