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
  const isOverviewPage = pageType === "overview";
  const isContactInfoPage = pageType === "contact-info";
  const isContactNavActive = pageType === "contact-form" || isContactInfoPage;
  const isBlankShellPage = isOverviewPage;
  const blankPageHeadingKey = getBlankPageHeadingKey(pageType);
  const blankPageBreadcrumbItems = getBlankPageBreadcrumbItems(pageType, t);
  const faqPageTitle = t("form.faq.pageTitle");
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

  // Load application configuration from backend at runtime
  useEffect(() => {
    const loadAppConfig = async () => {
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
      onClick={() => i18n.changeLanguage(i18n.language === "en" ? "fr" : "en")}
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
              className={`nav-link ${isOverviewPage ? "active" : ""}`}
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
        <div className="breadcrumbs-wrap">
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
        <div className="faq-page">
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
        </div>
        </>
        )}
        {isBlankShellPage && blankPageHeadingKey && (
        <>
        <div className="breadcrumbs-wrap">
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
        <br></br>
        <br></br>
        <gcds-notice type="warning" notice-title-tag="h2" notice-title={t("form.notice-title")}>
          <gcds-text>{t("form.notice-message1")}</gcds-text>
          <gcds-text>{t("form.notice-message2")}</gcds-text>
        </gcds-notice>
        <br></br>
        <gcds-heading tag="h1" level="1">{t(blankPageHeadingKey)}</gcds-heading>
        </>
        )}
        {isContactInfoPage && (
        <>
        <div className="breadcrumbs-wrap">
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
        <div className="contact-info-page">
          <gcds-heading tag="h1" level="1">{t("form.contact-info-title")}</gcds-heading>
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
        {!isBlankShellPage && !isFaqPage && !isContactInfoPage && (
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
