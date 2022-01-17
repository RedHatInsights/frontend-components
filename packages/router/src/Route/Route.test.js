/* eslint-disable react/prop-types */
import React, { Fragment, useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import ChromeRouter from '../ChromeRouter';
import Route from './Route';

const RouterWrapper = ({ useChromeRouter = false, basename, children, ...props }) => {
  const Wrapper = useChromeRouter ? ChromeRouter : Fragment;
  return (
    <MemoryRouter {...props}>
      <Wrapper {...(useChromeRouter ? { basename } : {})}>{children}</Wrapper>
    </MemoryRouter>
  );
};

describe('Route', () => {
  it('should work regularly outside of ChromeRouter', () => {
    const renderSpy = jest.fn();
    const RenderTrigger = ({
      history: {
        location: { pathname },
      },
    }) => {
      useEffect(() => {
        renderSpy(pathname);
      }, []);
      return null;
    };

    const MatchComponent = () => (
      <RouterWrapper initialEntries={['/foo/bar']}>
        <Route exact path="/foo/bar" component={RenderTrigger} />
        <Route exact path="/a" component={RenderTrigger} />
        <Route path="/" component={RenderTrigger} />
      </RouterWrapper>
    );

    mount(<MatchComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(2);
    expect(renderSpy).toHaveBeenCalledWith('/foo/bar');
  });

  it('should work regularly render route witouth adding prefix', () => {
    const renderSpy = jest.fn();
    const RenderTrigger = ({
      history: {
        location: { pathname },
      },
    }) => {
      useEffect(() => {
        renderSpy(pathname);
      }, []);
      return null;
    };

    const MatchComponent = () => (
      <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={['/foo/bar/baz']}>
        <Route path="/baz" component={RenderTrigger} />
        <Route path="/bar" component={RenderTrigger} />
      </RouterWrapper>
    );

    mount(<MatchComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith('/foo/bar/baz');
  });

  it('should work regularly render route witouth adding prefix with path array prop', () => {
    const renderSpy = jest.fn();
    const RenderTrigger = ({
      history: {
        location: { pathname },
      },
    }) => {
      useEffect(() => {
        renderSpy(pathname);
      }, []);
      return null;
    };

    const MatchComponent = () => (
      <RouterWrapper useChromeRouter basename="/foo/bar" initialEntries={['/foo/bar/baz']}>
        <Route path="/baz" component={RenderTrigger} />
        <Route path={['/bar', '/quaxx/bar']} component={RenderTrigger} />
      </RouterWrapper>
    );

    mount(<MatchComponent />);

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(renderSpy).toHaveBeenCalledWith('/foo/bar/baz');
  });
});
