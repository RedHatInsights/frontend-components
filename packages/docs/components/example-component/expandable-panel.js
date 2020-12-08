import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import { Button, Card, CardBody, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { CodeIcon } from '@patternfly/react-icons';
import CodeHighlight from './code-highlight';

const useStyles = createUseStyles({
    inconExpandExpanded: {
        transform: 'rotate(180deg)'
    },
    iconExpand: {
        transition: 'transform .3s'
    }
});

const ExpandablePanel = ({ sourceCode }) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const classes = useStyles();

    return (
        <Card>
            <CardBody className="pf-u-p-sm">
                <Toolbar className={classnames('pf-u-p-0')}>
                    <ToolbarContent>
                        <ToolbarItem>
                            <Button variant="plain" onClick={() => setIsOpen(prev => !prev)}>
                                <CodeIcon className={classnames(classes.iconExpand, {
                                    [classes.inconExpandExpanded]: isOpen
                                })} />
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button>
                                GH source link
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button>
                                Code sandbox example link
                            </Button>
                        </ToolbarItem>
                    </ToolbarContent>
                </Toolbar>
                {isOpen && (
                    <CodeHighlight sourceCode={sourceCode} />
                )}
            </CardBody >
        </Card>
    );
};

ExpandablePanel.propTypes = {
    sourceCode: PropTypes.string.isRequired
};

export default ExpandablePanel;
