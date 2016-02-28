'use strict';

import XHRJson from './XHRJson';
import RequestJSON from './requestJson';

export function adapt() {
  if (typeof window !== 'undefined') {
    return new XHRJson();
  }
  else if (typeof process !== 'undefined') {
    return new RequestJSON();
  }
}
