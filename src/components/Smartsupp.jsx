import { useEffect } from 'react';

const Smartsupp = () => {
  useEffect(() => {
    var _smartsupp = window._smartsupp = window._smartsupp || {};
    _smartsupp.key = '79a353611e6241bcd836ecacbd707bebb5846ef3';
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
