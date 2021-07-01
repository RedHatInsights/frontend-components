/* eslint-disable react/prop-types */
import { Title, Card, CardBody } from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import Link from 'next/link';
import CodeHighlight from '../example-component/code-highlight';

const useTableStyles = createUseStyles({
    card: {
        overflowY: 'auto'
    }
});

const A = ({ children, target,  ...props }) => <Link {...props}><a target={target}>{children}</a></Link>;
export const H1 = ({ className, ...props }) => <Title className="pf-u-mb-lg" headingLevel="h1" {...props} />;
const H2 = ({ className, ...props }) => <Title className="pf-u-mb-md pf-u-mt-md" headingLevel="h2" {...props} />;
const H3 = ({ className, ...props }) => <Title className="pf-u-mb-md pf-u-mt-md" headingLevel="h3" {...props} />;
const H4 = ({ className, ...props }) => <Title className="pf-u-mb-md pf-u-mt-md" headingLevel="h4" {...props} />;
const Table = props => {
    const classes = useTableStyles();
    return <Card className={classnames('pf-u-mb-lg', classes.card)}><CardBody><table className="pf-c-table pf-m-grid-md" {...props} /></CardBody></Card>;
};

const Code = ({ children, className }) => <CodeHighlight language={className ? className.split('-').pop() : ''} sourceCode={children} />;

const components = {
    a: A,
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    table: Table,
    code: Code
};

export default components;
