import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import { Alert, Button, Toolbar, ToolbarContent, ToolbarItem } from '@patternfly/react-core';
import { CodeIcon, CopyIcon } from '@patternfly/react-icons';
import CodeHighlight from './code-highlight';
import createCodeSandboxExample from './create-code-sandbox-template';
import CodesandboxIcon from './codesandbox-svg-icons';

const useToastStyles = createUseStyles({
    toast: {
        position: 'fixed !important',
        bottom: 'var(--pf-global--spacer--md)',
        right: 'var(--pf-global--spacer--md)',
        cursor: 'pointer'
    }
});

const TimedToas = ({ handleClose, title }) => {
    const classes = useToastStyles();
    useEffect(() => {
        const timeout = setTimeout(handleClose, 3000);
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    return (<Alert onClick={handleClose} className={classnames(classes.toast)} title={title} variant="info" />);
};

TimedToas.propTypes = {
    handleClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};

const useStyles = createUseStyles({
    inconExpandExpanded: {
        transform: 'rotate(180deg)'
    },
    iconExpand: {
        transition: 'transform .3s'
    },
    toolbar: {
        backgroundColor: 'transparent !important'
    },
    firstItem: {
        marginLeft: 'auto'
    },
    imageIconButton: {
        display: 'flex !important',
        '& svg': {
            width: 24,
            height: 24,
            transform: 'scale(.8)',
            fill: 'var(--pf-c-button--m-plain--Color)'
        }
    }
});

const ExpandablePanel = ({ sourceCode }) => {
    const [ isOpen, setIsOpen ] = useState(false);
    const [ toast, setToast ] = useState(undefined);
    const handleClose = () => setToast(undefined);
    const classes = useStyles();

    const copyToClipboard = () => {
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);
        textarea.style.width = 0;
        textarea.style.height = 0;
        textarea.value = sourceCode;
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        if (typeof toast === 'undefined') {
            setToast({ title: 'The code was copied to clipboard' });
        }
    };

    return (
        <Fragment>
            {toast && <TimedToas {...toast} handleClose={handleClose} />}
            <Toolbar className={classnames('pf-u-p-0 pf-u-mb-md', classes.toolbar)}>
                <ToolbarContent className="pf-u-p-0">
                    <ToolbarItem className={classes.firstItem}>
                        <Button variant="plain" onClick={() => setIsOpen(prev => !prev)}>
                            <CodeIcon className={classnames(classes.iconExpand, {
                                [classes.inconExpandExpanded]: isOpen
                            })} />
                        </Button>
                        <Button variant="plain" onClick={copyToClipboard}>
                            <CopyIcon />
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        <Button>
                            GH source link
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem>
                        <form action="https://codesandbox.io/api/v1/sandboxes/define" method="POST" target="_blank">
                            <input type="hidden" name="parameters" value={createCodeSandboxExample(sourceCode)} />
                            <Button className={classes.imageIconButton} type="submit" variant="plain">
                                <CodesandboxIcon />
                            </Button>
                        </form>
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
            {isOpen && (
                <CodeHighlight sourceCode={sourceCode} />
            )}
        </Fragment>
    );
};

ExpandablePanel.propTypes = {
    sourceCode: PropTypes.string.isRequired
};

export default ExpandablePanel;
