import React from 'react';
import SkeletonTablePF, { SkeletonTableProps } from '@patternfly/react-component-groups/dist/dynamic/SkeletonTable';

/**
 * @deprecated Do not use deprecated SkeletonTable import, the component has been moved to @patternfly/react-component-groups
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SkeletonTable: React.FunctionComponent<SkeletonTableProps> = (props) => <SkeletonTablePF {...props} />;

export default SkeletonTable;
