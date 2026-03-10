import { useEffect } from 'react';

const Smartsupp = () => {
  useEffect(() => {
    var _smartsupp = window._smartsupp = window._smartsupp || {};
    _smartsupp.key = '63e738b95e6ce47a75abac7a15fb86fa9154ff24';
    _smartsupp.alignX = 'right';
    _smartsupp.offsetX = 10;
    _smartsupp.offsetY = 10;
    window.smartsupp = window.smartsupp || function() { window.smartsupp._.push(arguments); };
    window.smartsupp._ = [];
    var s = document.getElementsByTagName('script')[0];
    var c = document.createElement('script');
    c.type = 'text/javascript';
    c.charset = 'utf-8';
    c.async = true;
    c.src = 'https://www.smartsuppchat.com/loader.js?';
    s.parentNode.insertBefore(c, s);
  }, []);

  return null;
};

export default Smartsupp;
