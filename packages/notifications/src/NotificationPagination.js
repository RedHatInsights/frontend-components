import React from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardBody,
    Button,
    ButtonVariant,
    Pagination,
    Level,
    LevelItem,
    PaginationVariant
} from '@patternfly/react-core';

const NotificationPagination = ({ page, onSetPage, onClearAll, count }) => (
    <Card className="notification-item">
        <CardBody>
            <Level>
                <LevelItem>
                    <Button variant={ ButtonVariant.link } className="ins-c-pagination__clear-all" onClick={ onClearAll }>Clear all</Button>
                </LevelItem>
                <LevelItem>
                    <Pagination
                        itemCount={ count }
                        variant={ PaginationVariant.bottom }
                        perPageOptions={ [{
                            title: '5',
                            value: 5
                        }] }
                        titles={ {
                            items: 'Notifications'
                        } }
                        perPage={ 5 }
                        page={ page }
                        onSetPage={ onSetPage }
                    />
                </LevelItem>
            </Level>
        </CardBody>
    </Card>
);

NotificationPagination.propTypes = {
    count: PropTypes.number,
    page: PropTypes.number,
    onSetPage: PropTypes.func,
    onClearAll: PropTypes.func
};
NotificationPagination.defaultProps = {
    count: 0,
    page: 1,
    onSetPage: Function,
    onClearAll: Function
};

export default NotificationPagination;
