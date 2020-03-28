import React from 'react';
import propTypes from 'prop-types';
import {
    Grid,
    GridItem,
    Stack,
    StackItem,
    Text,
    TextVariants
} from '@patternfly/react-core';
import ConditionalLink from './ConditionalLink';

const RuleChildRow = ({ rule }) => {
    const { refId, description, identifier, references, rationale } = rule;
    const key = `rule-child-row-${refId}`;

    return <React.Fragment key={ key }>
        <div className='margin-top-lg'>
            <Stack id={ `rule-description-${key}` } className='margin-bottom-lg'>
                <StackItem style={ { marginBottom: 'var(--pf-global--spacer--sm)' } }>
                    <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>Description</b></Text>
                </StackItem>
                <StackItem isFilled>{ description }</StackItem>
            </Stack>
            <Stack id={ `rule-identifiers-references-${key}` } className='margin-bottom-lg'>
                <Grid>
                    { identifier && identifier.length > 0 && <GridItem span={ 2 }>
                        <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>Identifier</b></Text>
                        <Text>
                            {
                                identifier.map((ident, idx) => (
                                    <ConditionalLink
                                        href={ ident.system }
                                        target='_blank'
                                        key={ `${refId}-identifier-${idx}` }>
                                        { ident.label }
                                    </ConditionalLink>)
                                ).reduce((prev, next) => ([ prev, ', ', next ]))
                            }
                        </Text>
                    </GridItem> }

                    { (references && references.length > 0) && <GridItem span={ 10 }>
                        <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>References</b></Text>
                        <Text>
                            {
                                references.map((ref, idx) => (
                                    <ConditionalLink
                                        href={ ref.href }
                                        target='_blank'
                                        key={ `${refId}-reference-${idx}` }>
                                        { ref.label }
                                    </ConditionalLink>)
                                ).reduce((prev, next) => ([ prev, ', ', next ]))
                            }
                        </Text>
                    </GridItem> }
                </Grid>
            </Stack>
            { rationale &&
            <Stack id={ `rule-rationale-${key}` } style={ { marginBottom: 'var(--pf-global--spacer--lg)' } }>
                <StackItem style={ { marginBottom: 'var(--pf-global--spacer--sm)' } }>
                    <Text className='pf-c-form__label' component={ TextVariants.h5 }><b>Rationale</b></Text>
                </StackItem>
                <StackItem isFilled>{ rationale }</StackItem>
            </Stack>
            }
        </div>
    </React.Fragment>;
};

RuleChildRow.propTypes = {
    rule: propTypes.object
};

export default RuleChildRow;
