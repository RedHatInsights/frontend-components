import { useEffect, useState } from 'react';
import data from './components-navigation.json';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import { createUseStyles } from 'react-jss';
import AngleRightIcon from '@patternfly/react-icons/dist/js/icons/angle-right-icon';

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
        <li
            id={href}
            to={href}
            ouiaId={href}
            className="pf-c-nav__item"
        >
            <Link href={href}>
                <a className={classnames('pf-c-nav__link', {
                    'pf-m-current': href === pathname
                })}>
                    {children}
                </a>
            </Link>
        </li>

    );
};

NavLink.propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node
};

const NavigationGroup = ({ group, items, packageName }) => {
    const classes = useStyles();
    if (items.length === 1) {
        const  item = items[0];
        const title = typeof item === 'object' ? item.title : item;
        const name = typeof item === 'object' ? item.name : item;
        return (
            <NavLink href={`/fec/modules/${packageName}/${name}`} key={name}>
                {title}
            </NavLink>
        );
    }

    return (
        <section
            key={group}
            title={group}
            className={classnames('pf-c-nav__section', classes.capitalize)}
        >
            <h2 className="pf-c-nav__section-title">
                {group}
            </h2>
            <ul className={classnames('pf-c-nav__list', classes.capitalize)}>
                {items.map(item => {
                    const title = typeof item === 'object' ? item.title : item;
                    const name = typeof item === 'object' ? item.name : item;
                    return (
                        <NavLink key={name} href={`/fec/modules/${packageName}/${name}`}>
                            {title}
                        </NavLink>
                    );
                })}
            </ul>
        </section>
    );
};

NavigationGroup.propTypes = {
    group: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.shape({ name: PropTypes.string, title: PropTypes.string }) ])),
    packageName: PropTypes.string.isRequired
};

const ExpandableLink = ({ packageName, groups }) => {
    const { pathname } = useRouter();
    const [ isExpanded, setIsExpandend ] = useState(() => pathname.includes(`/fec/modules/${packageName}`));
    useEffect(() => {
        setIsExpandend(pathname.includes(`/fec/modules/${packageName}`));
    }, [ pathname ]);
    return (
        <li
            className={classnames('pf-c-nav__item', 'pf-m-expandable', {
                'pf-m-expanded': isExpanded
            })}
            key={packageName}
            ouiaId={packageName}
            id={packageName}
            title={packageName.replace(/-/gm, ' ')}
        >
            <button className="pf-c-nav__link" onClick={() => setIsExpandend(prev => !prev)}>
                {packageName.replace(/-/gm, ' ')}
                <span className="pf-c-nav__toggle">
                    <span className="pf-c-nav__toggle-icon">
                        <AngleRightIcon />
                    </span>
                </span>
            </button>
            {isExpanded && groups.map(({ group, items }) => (
                <NavigationGroup key={group} group={group} items={items} packageName={packageName} />
            ))}
        </li>
    );
};

ExpandableLink.propTypes = {
    packageName: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired
};

const Navigation = () => {
    return (
        <nav className="pf-c-nav" ouiaId="docs-nav">
            <ul className="pf-c-nav__list">
                {data.map(({ packageName, groups }) => <ExpandableLink key={packageName} packageName={packageName} groups={groups} />)}
            </ul>
        </nav>
    );
};

export default Navigation;
