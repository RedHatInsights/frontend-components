import React from 'react';
import { mount } from 'enzyme';
import Description from '../../../sourceFormRenderer/components/Description';

describe('Description component', () => {
    describe('should render correctly', () => {
        const Content = () => <h1>Cosi</h1>;
        let initialProps;
        let getStateSpy;

        beforeEach(() => {
            getStateSpy = jest.fn();
            initialProps = {
                // eslint-disable-next-line react/display-name
                Content: Content,
                className: 'classa',
                name: 'description',
                formOptions: {
                    getState: getStateSpy
                }
            };
        });

        afterEach(() => {
            getStateSpy.mockReset();
        });

        it('content', () => {
            const wrapper = mount(<Description {...initialProps}/>);
            expect(wrapper.find(Content)).toHaveLength(1);
        });
    });
});
