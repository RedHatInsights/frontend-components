import React from 'react';
import Actions, { actionPropsGenerator, overflowActionsMapper } from './Actions';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

const onButtonClick = jest.fn();

const actions = [
    <button onClick={ onButtonClick } key="btn">Some button</button>,
    {
        label: 'Some title',
        onClick: jest.fn()
    },
    {
        label: 'Custom props',
        props: {
            key: 'some-key'
        }
    },
    'plain string'
];

describe('Actions - component', () => {
    describe('should render', () => {
        it('no data', () => {
            const wrapper = shallow(<Actions />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('just actions', () => {
            const wrapper = shallow(<Actions actions={ actions } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('empty actions', () => {
            const wrapper = shallow(<Actions overflowActions={ actions } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('actions and overflow', () => {
            const wrapper = shallow(<Actions actions={ actions } overflowActions={ actions } />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('one action', () => {
            const wrapper = shallow(<Actions actions={ [ actions[0] ]} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('one action and multiple overflow', () => {
            const wrapper = shallow(<Actions actions={[ actions[0] ]} overflowActions={ actions }/>);
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('actionObject as first action', () => {
            const wrapper = shallow(<Actions actions={ [ actions[1] ]} />);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('API', () => {
        it('should update open', () => {
            const wrapper = mount(<Actions actions={actions} />);
            wrapper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrapper.update();
            expect(wrapper.instance().state.isOpen).toBe(true);
        });

        it('should NOT call onSelect', () => {
            const onSelect = jest.fn();
            const wrapper = mount(<Actions actions={ actions } />);
            wrapper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('button.pf-c-dropdown__menu-item').first().simulate('click');
            expect(onSelect).not.toHaveBeenCalled();
        });

        it('should call onSelect', () => {
            const onSelect = jest.fn();
            const wrapper = mount(<Actions actions={actions} onSelect={ onSelect } />);
            wrapper.find('button.pf-c-dropdown__toggle').first().simulate('click');
            wrapper.update();
            wrapper.find('button.pf-c-dropdown__menu-item').first().simulate('click');
            expect(onSelect).toHaveBeenCalled();
        });
    });
});

describe('actionPropsGenerator', () => {
    it('should consume component', () => {
        const result = actionPropsGenerator(actions[0]);
        expect(result.component).toBe('div');
    });

    it('should call correct onClick', () => {
        const onClick = jest.fn();
        const result = actionPropsGenerator({ ...actions[1], onClick });
        result.onClick({});
        expect(onClick).toHaveBeenCalled();
        expect(onClick.mock.calls[0][1].label).toBe('Some title');
    });

    it('should allow custom component in object', () => {
        const result = actionPropsGenerator({ ...actions[1], props: { component: 'div' } });
        expect(result.component).toBe('div');
    });
});

describe('overflowActionsMapper', () => {
    it('should render component', () => {
        const wrapper = shallow(<div>{overflowActionsMapper(actions[0])}</div>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render action object', () => {
        const wrapper = shallow(<div>{overflowActionsMapper(actions[1])}</div>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render plain string', () => {
        const wrapper = shallow(<div>{overflowActionsMapper(actions[2])}</div>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
