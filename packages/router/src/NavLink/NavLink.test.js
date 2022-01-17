/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { MemoryRouter, useLocation, Route } from 'react-router-dom';
import { mount } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import NavLink from './NavLink';

const RouterWrapper = ({ useChromeRouter = false, basename, children, ...props }) => {
  const Wrapper = useChromeRouter ? ChromeRouter : Fragment;
  return (
    <MemoryRouter {...props}>
      <Wrapper {...(useChromeRouter ? { basename } : {})}>{children}</Wrapper>
    </MemoryRouter>
  );
};

describe('NavLink', () => {
  it('should navigate as regular NavLink outside of ChromeRouter from "/foo" to "/bar"', (done) => {
    expect.assertions(1);
    const RenderTrigger = () => {
      const location = useLocation();
      useEffect(() => {
        expect(location.pathname).toEqual('/bar');
        done();
      }, []);
      return null;
    };

    const MatchComponent = () => (
      <RouterWrapper initialEntries={['/foo']}>
        <NavLink id="link" to="/bar" />
        <Route path="/bar">
          <RenderTrigger />
        </Route>
      </RouterWrapper>
    );

    const wrapper = mount(<MatchComponent />);
    wrapper.find('a#link').simulate('click', { button: 0 });
  });

  it('should navigate from of ChromeRouter from "/foo" to "/foo/bar/baz"', (done) => {
    expect.assertions(1);
    const RenderTrigger = () => {
      const location = useLocation();
      useEffect(() => {
        expect(location.pathname).toEqual('/foo/bar/baz');
        done();
      }, []);
      return null;
    };

    const MatchComponent = () => (
      <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={['/foo']}>
        <NavLink id="link" to="/baz" />
        <Route path="/foo/bar/baz">
          <RenderTrigger />
        </Route>
      </RouterWrapper>
    );

    const wrapper = mount(<MatchComponent />);
    wrapper.find('a#link').simulate('click', { button: 0 });
  });
});
