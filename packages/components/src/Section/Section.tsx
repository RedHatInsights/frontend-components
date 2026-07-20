import React from 'react';
import classNames from 'classnames';

import './section.scss';

export interface SectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  type?: string;
}

const Section = ({ type, children, className, ...props }: SectionProps) => {
  const sectionClasses = classNames(className, { [`ins-l-${type}`]: type !== undefined });

  return (
    <section {...props} className={sectionClasses}>
      {' '}
      {children}{' '}
    </section>
  );
};

export default Section;
