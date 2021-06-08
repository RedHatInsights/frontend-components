import React from 'react';
import { Gallery, GalleryItem, Tile } from '@patternfly/react-core';
import Link from 'next/link';
import { createUseStyles } from 'react-jss';

import sections from './sections-definition.json';

const useStyles = createUseStyles({
    tile: {
        width: '100%',
        height: '100%'
    },
    link: {
        textDecoration: 'none'
    }
});

const Sections = () => {
    const classes = useStyles();
    return (
        <Gallery hasGutter className="pf-u-mt-lg">
            {sections.map(({ title, href = '#' }) => (
                <GalleryItem key={title}>
                    <Link href={href}>
                        <a href={href} className={classes.link}>
                            <Tile className={classes.tile} title={title} />
                        </a>
                    </Link>
                </GalleryItem>
            ))}
        </Gallery>
    );
};

export default Sections;
