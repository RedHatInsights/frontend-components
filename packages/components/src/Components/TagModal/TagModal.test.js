import React from 'react';
import { render, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import TagModal from './TagModal';

describe('TagCount component', () => {
    it('Render the modal open with row of tags', () => {
        const wrapper = shallow(<TagModal loaded isOpen={true} systemName={'paul.localhost.com'} rows={[ [ 'key', 'value' ], [ 'thing', 'otherthing' ] ]} />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Render the modal with a child component', () => {
        const wrapper = shallow(<TagModal loaded isOpen={true} systemName={'paul.localhost.com'}>
            <h1>I am a child component</h1>
        </TagModal>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('Two tables', () => {
    it('should render two tables in loading state', () => {
        const wrapper = shallow(<TagModal
            isOpen={true}
            systemName={'paul.localhost.com'}
            tabNames={[ 'something', 'another' ]}
            rows={[
                [ [ 'something' ] ],
                [ [ 'another' ] ]
            ]}
            columns={[
                [{ title: 'one' }],
                [{ title: 'two' }]
            ]}
        />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render two tables', () => {
        const wrapper = shallow(<TagModal
            isOpen={true}
            systemName={'paul.localhost.com'}
            tabNames={[ 'something', 'another' ]}
            loaded={[ true, true ]}
            rows={[
                [ [ 'something' ] ],
                [ [ 'another' ] ]
            ]}
            columns={[
                [{ title: 'one' }],
                [{ title: 'two' }]
            ]}
        />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
