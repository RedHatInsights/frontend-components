import React from 'react';

const DefaultErrorMessage = () => {
  const redirectLink = 'https://access.redhat.com/support';
  const statusLink = 'https://status.redhat.com';

  return (
    <>
      If the problem persists, contact <a href={redirectLink}>Red Hat Support</a> or check our <a href={statusLink}> status page</a> for known
      outages.
    </>
  );
};

export default DefaultErrorMessage;
