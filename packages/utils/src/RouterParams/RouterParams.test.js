import React from 'react';
import { Link, MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import RouterParams from './RouterParams';

describe('RouterParams component', () => {
  const RouterParamsComponent = RouterParams('div');
  let initialState;
  let mockStore;

  beforeEach(() => {
    mockStore = configureStore();
    initialState = {
      routerData: {},
    };
  });

  it('should render', () => {
    const wrapper = shallow(
      <MemoryRouter keyLength={0}>
        <RouterParamsComponent />
      </MemoryRouter>
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('should dispatch on mount when path matches', () => {
    const store = mockStore(initialState);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/route']}>
          <Route render={(props) => <RouterParamsComponent {...props} />} path="/route" />
        </MemoryRouter>
      </Provider>
    );
    expect(store.getActions()[0].type).toBe('@@INSIGHTS-CORE/NAVIGATION');
  });

  it('should dispatch on mount and pass params', () => {
    const store = mockStore(initialState);
    mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/route/paramValue']}>
          <Route render={(props) => <RouterParamsComponent {...props} />} path="/route/:paramName" />
        </MemoryRouter>
      </Provider>
    );
    expect(store.getActions()[0].type).toBe('@@INSIGHTS-CORE/NAVIGATION');
    expect(store.getActions()[0].payload.params).toEqual({ paramName: 'paramValue' });
  });

  it('should dispatch on update when parameter changes', () => {
    const store = mockStore({ routerData: { path: '/route/:paramName', params: { paramName: 'paramValue0' } } });
    const wrapper = mount(
      <MemoryRouter initialEntries={['/route/paramValue0']}>
        <React.Fragment>
          <Provider store={store}>
            <Route render={(props) => <RouterParamsComponent {...props} />} path="/route/:paramName" />
          </Provider>
          <Link to="/route/paramValue1" id="link" />
        </React.Fragment>
      </MemoryRouter>
    );
    wrapper.find('a#link').props().onClick(new MouseEvent('click'));
    expect(store.getActions()).toHaveLength(3);
    expect(store.getActions()[1].payload).toEqual({
      path: '/route/:paramName',
      params: { paramName: 'paramValue1' },
    });
  });

  it('should dispatch on update when path changes', () => {
    const store = mockStore({ routerData: { path: '/previousRoute/:paramName', params: { paramName: 'paramValue0' } } });
    const wrapper = mount(
      <MemoryRouter initialEntries={['/route/paramValue0']}>
        <React.Fragment>
          <Provider store={store}>
            <Route render={(props) => <RouterParamsComponent {...props} />} path="/route/:paramName" />
          </Provider>
          <Link to="/route/paramValue0" id="link" />
        </React.Fragment>
      </MemoryRouter>
    );
    wrapper.find('a#link').props().onClick(new MouseEvent('click'));
    expect(store.getActions().length).toBe(3);
    expect(store.getActions()[1].payload).toEqual({
      path: '/route/:paramName',
      params: { paramName: 'paramValue0' },
    });
  });

  it('should not dispatch on mount when path is not exact', () => {
    const store = mockStore(initialState);
    mount(
      <MemoryRouter initialEntries={['/route/path/paramValue']}>
        <Provider store={store}>
          <Route render={(props) => <RouterParamsComponent {...props} />} path="/route/:paramName" />
        </Provider>
      </MemoryRouter>
    );
    expect(store.getActions()).toHaveLength(0);
  });

  it('should not dispatch on update when path is not exact', () => {
    const store = mockStore({ routerData: { path: '/previousRoute/:paramName', params: { paramName: 'paramValue0' } } });
    const wrapper = mount(
      <MemoryRouter initialEntries={['/route/paramValue0']}>
        <React.Fragment>
          <Provider store={store}>
            <Route render={(props) => <RouterParamsComponent {...props} />} path="/route/:paramName" />
          </Provider>
          <Link to="/route/path/paramValue0" id="link" />
        </React.Fragment>
      </MemoryRouter>
    );
    wrapper.find('a#link').props().onClick(new MouseEvent('click'));
    expect(store.getActions()).toHaveLength(1);
  });

  it('should not dispatch on update when params and path matches', () => {
    const store = mockStore({ routerData: { path: '/route/:paramName', params: { paramName: 'paramValue0' } } });
    const wrapper = mount(
      <MemoryRouter initialEntries={['/route/paramValue0']}>
        <React.Fragment>
          <Provider store={store}>
            <Route render={(props) => <RouterParamsComponent {...props} />} path="/route/:paramName" />
          </Provider>
          <Link to="/route/paramValue0" id="link" />
        </React.Fragment>
      </MemoryRouter>
    );
    wrapper.find('a#link').props().onClick(new MouseEvent('click'));
    expect(store.getActions()).toHaveLength(1);
  });
});
