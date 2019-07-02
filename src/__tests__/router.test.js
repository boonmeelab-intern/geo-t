import React from 'react'
import { shallow } from 'enzyme'

import Explore from '../pages/explore'
import NotFound from '../pages/not-found'

describe('Home components', () => {
  it('render', () => {
    const wrapper = shallow(<Explore />);
    expect(wrapper.exists()).toBe(true);
  });
});

describe('NotFound components', () => {
  it('render', () => {
    const wrapper = shallow(<NotFound />);
    expect(wrapper.exists()).toBe(true);
  });
});