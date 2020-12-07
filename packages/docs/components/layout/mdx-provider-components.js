import { Title } from '@patternfly/react-core';
import '@patternfly/react-styles/css/components/Table/table';

const H1 = ({ className, ...props }) => <Title className="pf-u-mb-lg" headingLevel="h1" {...props} />;
const H2 = ({ className, ...props }) => <Title className="pf-u-mb-lg" headingLevel="h2" {...props} />;
const Table = props => <table className="pf-c-table pf-m-grif-md" {...props} />;

const components = {
    h1: H1,
    h2: H2,
    table: Table
};

export default components;
