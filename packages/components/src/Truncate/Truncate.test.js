import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Truncate from './Truncate';

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
laborum.`;

describe('Truncate component', () => {
  describe('should render correctly', () => {
    [true, false].forEach((isInline) => {
      describe(isInline ? 'inline' : 'block', () => {
        it('without length specified', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} />);
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('with short length', () => {
          const wrapper = shallow(<Truncate text={text} length={2} />);
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('clicking on expand toggles to collapse', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          wrapper.find('.ins-c-expand-button').first().simulate('click');
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('custom expande button', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('custom button titles', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          wrapper.find('.ins-c-expand-button').first().simulate('click');
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('clicking on expand toggles to collapse', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          wrapper.find('.ins-c-expand-button').first().simulate('click');
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('custom expande button', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('custom button titles', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} expandText="Custom expand" collapseText="Custom collapse" />);
          wrapper.find('.ins-c-expand-button').first().simulate('click');
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('when text length is less than user specified length', () => {
          const wrapper = shallow(<Truncate text={text} inline={isInline} length={1000} />);
          expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('hovering over toggles to collapse', () => {
          const wrapper = shallow(<Truncate length={50} inline={isInline} text={text} expandOnMouseOver hideExpandText />);
          const eventElement = isInline ? wrapper.find('.ins-c-truncate').first() : wrapper.find('.ins-c-truncate').first().children().first();

          expect(toJson(wrapper)).toMatchSnapshot();

          eventElement.simulate('mouseenter');
          expect(toJson(wrapper)).toMatchSnapshot();

          eventElement.simulate('mouseleave');
          expect(toJson(wrapper)).toMatchSnapshot();
        });
      });
    });
  });
});
