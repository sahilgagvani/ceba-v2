import React from 'react';

function Banner() {
  const message = window._env_?.BANNER_TEXT;
  if (!message) return null;
  return <div className="ceba-banner">{message}</div>;
}

export default Banner;
