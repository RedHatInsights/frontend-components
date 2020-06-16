import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core/dist/esm/layouts/Grid';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/components/esm/Skeleton';
import { DateFormat } from '@redhat-cloud-services/frontend-components/components/esm/DateFormat';
import { CullingInformation } from '@redhat-cloud-services/frontend-components/components/esm/CullingInfo';
import { getFact } from './helpers';

const FactsInfo = ({ entity, loaded, ...props }) => (
    <Grid className="ins-entity-facts" { ...props }>
        <GridItem md={ 6 }>
            <div>
                <span>
                    UUID:
                </span>
                <span>
                    {
                        loaded ?
                            getFact(`id`, entity) || ' ' :
                            <Skeleton size={ SkeletonSize.md } />
                    }
                </span>
            </div>
            <div>
                <span>
                    Last seen:
                </span>
                <span>
                    {
                        loaded ?
                            (
                                CullingInformation ? <CullingInformation
                                    culled={getFact('culled_timestamp', entity)}
                                    staleWarning={getFact('stale_warning_timestamp', entity)}
                                    stale={getFact('stale_timestamp', entity)}
                                >
                                    <DateFormat date={getFact('updated', entity)} type="exact" />
                                </CullingInformation> : <DateFormat date={getFact('updated', entity)} type="exact" />
                            ) :
                            <Skeleton size={ SkeletonSize.sm } />
                    }
                </span>
            </div>
        </GridItem>
    </Grid>
);

FactsInfo.propTypes = {
    loaded: PropTypes.bool,
    entity: PropTypes.object
};

export default FactsInfo;
