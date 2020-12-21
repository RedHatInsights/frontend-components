import { Title, Card, CardBody } from '@patternfly/react-core';

const H1 = ({ className, ...props }) => <Title className="pf-u-mb-lg" headingLevel="h1" {...props} />;
const H2 = ({ className, ...props }) => <Title className="pf-u-mb-lg" headingLevel="h2" {...props} />;
const H3 = ({ className, ...props }) => <Title className="pf-u-mb-lg" headingLevel="h2" {...props} />;
const Table = props => <Card className="pf-u-mb-lg"><CardBody><table className="pf-c-table pf-m-grid-md" {...props} /></CardBody></Card>;

const components = {
    h1: H1,
    h2: H2,
    h3: H3,
    table: Table
};

export default components;
