import React from 'react';
import { Card, CardBody, Button, ButtonVariant, Pagination, Level, LevelItem, PaginationVariant } from '@patternfly/react-core';

interface NotificationPaginationProps {
  page?: number;
  onSetPage?: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
  onClearAll?: () => void;
  count?: number;
}

export const NotificationPagination: React.ComponentType<NotificationPaginationProps> = ({ page = 1, onSetPage, onClearAll, count = 0 }) => (
  <Card className="notification-item">
    <CardBody>
      <Level>
        <LevelItem>
          <Button variant={ButtonVariant.link} className="ins-c-pagination__clear-all" onClick={onClearAll}>
            Clear all
          </Button>
        </LevelItem>
        <LevelItem>
          <Pagination
            itemCount={count}
            variant={PaginationVariant.bottom}
            perPageOptions={[
              {
                title: '5',
                value: 5,
              },
            ]}
            titles={{
              items: 'Notifications',
            }}
            perPage={5}
            page={page}
            onSetPage={onSetPage}
          />
        </LevelItem>
      </Level>
    </CardBody>
  </Card>
);

export default NotificationPagination;
