import React from 'react';
import TagModal from './TagModal';
import { render } from '@testing-library/react';

describe('TagCount component', () => {
  it('Render the modal open with row of tags', () => {
    const { container } = render(
      <TagModal
        loaded
        isOpen={true}
        systemName={'paul.localhost.com'}
        rows={[
          ['key', 'value'],
          ['thing', 'otherthing'],
        ]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('Render the modal with a child component', () => {
    const { container } = render(
      <TagModal loaded isOpen={true} systemName={'paul.localhost.com'}>
        <h1>I am a child component</h1>
      </TagModal>
    );
    expect(container).toMatchSnapshot();
  });

  it('Should render modal with disabled button', () => {
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
      />
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
      />
    );
    expect(container).toMatchSnapshot();
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
      />
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
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('Should render modal with disabled button', () => {
    const { container } = render(
      <TagModal
        isOpen={true}
        systemName={'paul.localhost.com'}
        tabNames={['something', 'another']}
        loaded={[true, true]}
        rows={[[['something']], [['another']]]}
        columns={[[{ title: 'one' }], [{ title: 'two' }]]}
        onApply={jest.fn()}
      />
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
      />
    );
    expect(container).toMatchSnapshot();
  });
});
