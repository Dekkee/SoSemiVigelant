import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();

import * as React from 'react';
import { render } from 'react-dom';

import { App } from './App';

render(<App/>, document.getElementById('root'));
