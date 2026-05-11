import React from 'react';

function Banner({ lang }) {
  const message = lang === "fr"
    ? (window._env_?.BANNER_TEXT_FR || window._env_?.BANNER_TEXT)
    : (window._env_?.BANNER_TEXT || window._env_?.BANNER_TEXT_FR);
  if (!message) return null;
  return (
    <section className="overview-warning overview-warning--banner" aria-label={message}>
      <div className="overview-warning-rail" aria-hidden="true">
        <svg
          className="overview-warning-icon"
          viewBox="0 0 24 24"
          focusable="false"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 19.5h20L12 2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line
            x1="12" y1="9" x2="12" y2="14.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17.6" r="1.2" fill="currentColor" />
        </svg>
      </div>
      <div className="overview-warning-body">
        <p>{message}</p>
      </div>
    </section>
  );
}

export default Banner;
