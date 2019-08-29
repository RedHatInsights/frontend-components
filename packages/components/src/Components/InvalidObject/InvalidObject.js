import React from 'react';
import PropTypes from 'prop-types';
import Icon404 from './icon-404';
import {
    Title,
    Button
} from '@patternfly/react-core';
import { withRouter } from 'react-router-dom';

const InvalidObject = (props) => {
    return (
        <section className="pf-l-page__main-section pf-c-page__main-section ins-c-component_invalid-componet">
            <Title size='3xl'>This doesn&apos;t seem to exist.</Title>
            <Icon404/>
            <Title size='xl' className='ins-c-text__sorry'>Sorry, we couldn&apos;t find what you&apos;re looking for.
                    The page you requested may have changed or moved.</Title>
            <Button
                variant="link"
                onClick={ () => { props.history.goBack(); } }>
                    Go Back
            </Button>
        </section>
    );
};

InvalidObject.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func
    })
};

InvalidObject.defaultProps = {
    history: {
        push: () => undefined,
        goBack: () => undefined
    }
};

export default withRouter(InvalidObject);
