import { FormattedMessage, useIntlWithFallback } from '@redhat-cloud-services/frontend-components-translations/localization';
import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';

import CodeBranchIcon from '@patternfly/react-icons/dist/dynamic/icons/code-branch-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/dynamic/icons/external-link-alt-icon';
import React from 'react';
import messages from '../messages';

export interface OpenSourceBadgeProps {
  /*
  A URL to a page containing an overview of the project's relevant repositories.
  */
  repositoriesURL: string;
}

const OpenSourceBadge = ({ repositoriesURL }: OpenSourceBadgeProps) => {
  const intl = useIntlWithFallback();

  return (
    <>
      <Popover
        bodyContent={
          <Content>
            <Content component="p">
              <FormattedMessage {...messages.openSourceBadgeThisServiceIsOpenSourceSoAllOfItsCodeIsInspectable} />
            </Content>
            <Button component="a" target="_blank" variant="link" icon={<ExternalLinkAltIcon />} iconPosition="right" isInline href={repositoriesURL}>
              <FormattedMessage {...messages.openSourceBadgeRepositories} />
            </Button>
          </Content>
        }
        id={'open-source-badge'}
        headerContent={intl.formatMessage(messages.openSourceBadgeAboutOpenSource)}
      >
        <Button
          icon={<CodeBranchIcon />}
          variant="plain"
          aria-label={intl.formatMessage(messages.openSourceBadgeAboutOpenServices)}
          className="pf-v6-u-pl-sm open-source-badge"
        />
      </Popover>
    </>
  );
};

export default OpenSourceBadge;
