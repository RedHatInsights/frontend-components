import { Button } from '@patternfly/react-core/dist/dynamic/components/Button';
import { Popover } from '@patternfly/react-core/dist/dynamic/components/Popover';
import { Text } from '@patternfly/react-core/dist/dynamic/components/Text';
import { TextContent } from '@patternfly/react-core/dist/dynamic/components/Text';
import CodeBranchIcon from '@patternfly/react-icons/dist/dynamic/icons/code-branch-icon';
import ExternalLinkAltIcon from '@patternfly/react-icons/dist/dynamic/icons/external-link-alt-icon';
import React from 'react';

export interface OpenSourceBadgeProps {
  /*
  A URL to a page containing an overview of the project's relevant repositories.
  */
  repositoriesURL: string;
}

const OpenSourceBadge: React.FunctionComponent<OpenSourceBadgeProps> = ({ repositoriesURL }) => {
  return (
    <>
      <Popover
        bodyContent={
          <TextContent>
            <Text>
              This service is open source, so all of its code is inspectable. Explore repositories to view and contribute to the source code.
            </Text>
            <Button component="a" target="_blank" variant="link" icon={<ExternalLinkAltIcon />} iconPosition="right" isInline href={repositoriesURL}>
              Repositories
            </Button>
          </TextContent>
        }
        id={'open-source-badge'}
        headerContent={'About open source'}
      >
        <Button variant="plain" aria-label="About Open Services" className="pf-v5-u-pl-sm open-source-badge">
          <CodeBranchIcon />
        </Button>
      </Popover>
    </>
  );
};

export default OpenSourceBadge;
