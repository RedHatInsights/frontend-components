import data from './components-navigation.json';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Nav, NavExpandable, NavItem, NavList } from '@patternfly/react-core';
import classnames from 'classnames';

const Navigation = () => {
    const { pathname } = useRouter();
    return (
        <Nav>
            <NavList>
                <NavExpandable title="Components" isExpanded={pathname.includes('/components')}>
                    {data.map(name => (
                        <NavItem
                            to={`/components/${name}`}
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
                        </NavItem>))}
                </NavExpandable>
            </NavList>
        </Nav>
    );
};

export default Navigation;
