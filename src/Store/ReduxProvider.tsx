'use client';
import React from 'react';

import { Provider } from 'react-redux';
import { store } from './Store';

const ReduxProvider = (props: any) => {
  return <Provider store={store}>{props.children}</Provider>;
};

export default ReduxProvider;
