import React from 'react';
import classNames from 'classnames';

import './section.scss';

export interface SectionProps {
  type?: string;
  className?: string;
}

const Section: React.FunctionComponent<SectionProps> = ({ type, children, className, ...props }) => {
  const sectionClasses = classNames(className, { [`ins-l-${type}`]: type !== undefined });

  return (
    <section {...props} className={sectionClasses}>
      {' '}
      {children}{' '}
    </section>
  );
};

export default Section;
