import React, { useEffect, useRef, useState } from 'react'
import { Title } from '@patternfly/react-core';
import dynamic from 'next/dynamic';
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  name: {
    '&:first-letter': {
      textTransform: 'capitalize'
    }
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
    <div>
      <Title headingLevel="h2" className={classes.name}>{name}</Title>
      {Component && <Component />}
      <pre>
        {sourceCode}
      </pre>
    </div>
  )
}

export default ExampleComponent;
