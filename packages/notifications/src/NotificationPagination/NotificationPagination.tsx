import { FormattedMessage, useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';
import { Button, ButtonVariant, Card, CardBody, Level, LevelItem, Pagination, PaginationVariant } from '@patternfly/react-core';
import messages from '../messages';

interface NotificationPaginationProps {
  page?: number;
  onSetPage?: (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
  onClearAll?: () => void;
  count?: number;
}

export const NotificationPagination: React.ComponentType<NotificationPaginationProps> = ({ page = 1, onSetPage, onClearAll, count = 0 }) => {
  const intl = useIntlWithFallback();
  return (
    <Card className="notification-item">
      <CardBody>
        <Level>
          <LevelItem>
            <Button variant={ButtonVariant.link} className="ins-c-pagination__clear-all" onClick={onClearAll}>
              <FormattedMessage {...messages.notificationPaginationClearAll} />
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
                items: intl.formatMessage(messages.notificationPaginationItems),
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
};

export default NotificationPagination;
