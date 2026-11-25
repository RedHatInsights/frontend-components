import { FormattedMessage } from '@redhat-cloud-services/frontend-components-translations/localization';
import React from 'react';

import UnauthorizedAccess, { UnauthorizedAccessProps } from '@patternfly/react-component-groups/dist/dynamic/UnauthorizedAccess';
import messages from '../messages';

/**
 * @deprecated Do not use deprecated NotAuthorized import, the component has been moved to @patternfly/react-component-groups
 */
const NotAuthorized = ({
  bodyText = (
    <FormattedMessage
      {...messages.notAuthorizedBody}

      values={{ access: (chunks) => <a href="./iam/my-user-access">{chunks}</a> }}
    />
  ),
  ...props
}: UnauthorizedAccessProps) => <UnauthorizedAccess {...props} bodyText={bodyText} />;

export default NotAuthorized;
