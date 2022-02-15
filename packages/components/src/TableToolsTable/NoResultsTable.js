import React from 'react';
import propTypes from 'prop-types';
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import EmptyTable from '../EmptyTable';

export const NoResultsTable = ({ kind = 'results' }) => (
  <EmptyTable>
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full}>
        <Title headingLevel="h5" size="lg">
          No matching {kind} found
        </Title>
        <EmptyStateBody>
          This filter criteria matches no {kind}.<br />
          Try changing your filter settings.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  </EmptyTable>
);

NoResultsTable.propTypes = {
  kind: propTypes.string,
};

export default NoResultsTable;
