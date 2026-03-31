import React from "react";
import { useTranslation } from "react-i18next";
import "../index.css";

function MailFailBanner() {
  const { t } = useTranslation();
  return (
    <div className="gc-mail-fail-banner" role="alert">
      <div className="gc-mail-fail-title">{t("form.mail-fail-1")}</div>
      <div>{t("form.mail-fail-2")}</div>
    </div>
  );
}

export default MailFailBanner;

