/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Button,
  Title,
  Card,
  CardBody,
  Text,
  TextContent,
  TextVariants,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from '@patternfly/react-core';
import { createUseStyles } from 'react-jss';
import classnames from 'classnames';
import { LinkIcon } from '@patternfly/react-icons';
import Link from 'next/link';
import CodeHighlight from '../example-component/code-highlight';

const useAnchorStyles = createUseStyles({
  anchorIcon: {
    display: 'none !important',
    padding: '0px !important',
    margin: '0px !important',
    marginLeft: '4px !important',
  },
  anchor: {
    display: 'flex',
    alignItems: 'center',
    color: 'inherit',
    textDecoration: 'none',
    '&:hover $anchorIcon': {
      display: 'inline-block !important',
    },
  },
});

function addLinkAnchor(Component) {
  return ({ className, ...props }) => {
    const classes = useAnchorStyles();
    if (typeof props?.children !== 'undefined') {
      /**
       * We know the title is always either a string or a element with a string child.
       */
      const text = typeof props?.children === 'string' ? props.children : props?.children?.props?.children || '';
      const anchor = text.replace(/\s/gm, '');
      return (
        <Component className={classnames(className, 'docs-content-link')} {...props}>
          <a id={anchor} className={classes.anchor} href={`#${anchor}`}>
            {props.children}
            <Button className={classes.anchorIcon} component="span" variant="plain">
              <LinkIcon />
            </Button>
          </a>
        </Component>
      );
    }

    return <Component {...props} />;
  };
}

const useTableStyles = createUseStyles({
  card: {
    overflowY: 'auto',
  },
});

const A = ({ children, target, ...props }) => (
  <Link {...props}>
    <a target={target}>{children}</a>
  </Link>
);

export const H1 = addLinkAnchor(({ className, ...props }) => <Title className={classnames(className, 'pf-u-mb-lg')} headingLevel="h1" {...props} />);

export const H2 = addLinkAnchor(({ className, ...props }) => (
  <Title className={classnames(className, 'pf-u-mb-md pf-u-mt-md')} headingLevel="h2" {...props} />
));

export const H3 = addLinkAnchor(({ className, ...props }) => (
  <Title className={classnames(className, 'pf-u-mb-md pf-u-mt-md')} headingLevel="h3" {...props} />
));
export const H4 = addLinkAnchor(({ className, ...props }) => (
  <Title className={classnames(className, 'pf-u-mb-md pf-u-mt-md')} headingLevel="h4" {...props} />
));
export const Table = (props) => {
  const classes = useTableStyles();
  return (
    <Card className={classnames('pf-u-mb-lg', classes.card)}>
      <CardBody>
        <table className="pf-c-table pf-m-grid-md" {...props} />
      </CardBody>
    </Card>
  );
};

const Code = ({ children, className }) => <CodeHighlight language={className ? className.split('-').pop() : ''} sourceCode={children} />;

const Li = ({ children }) => <TextListItem component={TextListItemVariants.li}>{children}</TextListItem>;

const OrderedList = ({ children }) => (
  <TextContent>
    <TextList component={TextListVariants.ol}>{children}</TextList>
  </TextContent>
);

export const UnorderedList = ({ children }) => (
  <TextContent>
    <TextList component={TextListVariants.ul}>{children}</TextList>
  </TextContent>
);

export const Paragraph = ({ children, className }) => (
  <TextContent className={className}>
    <Text component={TextVariants.p}>{children}</Text>
  </TextContent>
);

const components = {
  a: A,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  table: Table,
  code: Code,
  li: Li,
  ol: OrderedList,
  ul: UnorderedList,
  p: Paragraph,
};

export default components;
