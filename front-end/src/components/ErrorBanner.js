import React from "react";
import "../App.css";  
import { t } from "i18next";

function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div className="gc-error-banner" role="alert">
      <strong>{t('form.error-banner')}</strong> {message} 
    </div>
  );
}

export default ErrorBanner;
