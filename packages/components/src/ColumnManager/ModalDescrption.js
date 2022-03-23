import React from 'react';
import propTypes from 'prop-types';
import { Button, Text, TextContent, TextVariants } from '@patternfly/react-core';

const ModalDescription = ({ description, selectAllColumns, selectAllLabel }) => (
  <TextContent>
    {description}
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
