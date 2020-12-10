import React from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer/';
import codeTheme from 'prism-react-renderer/themes/nightOwl';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    pre: {
        maxWidth: '100vw',
        textAlign: 'left',
        margin: '1em 0',
        padding: 16,
        overflow: 'auto',
        borderRadius: 8,
        '& .token-line': {
            lineHeight: '1.3em',
            height: '1.3em'
        }
    }
});

const Pre = ({ children, ...props }) => {
    const classes = useStyles();
    return (
        <pre {...props} className={classes.pre}>
            {children}
        </pre>
    );
};

const CodeHighlight = ({ sourceCode }) => {
    return (
        <Highlight {...defaultProps} theme={codeTheme} language="jsx" code={sourceCode}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <Pre className={className} style={style}>
                    <React.Fragment>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </React.Fragment>
                </Pre>
            )}
        </Highlight>
    );
};

CodeHighlight.propTypes = {
    sourceCode: PropTypes.string.isRequired
};

export default CodeHighlight;
