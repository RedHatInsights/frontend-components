import React, { useEffect, useRef, useState } from 'react'
import { Title, Card, CardBody } from '@patternfly/react-core';
import dynamic from 'next/dynamic';
import classnames from 'classnames';
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
      <Title headingLevel="h2" className={classnames(classes.name, 'pf-u-mt-md', 'pf-u-mb-md')}>{name}</Title>
      {Component && <Card className="pf-u-mb-md"><CardBody><Component /></CardBody></Card>}
      <ExpandablePanel sourceCode={sourceCode} />
    </div>
  )
}

export default ExampleComponent;
