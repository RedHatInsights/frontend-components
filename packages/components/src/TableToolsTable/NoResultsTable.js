import React from 'react';
import propTypes from 'prop-types';
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import EmptyTable from '../EmptyTable';

export const NoResultsTable = ({
  title = 'No matching results found',
  body = (
    <>
      This filter criteria matches no {kind}.<br />
      Try changing your filter settings.
    </>
  ),
  kind = 'results',
}) => (
  <EmptyTable>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <Title headingLevel="h5" size="lg">
          {title}
        </Title>
        <EmptyStateBody>{body}</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </EmptyTable>
);

NoResultsTable.propTypes = {
  kind: propTypes.string,
  body: propTypes.node,
  title: propTypes.node,
};

export default NoResultsTable;
