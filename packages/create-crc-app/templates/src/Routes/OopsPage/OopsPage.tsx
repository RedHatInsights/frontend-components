import React, { useEffect } from 'react';

import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { Unavailable } from '@redhat-cloud-services/frontend-components/Unavailable';

const OopsPage = () => {
  useEffect(() => {
    insights?.chrome?.appAction?.('oops-page');
  }, []);
  return (
    <Main>
      <Unavailable />
    </Main>
  );
};

export default OopsPage;
