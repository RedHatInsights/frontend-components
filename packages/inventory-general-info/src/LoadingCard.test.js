import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import LoadingCard, { Clickable } from './LoadingCard';

[true, false].map(isLoading => {
    it(`Loading card render - isLoading: ${isLoading}`, () => {
        const wrapper = shallow(<LoadingCard isLoading={ isLoading } title={ `Card that is ${isLoading ? 'loading' : 'loaded'}` } />);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

it('should render loading bars', () => {
    const wrapper = shallow(<LoadingCard
        isLoading={ true }
        title="Some title"
        items={
            [
                {
                    onClick: jest.fn(),
                    title: 'test-title',
                    size: 'md',
                    value: 'some value'
                }, {
                    title: 'just title'
                }
            ]
        }
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it(`Loading card render`, () => {
    const wrapper = shallow(<LoadingCard
        isLoading={ false }
        title="Some title"
        items={
            [
                {
                    onClick: jest.fn(),
                    title: 'test-title',
                    size: 'md',
                    value: 'some value'
                }, {
                    title: 'just title'
                }
            ]
        }
    />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('Clickable should render - no data', () => {
    const wrapper = shallow(<Clickable />);
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('Clickable should render', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Clickable item={ {
        onClick,
        value: 15,
        target: 'some-target'
    } } />);
    wrapper.find('a').first().simulate('click', {
        preventDefault: () => {
        }
    });
    expect(onClick).toHaveBeenCalled();
    expect(toJson(wrapper)).toMatchSnapshot();
});

it('Clickable should render - 0 value', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<Clickable item={ {
        onClick,
        value: 0,
        target: 'some-target'
    } } />);
    expect(onClick).not.toHaveBeenCalled();
    expect(toJson(wrapper)).toMatchSnapshot();
});
