import React, { Suspense, lazy, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { StackItem, Stack, Title, Spinner } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';

const SampleComponent = lazy(() => import('../../Components/SampleComponent/sample-component'));

const SamplePage = () => {
  useEffect(() => {
    insights?.chrome?.appAction?.('sample-page');
  }, []);

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="This app was boostraped with CLI tool!" />
        <p> This is page header text </p>
      </PageHeader>
      <Main>
        <Stack hasGutter>
          <StackItem>
            <Suspense fallback={<Spinner />}>
              <SampleComponent />
            </Suspense>
          </StackItem>
          <StackItem>
            <Stack hasGutter>
              <StackItem>
                <Title headingLevel="h2" size="3xl">
                  {' '}
                  Links{' '}
                </Title>
              </StackItem>
              <StackItem>
                <Link to="/oops"> How to handle 500s in app </Link>
              </StackItem>
              <StackItem>
                <Link to="/no-permissions"> How to handle 403s in app </Link>
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </Main>
    </React.Fragment>
  );
};

export default SamplePage;
