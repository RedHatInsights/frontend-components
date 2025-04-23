import React from 'react';
import TagModal from './TagModal';
import { render, screen } from '@testing-library/react';

describe('TagModal', () => {
  it('renders the modal open with row of tags', () => {
    const { container } = render(
      <TagModal
        loaded
        isOpen={true}
        systemName={'paul.localhost.com'}
        rows={[
          ['key', 'value'],
          ['thing', 'otherthing'],
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the modal with a child component', () => {
    const { container } = render(
      <TagModal loaded isOpen={true} systemName={'paul.localhost.com'}>
        <h1>I am a child component</h1>
      </TagModal>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render modal with disabled button', () => {
    const { container } = render(
      <TagModal
        loaded
        isOpen={true}
        systemName={'paul.localhost.com'}
        rows={[
          ['key', 'value'],
          ['thing', 'otherthing'],
        ]}
        onApply={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render modal with enabled button', () => {
    const { container } = render(
      <TagModal
        loaded
        isOpen={true}
        systemName={'paul.localhost.com'}
        rows={[
          ['key', 'value'],
          ['thing', 'otherthing'],
        ]}
        selected={['thing']}
        onApply={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render title with system name', () => {
    render(
      <TagModal
        loaded
        isOpen={true}
        systemName={'paul.localhost.com'}
        rows={[
          ['key', 'value'],
          ['thing', 'otherthing'],
        ]}
      />,
    );

    screen.getByRole('heading', {
      name: /tags for paul\.localhost\.com/i,
    });
  });

  it('should render title with title prop', () => {
    render(
      <TagModal
        loaded
        title="title-test"
        isOpen={true}
        rows={[
          ['key', 'value'],
          ['thing', 'otherthing'],
        ]}
      />,
    );

    screen.getByRole('heading', {
      name: /title-test/i,
    });
  });
});

describe('Two tables', () => {
  it('should render two tables in loading state', () => {
    const { container } = render(
      <TagModal
        isOpen={true}
        systemName={'paul.localhost.com'}
        tabNames={['something', 'another']}
        rows={[[['something']], [['another']]]}
        columns={[[{ title: 'one' }], [{ title: 'two' }]]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render two tables', () => {
    const { container } = render(
      <TagModal
        isOpen={true}
        systemName={'paul.localhost.com'}
        tabNames={['something', 'another']}
        loaded={[true, true]}
        rows={[[['something']], [['another']]]}
        columns={[[{ title: 'one' }], [{ title: 'two' }]]}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render modal with disabled button', () => {
    const { container } = render(
      <TagModal
        isOpen={true}
        systemName={'paul.localhost.com'}
        tabNames={['something', 'another']}
        loaded={[true, true]}
        rows={[[['something']], [['another']]]}
        columns={[[{ title: 'one' }], [{ title: 'two' }]]}
        onApply={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render modal with enabled button', () => {
    const { container } = render(
      <TagModal
        isOpen={true}
        systemName={'paul.localhost.com'}
        tabNames={['something', 'another']}
        loaded={[true, true]}
        rows={[[['something']], [['another']]]}
        columns={[[{ title: 'one' }], [{ title: 'two' }]]}
        selected={[['thing']]}
        onApply={jest.fn()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
