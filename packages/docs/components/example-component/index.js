import React, { useEffect, useRef, useState } from 'react'
import { Title } from '@patternfly/react-core';
import dynamic from 'next/dynamic';
import { createUseStyles } from 'react-jss'
import ExpandablePanel from './expandable-panel';

const useStyles = createUseStyles({
  name: {
    '&:first-letter': {
      textTransform: 'capitalize'
    }
  },
  exampleContainer: {
    widht: '100%'
  },
  componentContainer: {
    width: '100%',
    background: 'var(--pf-global--BackgroundColor--100)',
    padding: 'var(--pf-global--spacer--md)',
    marginTop: 'var(--pf-global--spacer--sm)',
    marginBottom: 'var(--pf-global--spacer--sm)'
  }
})

const ExampleComponent = ({ source, name }) => {
  const { current: Component } = useRef(dynamic(import(`@docs/examples/${source}`)))
  const [sourceCode, setSourceCode] = useState('');
  const classes = useStyles()

  useEffect(() => {
    import(`!raw-loader!@docs/examples/${source}`).then((file) => {
      setSourceCode(file.default);
    });
  }, [])
  return (
    <div className={classes.exampleContainer}>
      <Title headingLevel="h2" className={classes.name}>{name}</Title>
      {Component && <div className={classes.componentContainer}><Component /></div>}
      <ExpandablePanel sourceCode={sourceCode} />
    </div>
  )
}

export default ExampleComponent;
