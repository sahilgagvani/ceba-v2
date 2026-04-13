// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";
import ErrorBanner from "./components/ErrorBanner";
import MailFailBanner from "./components/MailFailBanner";

const getCurrentPath = () => {
  if (typeof window === "undefined") return "/";
  return (window.location?.pathname || "/").toLowerCase();
};

const getPageType = (path) => {
  if (
    path === "/faq.html" ||
    path.endsWith("/faq.html") ||
    path === "/faq" ||
    path.endsWith("/faq")
  ) {
    return "faq";
  }

  if (
    path === "/statistics.html" ||
    path.endsWith("/statistics.html") ||
    path === "/statistics" ||
    path.endsWith("/statistics") ||
    path === "/statistiques.html" ||
    path.endsWith("/statistiques.html") ||
    path === "/statistiques" ||
    path.endsWith("/statistiques")
  ) {
    return "statistics";
  }

  if (
    path === "/overview.html" ||
    path.endsWith("/overview.html") ||
    path === "/overview" ||
    path.endsWith("/overview") ||
    path === "/survol.html" ||
    path.endsWith("/survol.html") ||
    path === "/survol" ||
    path.endsWith("/survol")
  ) {
    return "overview";
  }

  if (
    path === "/contact.html" ||
    path.endsWith("/contact.html") ||
    path === "/contact" ||
    path.endsWith("/contact") ||
    path === "/coordonnees.html" ||
    path.endsWith("/coordonnees.html") ||
    path === "/coordonnees" ||
    path.endsWith("/coordonnees")
  ) {
    return "contact-info";
  }

  return "contact-form";
};

const getBlankPageHeadingKey = (pageType) => {
  if (pageType === "overview") return "form.overview-title";
  if (pageType === "contact-info") return "form.contact-info-title";
  return null;
};

const getBlankPageBreadcrumbItems = (pageType, t) => {
  const overviewItem = {
    href: t("form.breadcrumb-link1"),
    label: t("form.breadcrumb-label1"),
  };

  if (pageType === "overview") return [overviewItem];

  if (pageType === "faq") {
    return [
      overviewItem,
      {
        href: t("form.nav-link2"),
        label: t("form.nav-label2"),
      },
    ];
  }

  if (pageType === "statistics") {
    return [
      overviewItem,
      {
        href: t("form.statistics.breadcrumbHref"),
        label: t("form.statistics.breadcrumbLabel"),
      },
    ];
  }

  if (pageType === "contact-info") {
    return [
      overviewItem,
      {
        href: t("form.nav-link3"),
        label: t("form.nav-label3"),
      },
    ];
  }

  return [];
};

const LOCALIZED_PATHS = {
  overview: {
    en: "/en/overview.html",
    fr: "/fr/survol.html",
  },
  faq: {
    en: "/en/faq.html",
    fr: "/fr/faq.html",
  },
  statistics: {
    en: "/en/statistics.html",
    fr: "/fr/statistiques.html",
  },
  "contact-info": {
    en: "/en/contact.html",
    fr: "/fr/coordonnees.html",
  },
  "contact-form": {
    en: "/en",
    fr: "/fr",
  },
};

const getLocalizedPath = (pageType, language) =>
  LOCALIZED_PATHS[pageType]?.[language] || `/${language}`;

function App() {
  const [recaptchaConfig, setRecaptchaConfig] = useState({
    siteKey: '',
    hasRecaptcha: false,
    loaded: false
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [contactMethod, setContactMethod] = useState("");
  const radiosRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const businessNameRef = useRef(null);
  const contactMethodRef = useRef(null);
  const emailRef = useRef(null);
  const confirmEmailRef = useRef(null);
  const telephoneRef = useRef(null);
  const confirmTelephoneRef = useRef(null);
  const contactTimeRef = useRef(null);
  const reasonRef = useRef(null);
  const businessNumberRef = useRef(null);
  const cebaIDRef = useRef(null);
  const messageRef = useRef(null);
  const captchaContainerRef = useRef(null);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessNameError, setBusinessNameError] = useState("");

  const [contactMethodError, setContactMethodError] = useState("");
   const [contactTime, setContactTime] = useState("");
   const [contactTimeError, setContactTimeError] = useState("");
   const [reason, setReason] = useState("");
   const [reasonError, setReasonError] = useState("");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailConfirmError, setConfirmEmailError] = useState("");
  const [telephone, setTelephone] = useState("");
  const [telephoneError, setTelephoneError] = useState("");
  const [confirmTelephone, setConfirmTelephone] = useState("");
  const [confirmTelephoneError, setConfirmTelephoneError] = useState("");


  const [businessNumber, setBusinessNumber] = useState("");
  const [businessNumberError, setBusinessNumberError] = useState("");
  const [cebaID, setCebaID] = useState("");
  const [cebaIDError, setCebaIDError] = useState("");

  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");

  const [emailSent, setEmailSent] = useState(false);
  const [emailFailed, setEmailFailed] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleCaptchaChange = (value) => {
    setCaptchaVerified(!!value);
    setRecaptchaToken(value || "");
  };

  const handleBlur = (value, setError, labelKey, errorKey) => {
    if (!value.trim()) {
      setError(`${t(labelKey)} ${t(errorKey)}`);
    } else {
      setError("");
    }
  };


const formatTelephoneNumber = (value) => {
  const digits = value.replace(/\D/g, "").substring(0, 10);

  const area = digits.substring(0, 3);
  const prefix = digits.substring(3, 6);
  const line = digits.substring(6, 10);

  let formatted = "";
  if (digits.length > 0) formatted = "(" + area;
  if (digits.length >= 3) formatted += ") " + prefix;
  if (digits.length >= 6) formatted += "-" + line;

  return formatted;
};






  const { t, i18n } = useTranslation();
  const currentPath = getCurrentPath();
  const pageType = getPageType(currentPath);
  const isFaqPage = pageType === "faq";
  const isStatisticsPage = pageType === "statistics";
  const isOverviewPage = pageType === "overview";
  const isContactInfoPage = pageType === "contact-info";
  const isOverviewNavActive = isOverviewPage || isStatisticsPage;
  const isContactNavActive = pageType === "contact-form" || isContactInfoPage;
  const blankPageHeadingKey = getBlankPageHeadingKey(pageType);
  const blankPageBreadcrumbItems = getBlankPageBreadcrumbItems(pageType, t);
  const faqPageTitle = t("form.faq.pageTitle");
  const faqPortalCtaLabel = t("form.faq.portalCtaLabel");
  const faqPortalUrl = t("form.intro02.link");
  const faqDateModified = t("form.faq.dateModified");
  const faqSections = ["assigned", "unassigned", "archive"].map((key) => {
    const section = t(`form.faq.sections.${key}`, { returnObjects: true });
    const isSectionObject = section && typeof section === "object" && !Array.isArray(section);

    return {
      id: key,
      title: isSectionObject ? section.title : "",
      body: isSectionObject ? section.body : "",
      links: isSectionObject && Array.isArray(section.links) ? section.links : [],
    };
  });
  const contactInfo = t("form.contactInfo", { returnObjects: true });
  const isContactInfoObject =
    contactInfo && typeof contactInfo === "object" && !Array.isArray(contactInfo);
  const contactInfoIntroParagraphs =
    isContactInfoObject && Array.isArray(contactInfo.introParagraphs)
      ? contactInfo.introParagraphs
      : [];
  const contactInfoCards =
    isContactInfoObject && Array.isArray(contactInfo.cards) ? contactInfo.cards : [];
  const contactInfoDateModified =
    isContactInfoObject && typeof contactInfo.dateModified === "string"
      ? contactInfo.dateModified
      : "";
  const overview = t("form.overview", { returnObjects: true });
  const isOverviewObject = overview && typeof overview === "object" && !Array.isArray(overview);
  const overviewServiceNotice =
    isOverviewObject && typeof overview.serviceNotice === "string"
      ? overview.serviceNotice
      : "";
  const overviewWarning =
    isOverviewObject && overview.warning && typeof overview.warning === "object"
      ? overview.warning
      : {};
  const overviewPortalCard =
    isOverviewObject && overview.portalCard && typeof overview.portalCard === "object"
      ? overview.portalCard
      : {};
  const overviewSections =
    isOverviewObject && Array.isArray(overview.sections) ? overview.sections : [];
  const overviewStats =
    isOverviewObject && overview.stats && typeof overview.stats === "object"
      ? overview.stats
      : {};
  const overviewDateModified =
    isOverviewObject && typeof overview.dateModified === "string"
      ? overview.dateModified
      : "";
  const statistics = t("form.statistics", { returnObjects: true });
  const isStatisticsObject =
    statistics && typeof statistics === "object" && !Array.isArray(statistics);
  const statisticsTitle =
    isStatisticsObject && typeof statistics.title === "string" ? statistics.title : "";
  const statisticsIntro =
    isStatisticsObject && typeof statistics.intro === "string" ? statistics.intro : "";
  const statisticsSummary =
    isStatisticsObject && typeof statistics.summary === "string" ? statistics.summary : "";
  const statisticsFootnote =
    isStatisticsObject && typeof statistics.footnote === "string" ? statistics.footnote : "";
  const statisticsDateModified =
    isStatisticsObject && typeof statistics.dateModified === "string"
      ? statistics.dateModified
      : "";
  const statisticsImage =
    isStatisticsObject && statistics.image && typeof statistics.image === "object"
      ? statistics.image
      : {};
  const statisticsRegions =
    isStatisticsObject && Array.isArray(statistics.regions) ? statistics.regions : [];
  const statisticsDataHeading =
    isStatisticsObject && typeof statistics.dataHeading === "string"
      ? statistics.dataHeading
      : "";

  const renderContactInfoText = (content) => {
    if (typeof content === "string") return content;
    if (!content || typeof content !== "object") return null;

    const hasLink = content.linkHref && content.linkLabel;

    return (
      <>
        {content.beforeLink}
        {hasLink && (
          <>
            {" "}
            <a href={content.linkHref}>{content.linkLabel}</a>
          </>
        )}
        {content.afterLink}
      </>
    );
  };

  const renderOverviewRichText = (content) => {
    if (typeof content === "string") return content;
    if (!Array.isArray(content)) return null;

    return content.map((fragment, index) => {
      if (!fragment || typeof fragment !== "object") return null;

      if (fragment.href) {
        return (
          <a key={`${fragment.href}-${index}`} href={fragment.href}>
            {fragment.text}
          </a>
        );
      }

      return <React.Fragment key={`${fragment.text || "fragment"}-${index}`}>{fragment.text}</React.Fragment>;
    });
  };

  const handleLanguageToggle = () => {
    const targetLanguage = i18n.language === "en" ? "fr" : "en";
    const targetPath = getLocalizedPath(pageType, targetLanguage);

    if (typeof window !== "undefined" && window.location.pathname !== targetPath) {
      window.history.pushState({}, "", targetPath);
    }

    setIsNavOpen(false);
    i18n.changeLanguage(targetLanguage);
  };

  // Load application configuration from backend at runtime
  useEffect(() => {
    const loadAppConfig = async () => {
      if (process.env.NODE_ENV === 'test') {
        return;
      }

      try {
        const recaptchaResponse = await fetch('/api/app/recaptcha-config');

        if (recaptchaResponse.ok) {
          const recaptchaConfig = await recaptchaResponse.json();
          
          setRecaptchaConfig({
            siteKey: recaptchaConfig.siteKey || '',
            hasRecaptcha: recaptchaConfig.hasRecaptcha || false,
            loaded: true
          });
        } else {
          setRecaptchaConfig({ siteKey: '', hasRecaptcha: false, loaded: true });
        }
      } catch (error) {
        setRecaptchaConfig({ siteKey: '', hasRecaptcha: false, loaded: true });
      }
    };

    loadAppConfig();
  }, []);

useEffect(() => {

  document.title = isFaqPage
    ? `CEBA ${t("form.nav-label2")}`
    : isStatisticsPage
      ? `CEBA ${statisticsTitle}`
    : isOverviewPage
      ? `CEBA ${t("form.nav-label1")}`
      : isContactInfoPage
        ? `CEBA ${t("form.nav-label3")}`
      : `CEBA ${t("form.breadcrumb-label3")}`;
  const header = document.querySelector("gcds-header");
  if (!header) return;

  const onClick = (e) => {
    const path = e.composedPath?.() || [];
    const langLink = path.find(
      (el) => el && el.tagName === "A" && el.getAttribute && el.getAttribute("hreflang")
    );
    if (!langLink) return;

    e.preventDefault();
    const target = langLink.getAttribute("hreflang"); 
    if (target && target !== i18n.language) i18n.changeLanguage(target);
  };

  header.addEventListener("click", onClick, true); 


  const el = radiosRef.current;
  if (!el) return;
  const handler = (e) => {
    const value = e.detail;
    setContactMethod(value);
  };
  el.addEventListener("gcdsChange", handler);
  return () => {
    el.removeEventListener("gcdsChange", handler);
    header.removeEventListener("click", onClick, true);
  }
}); 


  const countDigits = (v) => (v || "").replace(/\D/g, "").length;
  const normalizePhone = (v) => (v || "").replace(/\D/g, "");
  const isValidEmail = (value) => {
    const trimmed = (value || "").trim();
    if (!trimmed) return false;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(trimmed);
  };
  const emailMismatch =
    contactMethod === "contact-email" &&
    email.trim() &&
    confirmEmail.trim() &&
    email.trim() !== confirmEmail.trim();

  const telephoneMismatch =
    contactMethod === "contact-telephone" &&
    telephone.trim() &&
    confirmTelephone.trim() &&
    normalizePhone(telephone) !== normalizePhone(confirmTelephone);

  const requiredBasicsFilled =
    firstName.trim() &&
    lastName.trim() &&
    businessName.trim() &&
    contactMethod &&
    (contactMethod === "contact-telephone" ? contactTime : true) &&
    reason &&
    (
      (reason === "ceba-id-recovery" || reason === "other")
        ? businessNumber.trim()
        : cebaID.trim()
    ) &&
    message.trim();

  const channelFieldsFilled =
    contactMethod === "contact-email"
      ? email.trim() && confirmEmail.trim()
      : contactMethod === "contact-telephone"
        ? telephone.trim() && confirmTelephone.trim()
        : false;

  const hasEmptyRequiredFields = !(requiredBasicsFilled && channelFieldsFilled);
  const disableEmailButton =
    emailSending || (recaptchaConfig.hasRecaptcha && !captchaVerified);

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
      try {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (typeof ref.current.focus === 'function') {
          ref.current.focus({ preventScroll: true });
        }
      } catch (_) {
        // no-op
      }
    }
  };

  const validateAndGetFirstErrorRef = () => {
    const requiredMsg = t("form.error-isRequired");

    let firstError = null;

    const check = (condition, setErr, ref) => {
      if (condition) {
        setErr(requiredMsg);
        if (!firstError) firstError = ref;
      } else {
        setErr("");
      }
    };

    check(!firstName.trim(), setFirstNameError, firstNameRef);
    check(!lastName.trim(), setLastNameError, lastNameRef);
    check(!businessName.trim(), setBusinessNameError, businessNameRef);

    if (!contactMethod) {
      setContactMethodError(requiredMsg);
      if (!firstError) firstError = contactMethodRef;
    } else {
      setContactMethodError("");
    }

    if (contactMethod === "contact-email") {
      check(!email.trim(), setEmailError, emailRef);
      check(!confirmEmail.trim(), setConfirmEmailError, confirmEmailRef);
      if (email.trim() && !isValidEmail(email)) {
        setEmailError(requiredMsg);
        if (!firstError) firstError = emailRef;
      }
      if (confirmEmail.trim() && !isValidEmail(confirmEmail)) {
        setConfirmEmailError(requiredMsg);
        if (!firstError) firstError = confirmEmailRef;
      }
      if (!firstError && emailMismatch) firstError = confirmEmailRef;
    }

    if (contactMethod === "contact-telephone") {
      check(!telephone.trim(), setTelephoneError, telephoneRef);
      check(!confirmTelephone.trim(), setConfirmTelephoneError, confirmTelephoneRef);
       const telephoneDigits = countDigits(telephone);
       const confirmTelephoneDigits = countDigits(confirmTelephone);
       if (telephone.trim() && telephoneDigits !== 10) {
         setTelephoneError(requiredMsg);
         if (!firstError) firstError = telephoneRef;
       }
       if (confirmTelephone.trim() && confirmTelephoneDigits !== 10) {
         setConfirmTelephoneError(requiredMsg);
         if (!firstError) firstError = confirmTelephoneRef;
       }
      if (!firstError && telephoneMismatch) firstError = confirmTelephoneRef;
      if (!contactTime) {
        setContactTimeError(requiredMsg);
        if (!firstError) firstError = contactTimeRef;
      } else {
        setContactTimeError("");
      }
    } else {
      setContactTimeError("");
    }

    if (!reason) {
      setReasonError(requiredMsg);
      if (!firstError) firstError = reasonRef;
    } else {
      setReasonError("");
    }

    if (reason === "ceba-id-recovery" || reason === "other") {
      check(!businessNumber.trim(), setBusinessNumberError, businessNumberRef);
      const businessNumberDigits = countDigits(businessNumber);
      if (businessNumber.trim() && businessNumberDigits !== 9) {
        setBusinessNumberError(requiredMsg);
        if (!firstError) firstError = businessNumberRef;
      }
      setCebaIDError("");
    } else if (reason) {
      check(!cebaID.trim(), setCebaIDError, cebaIDRef);
      const cebaDigitsOnly = (cebaID || "").replace(/\D/g, "");
      if (
        cebaID.trim() &&
        (cebaDigitsOnly.length !== 12 || !cebaDigitsOnly.startsWith("967"))
      ) {
        setCebaIDError(requiredMsg);
        if (!firstError) firstError = cebaIDRef;
      }
      setBusinessNumberError("");
    } else {
      setBusinessNumberError("");
      setCebaIDError("");
    }

    check(!message.trim(), setMessageError, messageRef);

    return firstError;
  };


  return (
    <div className="layout">
    <div className="content-flex">
    <div style={{ position: "relative" }}>
      <button
      className="lang-toggle"
      aria-label={i18n.language === "en" ? "Français" : "English"}
      onClick={handleLanguageToggle}
      >
      <span className="lang-toggle-label-full" aria-hidden="true">
        {i18n.language === "en" ? "Français" : "English"}
      </span>
      <span className="lang-toggle-label-short" aria-hidden="true">
        {i18n.language === "en" ? "FR" : "EN"}
      </span>
      </button>
      <gcds-header heading="CEBA" lang={i18n.language}>
      </gcds-header>
        
    </div>

    <nav className="custom-top-nav">
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={isNavOpen}
            aria-controls="top-nav-links"
            onClick={() => setIsNavOpen(open => !open)}
          >
            <span className="nav-toggle-icon" aria-hidden="true"></span>
            <span className="nav-toggle-text">MENU</span>
          </button>
          <div
            id="top-nav-links"
            className={`nav-container ${isNavOpen ? "nav-container-open" : ""}`}
          >
            <a
              href={t("form.nav-link1")}
              className={`nav-link ${isOverviewNavActive ? "active" : ""}`}
              onClick={() => setIsNavOpen(false)}
            >
              {t("form.nav-label1")}
            </a>
            <a
              href={t("form.nav-link2")}
              className={`nav-link ${isFaqPage ? "active" : ""}`}
              onClick={() => setIsNavOpen(false)}
            >
              {t("form.nav-label2")}
            </a>
            <a
              href={t("form.nav-link3")}
              className={`nav-link ${isContactNavActive ? "active" : ""}`}
              onClick={() => setIsNavOpen(false)}
            >
              {t("form.nav-label3")}
            </a>
          </div>
        </nav>

      <gcds-container id="main-content" main-container size="xl"
      centered
      tag="main">
        {isFaqPage && (
        <>
        <div className="faq-page">
          <div className="faq-page-topbar">
            <div className="faq-breadcrumbs">
              <nav aria-label="Breadcrumb" className="gc-breadcrumbs">
                <ol>
                  {blankPageBreadcrumbItems.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <a href={faqPortalUrl} className="faq-sign-in-link">
              {faqPortalCtaLabel}
            </a>
          </div>
          <div className="faq-page-title">
            <gcds-heading tag="h1" level="1">
              {faqPageTitle}
            </gcds-heading>
          </div>
          {faqSections.map((section) => (
            <section key={section.id} className="faq-section">
              <div className="faq-section-title">
                <gcds-heading tag="h2" level="2" character-limit="false">
                  {section.title}
                </gcds-heading>
              </div>
              <p className="faq-section-body">{section.body}</p>
              <div className="faq-link-grid">
                {section.links.map((link) => (
                  <a
                    key={`${section.id}-${link.label}`}
                    href={link.href}
                    className="faq-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </section>
          ))}
          <div className="faq-date-modified">{faqDateModified}</div>
        </div>
        </>
        )}
        {isOverviewPage && (
        <>
        <div className="overview-page">
          <div className="page-topbar">
            <div className="page-breadcrumbs">
              <nav aria-label="Breadcrumb" className="gc-breadcrumbs">
                <ol>
                  {blankPageBreadcrumbItems.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <a href={faqPortalUrl} className="page-sign-in-link">
              {faqPortalCtaLabel}
            </a>
          </div>
          <gcds-heading tag="h1" level="1" character-limit="false">
            {t("form.overview-title")}
          </gcds-heading>
          {overviewServiceNotice && (
            <p className="overview-service-notice">{overviewServiceNotice}</p>
          )}
          <section className="overview-warning" aria-label={overviewWarning.title || t("form.notice-title")}>
            <div className="overview-warning-rail" aria-hidden="true">
              <svg
                className="overview-warning-icon"
                viewBox="0 0 24 24"
                focusable="false"
                aria-hidden="true"
              >
                <path
                  d="M12 3.25 21.1 20.75H2.9L12 3.25Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8.5v6.25"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17.6" r="1.2" fill="currentColor" />
              </svg>
            </div>
            <div className="overview-warning-body">
              <h2>{overviewWarning.title || t("form.notice-title")}</h2>
              {Array.isArray(overviewWarning.paragraphs) &&
                overviewWarning.paragraphs.map((paragraph, index) => (
                  <p key={`overview-warning-${index}`}>{paragraph}</p>
                ))}
            </div>
          </section>
          <section className="overview-portal-card">
            <h2 className="overview-portal-card-title">{overviewPortalCard.title}</h2>
            <div className="overview-portal-card-body">
              <p className="overview-rich-paragraph">{overviewPortalCard.description}</p>
              <a href={overviewPortalCard.ctaHref} className="overview-portal-cta">
                {overviewPortalCard.ctaLabel}
              </a>
              <a href={overviewPortalCard.guideHref} className="overview-portal-guide">
                {overviewPortalCard.guideLabel}
              </a>
              <p className="overview-rich-paragraph">{overviewPortalCard.faqText}</p>
            </div>
          </section>
          {overviewSections.map((section, sectionIndex) => {
            const blocks = Array.isArray(section.blocks) ? section.blocks : [];

            return (
              <section key={`${section.title || "overview-section"}-${sectionIndex}`} className="overview-section">
                {section.title && <h2 className="overview-section-heading">{section.title}</h2>}
                {blocks.map((block, blockIndex) => {
                  const paragraphs = Array.isArray(block.paragraphs) ? block.paragraphs : [];
                  const bullets = Array.isArray(block.bullets) ? block.bullets : [];

                  return (
                    <div
                      key={`${section.title || "overview-section"}-${block.heading || blockIndex}`}
                      className="overview-subsection"
                    >
                      {block.heading && (
                        <h3 className="overview-subsection-heading">{block.heading}</h3>
                      )}
                      {paragraphs.map((paragraph, paragraphIndex) => (
                        <p
                          key={`${section.title || "overview-section"}-${block.heading || blockIndex}-${paragraphIndex}`}
                          className="overview-rich-paragraph"
                        >
                          {renderOverviewRichText(paragraph)}
                        </p>
                      ))}
                      {bullets.length > 0 && (
                        <ul className="overview-bullet-list">
                          {bullets.map((bullet, bulletIndex) => (
                            <li key={`${block.heading || "overview-bullet"}-${bullet.label || bulletIndex}`}>
                              {bullet.label && (
                                <strong className="overview-bullet-label">{bullet.label}</strong>
                              )}{" "}
                              {bullet.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}
          <section className="overview-stats">
            <h2 className="overview-section-heading">{overviewStats.title}</h2>
            <div className="overview-stats-grid">
              {Array.isArray(overviewStats.cards) &&
                overviewStats.cards.map((card, index) => (
                  <article
                    key={`${card.label || "overview-stat"}-${index}`}
                    className="overview-stat-card"
                  >
                    <div className={`overview-stat-icon overview-stat-icon-${card.icon || "businesses"}`}>
                      <span aria-hidden="true">
                        {card.icon === "funds" ? "$" : card.icon === "expansions" ? "E" : "B"}
                      </span>
                    </div>
                    <div className="overview-stat-label">{card.label}</div>
                    <div className="overview-stat-value">{card.value}</div>
                  </article>
                ))}
            </div>
            <div className="overview-stat-footnotes">
              {Array.isArray(overviewStats.footnotes) &&
                overviewStats.footnotes.map((note, index) => (
                  <p key={`overview-footnote-${index}`}>{note}</p>
                ))}
              {overviewStats.regionalLink?.href && overviewStats.regionalLink?.label && (
                <a href={overviewStats.regionalLink.href}>
                  {overviewStats.regionalLink.label}
                </a>
              )}
            </div>
            {overviewStats.summary && (
              <div className="overview-summary-line">{overviewStats.summary}</div>
            )}
          </section>
          {overviewDateModified && (
            <div className="overview-date-modified">{overviewDateModified}</div>
          )}
        </div>
        </>
        )}
        {isStatisticsPage && (
        <>
        <div className="statistics-page">
          <div className="page-topbar">
            <div className="page-breadcrumbs">
              <nav aria-label="Breadcrumb" className="gc-breadcrumbs">
                <ol>
                  {blankPageBreadcrumbItems.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <a href={faqPortalUrl} className="page-sign-in-link">
              {faqPortalCtaLabel}
            </a>
          </div>
          <div className="statistics-page-heading-wrap">
            <h1 className="statistics-page-title">{statisticsTitle}</h1>
            <span className="statistics-page-accent" aria-hidden="true"></span>
          </div>
          {statisticsIntro && (
            <h2 className="statistics-page-intro">
              {statisticsIntro}
              <sup>1</sup>
            </h2>
          )}
          <figure className="statistics-figure">
            {statisticsImage.src && (
              <img
                className="statistics-map-image"
                src={statisticsImage.src}
                alt={statisticsImage.alt || ""}
              />
            )}
            <figcaption className="statistics-figure-caption">
              {statisticsSummary && <p>{statisticsSummary}</p>}
              {statisticsFootnote && (
                <p>
                  <sup>1</sup> {statisticsFootnote}
                </p>
              )}
            </figcaption>
          </figure>
          {statisticsRegions.length > 0 && (
            <div className="sr-only">
              {statisticsDataHeading && <h2>{statisticsDataHeading}</h2>}
              <ul>
                {statisticsRegions.map((region) => (
                  <li key={`${region.code}-${region.value}`}>
                    {region.label}: {region.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {statisticsDateModified && (
            <div className="statistics-date-modified">{statisticsDateModified}</div>
          )}
        </div>
        </>
        )}
        {isContactInfoPage && (
        <>
        <div className="contact-info-page">
          <div className="page-topbar">
            <div className="page-breadcrumbs">
              <nav aria-label="Breadcrumb" className="gc-breadcrumbs">
                <ol>
                  {blankPageBreadcrumbItems.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
            <a href={faqPortalUrl} className="page-sign-in-link">
              {faqPortalCtaLabel}
            </a>
          </div>
          <gcds-heading tag="h1" level="1" character-limit="false">{t("form.contact-info-title")}</gcds-heading>
          <div className="contact-info-intro">
            {contactInfoIntroParagraphs.map((paragraph, index) => (
              <p key={`contact-info-intro-${index}`}>
                {renderContactInfoText(paragraph)}
              </p>
            ))}
          </div>
          <div className="contact-info-card-grid">
            {contactInfoCards.map((card) => {
              const sections = Array.isArray(card.sections) ? card.sections : [];
              const cardParagraphs = Array.isArray(card.paragraphs) ? card.paragraphs : [];

              return (
                <section key={card.title} className="contact-info-card">
                  <h2 className="contact-info-card-title">{card.title}</h2>
                  <div className="contact-info-card-body">
                    {sections.map((section, index) => {
                      const items = Array.isArray(section.items) ? section.items : [];
                      const sectionParagraphs = Array.isArray(section.paragraphs)
                        ? section.paragraphs
                        : [];

                      return (
                        <div
                          key={`${card.title}-${section.heading || index}`}
                          className="contact-info-card-section"
                        >
                          {section.heading && (
                            <p className="contact-info-card-section-heading">
                              <strong>{section.heading}</strong>
                            </p>
                          )}
                          {items.length > 0 && (
                            <ul>
                              {items.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                          {sectionParagraphs.map((paragraph, paragraphIndex) => (
                            <p key={`${card.title}-${section.heading || index}-${paragraphIndex}`}>
                              {renderContactInfoText(paragraph)}
                            </p>
                          ))}
                        </div>
                      );
                    })}
                    {cardParagraphs.map((paragraph, index) => (
                      <p key={`${card.title}-paragraph-${index}`}>
                        {renderContactInfoText(paragraph)}
                      </p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
          {contactInfoDateModified && (
            <div className="contact-info-date">{contactInfoDateModified}</div>
          )}
        </div>
        </>
        )}
        {!isOverviewPage && !isFaqPage && !isStatisticsPage && !isContactInfoPage && (
        <>
        <div className="breadcrumbs-wrap">
          <nav aria-label="Breadcrumb" className="gc-breadcrumbs">
            <ol>
              <li>
                <a href={t("form.breadcrumb-link1")}>{t("form.breadcrumb-label1")}</a>
              </li>
              <li>
                <a href={t("form.breadcrumb-link2")}>{t("form.breadcrumb-label2")}</a>
              </li>
              <li aria-current="page">
                {t("form.breadcrumb-label3")}
              </li>
            </ol>
          </nav>
        </div>
        <br></br>
        <br></br>
        <gcds-heading tag="h1" level="1">{t("form.title")}</gcds-heading>
        <div style={{ display: emailSent ? 'none' : undefined }}>
        <p>{t("form.intro01")}</p>
        <ul>
          <li>
            {t("form.intro02.1")}{" "}
            <a href={t("form.intro02.link")}>{t("form.intro02.2")}</a>
          </li>
          <li>
            {t("form.intro03.1")}{" "}
            <a href={t("form.intro03.link")}>{t("form.intro03.2")}</a>
          </li>
          <li>
            {t("form.intro04.1")}{" "}
            <a href={t("form.intro04.link")}>{t("form.intro04.2")}</a>{" "}
            {t("form.intro04.3")}
          </li>
        </ul>
        <p>{t("form.intro05")}</p>
        <p>{t("form.intro06")}</p>
        <br></br><br></br>
        <gcds-text> {t("form.intro07")}</gcds-text>
        </div>

        <div style={{ display: emailSent ? 'none' : undefined }}>
        
        <div>
          <label htmlFor="question-firstName" className="gc-label">
            <span className="required-asterisk" aria-hidden="true">*</span> {t("form.firstName")} <span className="required-text">{t("form.required")}</span>
          </label>
          <ErrorBanner message={firstNameError} />
          <input
          id="question-first-name"
          name="question-first-name"
          type="text"
          className={`gc-text-field ${firstNameError ? "gc-text-field--error" : ""}`}
          value={firstName}
          ref={firstNameRef}
          onChange={e => setFirstName(e.target.value)}
          onBlur={() =>
            handleBlur(firstName, setFirstNameError, t("form.error-isRequired"))
          }
        />
        </div>

        <div>
          <label htmlFor="question-lastName" className="gc-label">
            <span className="required-asterisk" aria-hidden="true">*</span> {t("form.lastName")} <span className="required-text">{t("form.required")}</span>
          </label>
          <ErrorBanner message={lastNameError} />
          <input
          id="question-lastName"
          name="question-lastName"
          type="text"
          className={`gc-text-field ${lastNameError ? "gc-text-field--error" : ""}`}
          value={lastName}
          ref={lastNameRef}
          onChange={e => setLastName(e.target.value)}
          onBlur={() =>
            handleBlur(lastName, setLastNameError, t("form.error-isRequired"))
          }
        />
        </div>

        <div>
          <label htmlFor="question-business-name" className="gc-label">
            <span className="required-asterisk" aria-hidden="true">*</span> {t("form.businessName")} <span className="required-text">{t("form.required")}</span>
          </label>
          <ErrorBanner message={businessNameError} />
          <input
          id="question-business-name"
          name="question-business-name"
          type="text"
          className={`gc-text-field ${businessNameError ? "gc-text-field--error" : ""}`}
          value={businessName}
          ref={businessNameRef}
          onChange={e => setBusinessName(e.target.value)}
          onBlur={() =>
            handleBlur(businessName, setBusinessNameError, t("form.error-isRequired"))
          }
        />
        </div>

        <div className="gc-radio-group">
          <fieldset ref={contactMethodRef}>
            <legend className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.contactMethodLegend")} <span className="required-text">{t("form.required")}</span>
            </legend>
            <ErrorBanner message={contactMethodError} />
            <label className="gc-radio">
              <input
                type="radio"
                name="contact-method"
                value="contact-email"
                checked={contactMethod === "contact-email"}
                onChange={() => { setContactMethod("contact-email"); setContactMethodError(""); }}
              />
              {t("form.contactMethodEmail")}
            </label>
            <label className="gc-radio">
              <input
                type="radio"
                name="contact-method"
                value="contact-telephone"
                checked={contactMethod === "contact-telephone"}
                onChange={() => { setContactMethod("contact-telephone"); setContactMethodError(""); }}
              />
              {t("form.contactMethodTelephone")}
            </label>
          </fieldset>
        </div>


        {contactMethod === "contact-email" && (   
          <>
          <div>
            <label htmlFor="question-email" className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.email")} <span className="required-text">{t("form.required")}</span>
            </label>
            <div>{t("form.emailHint")}</div>
            <ErrorBanner message={emailError} />
            <input
              id="question-email"
              name="question-email"
              type="email"
              className={`gc-text-field ${emailError ? "gc-text-field--error" : ""}`}
              value={email}
              ref={emailRef}
              onChange={e => setEmail(e.target.value)}
              onBlur={() =>
                handleBlur(email, setEmailError, t("form.error-isRequired"))
              }
            />
          </div>
          <div>
            {emailMismatch && (
              <div className="gc-mail-fail-banner" role="alert">{t('form.error-confirm-mismatch')}</div>
            )}
            <label htmlFor="question-confirm-email" className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.confirmEmail")} <span className="required-text">{t("form.required")}</span>
            </label>
            <div>{t("form.confirmEmailHint")}</div>
            <ErrorBanner message={emailConfirmError} />
            <input
              id="question-confirm-email"
              name="question-confirm-email"
              type="email"
              className={`gc-text-field ${emailConfirmError ? "gc-text-field--error" : ""}`}
              value={confirmEmail}
              ref={confirmEmailRef}
              onChange={e => setConfirmEmail(e.target.value)}
              onBlur={() =>
                handleBlur(confirmEmail, setConfirmEmailError, t("form.error-isRequired"))
              }
            />
          </div>

          </>
        )}
        {contactMethod === "contact-telephone" && (
          <>
          <div>
            <label htmlFor="question-telephone" className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.telephone")} <span className="required-text">{t("form.required")}</span>
            </label>
            <div>{t("form.telephoneHint")}</div>
            <ErrorBanner message={telephoneError} />
            <input
            id="question-telephone"
            name="question-telephone"
            type="text"
            className={`gc-text-field ${telephoneError ? "gc-text-field--error" : ""}`}
            value={telephone}
            ref={telephoneRef}
            onChange={e => setTelephone(formatTelephoneNumber(e.target.value))}
            onBlur={() =>
              handleBlur(telephone, setTelephoneError, t("form.error-isRequired"))
            }
          />
          </div>
          <div>
            {telephoneMismatch && (
              <div className="gc-mail-fail-banner" role="alert">{t('form.error-confirm-mismatch')}</div>
            )}
            <label htmlFor="question-confirm-telephone" className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.confirmTelephone")} <span className="required-text">{t("form.required")}</span>
            </label>
            <div>{t("form.confirmTelephoneHint")}</div>
            <ErrorBanner message={confirmTelephoneError} />
            <input
            id="question-confirm-telephone"
            name="question-confirm-telephone"
            type="text"
            className={`gc-text-field ${confirmTelephoneError ? "gc-text-field--error" : ""}`}
            value={confirmTelephone}
            ref={confirmTelephoneRef}
            onChange={e => setConfirmTelephone(formatTelephoneNumber(e.target.value))}
            onBlur={() =>
              handleBlur(confirmTelephone, setConfirmTelephoneError, t("form.error-isRequired"))
            }
          />
          </div>
          
          </>
        )}
        {contactMethod === "contact-telephone" && (
          <>
            <br></br>

            <div className="gc-radio-group">
              <fieldset ref={contactTimeRef}>
                <legend className="gc-label">
                  <span className="required-asterisk" aria-hidden="true">*</span> {t("form.contactTimeLegend")} <span className="required-text">{t("form.required")}</span>
                </legend>
                <ErrorBanner message={contactTimeError} />

                <label className="gc-radio">
                  <input
                    type="radio"
                    id="radio_contact1"
                    name="question-contact-time"
                    value="contact-time-morning"
                    checked={contactTime === "contact-time-morning"}
                    onChange={() => { setContactTime("contact-time-morning"); setContactTimeError(""); }}
                  />
                  {t("form.contactTimeMorning")}
                </label>

                <label className="gc-radio">
                  <input
                    type="radio"
                    id="radio_contact2"
                    name="question-contact-time"
                    value="contact-time-afternoon"
                    checked={contactTime === "contact-time-afternoon"}
                    onChange={() => { setContactTime("contact-time-afternoon"); setContactTimeError(""); }}
                  />
                  {t("form.contactTimeAfternoon")}
                </label>
              </fieldset>
            </div>

            <p>{t("form.contactTimeNotice")}</p>
            <br></br>
            <br></br>
          </>
        )}

        <div className="gc-radio-group">
          <fieldset ref={reasonRef}>
            <legend className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.reasonLegend")} <span className="required-text">{t("form.required")}</span>
            </legend>
            <ErrorBanner message={reasonError} />

            <label className="gc-radio">
              <input
                type="radio"
                id="reason-recovery"
                name="question-reason"
                value="ceba-id-recovery"
                checked={reason === "ceba-id-recovery"}
                onChange={() => { setReason("ceba-id-recovery"); setReasonError(""); }}
              />
              {t("form.reasonRecovery")}
            </label>
            <div className="gc-radio-hint">{t("form.reasonRecoveryHint")}</div>

            <label className="gc-radio">
              <input
                type="radio"
                id="reason-balance"
                name="question-reason"
                value="loan-balance-inquiry"
                checked={reason === "loan-balance-inquiry"}
                onChange={() => { setReason("loan-balance-inquiry"); setReasonError(""); }}
              />
              {t("form.reasonBalance")}
            </label>
            <div className="gc-radio-hint">{t("form.reasonBalanceHint")}</div>

            <label className="gc-radio">
              <input
                type="radio"
                id="reason-change"
                name="question-reason"
                value="change-in-business-details"
                checked={reason === "change-in-business-details"}
                onChange={() => { setReason("change-in-business-details"); setReasonError(""); }}
              />
              {t("form.reasonChange")}
            </label>
            <div className="gc-radio-hint">{t("form.reasonChangeHint")}</div>

            <label className="gc-radio">
              <input
                type="radio"
                id="reason-payments"
                name="question-reason"
                value="payments-and-collections"
                checked={reason === "payments-and-collections"}
                onChange={() => { setReason("payments-and-collections"); setReasonError(""); }}
              />
              {t("form.reasonPayments")}
            </label>
            <div className="gc-radio-hint">{t("form.reasonPaymentsHint")}</div>

            <label className="gc-radio">
              <input
                type="radio"
                id="reason-other"
                name="question-reason"
                value="other"
                checked={reason === "other"}
                onChange={() => { setReason("other"); setReasonError(""); }}
              />
              {t("form.reasonOther")}
            </label>
            <div className="gc-radio-hint">{t("form.reasonOtherHint")}</div>
          </fieldset>
        </div>
        <br></br>

        {(reason === "ceba-id-recovery" || reason === "other") && (
          <div>
            <label htmlFor="question-business-number" className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.businessNumber")} <span className="required-text">{t("form.required")}</span>
            </label>
            <div>{t("form.businessNumberHint")}</div>
            <ErrorBanner message={businessNumberError} />
            <input
              id="question-business-number"
              name="question-business-number"
              type="text"
              maxLength="9"
              inputMode="numeric"
              className={`gc-text-field ${businessNumberError ? "gc-text-field--error" : ""}`}
              value={businessNumber}
              ref={businessNumberRef}
              onChange={e => setBusinessNumber(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={() =>
            handleBlur(businessNumber, setBusinessNumberError, t("form.error-isRequired"))
          }
        />
          </div>
        )}

        {reason && reason !== "ceba-id-recovery" && reason !== "other" && (
          <div>
            <label htmlFor="question-ceba-id" className="gc-label">
              <span className="required-asterisk" aria-hidden="true">*</span> {t("form.cebaId")} <span className="required-text">{t("form.required")}</span>
            </label>
            <div>{t("form.cebaIdHint")}</div>
            <ErrorBanner message={cebaIDError} />
            <input
              id="question-ceba-id"
              name="question-ceba-id"
              type="text"
              maxLength="12"
              inputMode="numeric"
              className={`gc-text-field ${cebaIDError ? "gc-text-field--error" : ""}`}
              value={cebaID}
              ref={cebaIDRef}
              onChange={e => setCebaID(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={() =>
            handleBlur(cebaID, setCebaIDError, t("form.error-isRequired"))
          }
        />
          </div>
        )}

        <div>
          <label htmlFor="question-message" className="gc-label">
            <span className="required-asterisk" aria-hidden="true">*</span> {t("form.message")} <span className="required-text">{t("form.required")}</span>
          </label>
          <div>{t("form.messageHint")}</div>
          <ErrorBanner message={messageError} />
          <textarea
          id="question-message"
          name="question-message"
          type="text"
          maxLength="1500"
          className={`gc-text-box ${messageError ? "gc-text-field--error" : ""}`}
          value={message}
          ref={messageRef}
          onChange={e => setMessage(e.target.value)}
          onBlur={() =>
            handleBlur(message, setMessageError, t("form.error-isRequired"))
          }
        />
        </div>

        <gcds-heading tag="h4" level="4">{t("form.PICS-heading")}</gcds-heading>
        <p>{t("form.PICS-body.line1")}</p>
        <p>
          {t("form.PICS-body.line2")}{" "}
          <a href={t("form.PICS-body.hyperlink-url")}>
            {t("form.PICS-body.hyperlink-text")}
          </a>
          {t("form.PICS-body.line3")}
        </p>
        <br></br>
        <p>{t("form.PICS-body.line4")}</p>
        <br></br>
        <p>{t("form.PICS-body.line5")}</p>
        <p>
          {t("form.PICS-body.contact-telephone")}
          <br></br>
          <br></br>
          {t("form.PICS-body.contact-mail")}
          <br></br>
          <i>The CEBA Program</i>
          <br></br>
          150 Slater Street
          <br></br>
          Ottawa, ON  K1A 1K3
          <br></br>
          <br></br>
        </p>


      {recaptchaConfig.hasRecaptcha && recaptchaConfig.loaded && (
        <div ref={captchaContainerRef}>
          <ReCAPTCHA
            sitekey={recaptchaConfig.siteKey}
            onChange={handleCaptchaChange}
          />
        </div>
      )}
      <br></br>
      <br></br>
      <gcds-button
        type='button'
        onClick={async () => {
          // Validate and scroll to first error if any
          const firstErrorRef = validateAndGetFirstErrorRef();
          if (firstErrorRef) {
            scrollToRef(firstErrorRef);
            return;
          }

          if (recaptchaConfig.hasRecaptcha && !captchaVerified) {
            scrollToRef(captchaContainerRef);
            return;
          }

          setEmailFailed(false);
          setEmailSent(false);
          setEmailSending(true);
          try {
            const payload = {
              firstName,
              lastName,
              businessName,
              contactBy: contactMethod,
              emailAddress: email,
              telephoneNumber: telephone,
              preferCallCentreContactBy: contactTime,
              reasonForContactingUs: reason,
              businessNumber,
              cebaId: cebaID,
              message,
              recaptchaToken,
            };

            const res = await fetch('/api/email/send-webform', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });

            if (!res.ok) {
              const text = await res.text();
              throw new Error(text || 'Request failed');
            }

            setEmailSent(true);
            setEmailFailed(false);
          } catch (e) {
            setEmailSent(false);
            setEmailFailed(true);
          } finally {
            setEmailSending(false);
          }
        }}
        disabled={disableEmailButton}
      >
        {t("form.submit")}
      </gcds-button>
      </div>
      {emailSent && (
        <div className="gc-mail-success-banner" role="status">
          {t('form.mailSuccess')}
        </div>
      )}
      {emailFailed && !emailSent && (
        <MailFailBanner />
      )}
      <br></br>
      <div>{t("form.date-modified")}</div>
      <br></br>
      </>
      )}
    </gcds-container>
    </div>
    <gcds-footer
      class="gcds-mt-2"
      display="compact"
      sub-links={JSON.stringify({
        [t("form.footer-allContacts-label")]: t("form.footer-allContacts-link"),
        [t("form.footer-terms-label")]: t("form.footer-terms-link"),
        [t("form.footer-privacy-label")]: t("form.footer-privacy-link"),
      })}
    >
    </gcds-footer>

    </div>
  );
}


export default App;
