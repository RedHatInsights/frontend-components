import React from 'react';
import propTypes from 'prop-types';
import { Button, Text, TextContent, TextVariants } from '@patternfly/react-core';

const ModalDescription = ({ selectAllColumns, selectAllLabel }) => (
  <TextContent>
    <Text component={TextVariants.p}>Selected categories will be displayed in the table.</Text>
    <Button isInline onClick={selectAllColumns} variant="link">
      {selectAllLabel}
    </Button>
  </TextContent>
);

ModalDescription.propTypes = {
  selectAllColumns: propTypes.func,
  selectAllLabel: propTypes.node,
};

export default ModalDescription;
