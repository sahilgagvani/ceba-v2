import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import i18n from './i18n';
import App from './App';

jest.mock('react-google-recaptcha', () => () => null);

describe('App page rendering', () => {
  afterEach(async () => {
    window.history.pushState({}, '', '/');
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  test('renders the contact form on the default page', () => {
    render(<App />);

    expect(screen.getByText(/tell us about yourself/i)).toBeInTheDocument();
  });

  test('changes only the top navigation contact information link', () => {
    const { container } = render(<App />);

    const topNavContactLink = container.querySelector('.custom-top-nav .nav-link.active');
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');

    expect(topNavContactLink).toHaveTextContent(/contact information/i);
    expect(topNavContactLink).toHaveAttribute('href', '/en/contact.html');
    expect(breadcrumbLinks[1]).toHaveTextContent(/contact information/i);
    expect(breadcrumbLinks[1]).toHaveAttribute(
      'href',
      'https://ceba-cuec.ca/en/contact.html'
    );
  });

  test('renders faq content at /en/faq.html', () => {
    window.history.pushState({}, '', '/en/faq.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');
    const faqHeadings = container.querySelectorAll('.faq-page gcds-heading');
    const faqSectionHeadings = container.querySelectorAll('.faq-section-title gcds-heading');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(faqHeadings[0]).toHaveTextContent(/^Frequently Asked Questions$/i);
    expect(
      screen.getByText(/My Loan Has Been Assigned to the CEBA Program/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/My Loan Is With My Financial Institution/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^FAQ Archive$/i)).toBeInTheDocument();
    expect(screen.getByText(/Loan Assignment/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Loan Repayment/i)).toHaveLength(2);
    expect(screen.getByText(/Statements of Account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^loan assignment$/i })).toHaveAttribute(
      'href',
      '/en/faq/ceba-loan-assignment.html'
    );
    expect(screen.getAllByRole('link', { name: /^loan repayment$/i })[0]).toHaveAttribute(
      'href',
      '/en/faq/ceba-loan-repayment.html'
    );
    expect(screen.getByRole('link', { name: /^sign in$/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier'
    );
    expect(screen.getByText(/^Date modified: 2026-01-21$/i)).toBeInTheDocument();
    expect(faqSectionHeadings).toHaveLength(3);
    faqSectionHeadings.forEach((heading) => {
      expect(heading).toHaveAttribute('character-limit', 'false');
    });
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(breadcrumbLinks[1]).toHaveTextContent(/^faq$/i);
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/en/faq.html');
    expect(container.querySelector('gcds-container#main-content')).toBeInTheDocument();
    expect(container.querySelector('main.faq-detail-main#main-content')).not.toBeInTheDocument();
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/^faq$/i);
  });

  test('renders faq content at /fr/faq.html', async () => {
    window.history.pushState({}, '', '/fr/faq.html');
    await i18n.changeLanguage('fr');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');
    const faqHeadings = container.querySelectorAll('.faq-page gcds-heading');
    const faqSectionHeadings = container.querySelectorAll('.faq-section-title gcds-heading');

    expect(screen.queryByText(/formulaire de contact/i)).not.toBeInTheDocument();
    expect(faqHeadings[0]).toHaveTextContent(/^Foires aux questions$/i);
    expect(
      screen.getByText(/Mon prêt a été cédé au programme du CUEC/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Mon prêt est auprès de mon institution financière/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/^Foires aux questions - Archive$/i)).toBeInTheDocument();
    expect(screen.getByText(/Cession de prêt/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Remboursement du prêt/i)).toHaveLength(2);
    expect(screen.getByText(/Admissibilité \(fermé\)/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^cession de prêt$/i })).toHaveAttribute(
      'href',
      '/fr/faq/cession-de-pret-cuec.html'
    );
    expect(screen.getAllByRole('link', { name: /^remboursement du prêt$/i })[0]).toHaveAttribute(
      'href',
      '/fr/faq/remboursement-du-pret-cuec.html'
    );
    expect(screen.getByRole('link', { name: /se connecter/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier/fr'
    );
    expect(
      screen.getByText(/^Date de modification : 2026-01-21$/i)
    ).toBeInTheDocument();
    expect(faqSectionHeadings).toHaveLength(3);
    faqSectionHeadings.forEach((heading) => {
      expect(heading).toHaveAttribute('character-limit', 'false');
    });
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0]).toHaveTextContent(/survol du programme du cuec/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/fr/survol.html');
    expect(breadcrumbLinks[1]).toHaveTextContent(/foires aux questions/i);
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/fr/faq.html');
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/foires aux questions/i);
  });

  test('renders faq detail scaffold at /en/faq/ceba-loan-assignment.html', () => {
    window.history.pushState({}, '', '/en/faq/ceba-loan-assignment.html');

    const { container } = render(<App />);
    const breadcrumbItems = container.querySelectorAll('.faq-detail-breadcrumbs .gc-breadcrumbs li');
    const detailButtons = container.querySelectorAll('.faq-detail-nav-grid .faq-detail-tab');
    const detailHeading = container.querySelector('.faq-detail-title gcds-heading');

    expect(screen.queryByText(/^Frequently Asked Questions$/i)).not.toBeInTheDocument();
    expect(detailHeading).toHaveTextContent(
      /^Loan Assigned to CEBA Program — Loan Assignment$/i
    );
    expect(screen.getByText(/What does "loan assignment" mean\?/i)).toBeInTheDocument();
    expect(screen.getByText(/^Date modified: 2026-01-21$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^sign in$/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier'
    );
    expect(container.querySelector('main.faq-detail-main#main-content')).toBeInTheDocument();
    expect(container.querySelector('gcds-container#main-content')).not.toBeInTheDocument();
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbItems[1]).toHaveTextContent(/^faq$/i);
    expect(breadcrumbItems[2]).toHaveTextContent(/ceba loan assignment/i);
    expect(detailButtons).toHaveLength(6);
    expect(detailButtons[0]).toHaveClass('faq-detail-tab-active');
    expect(detailButtons[0]).toHaveAttribute('href', '/en/faq/ceba-loan-assignment.html');
    expect(detailButtons[1]).not.toHaveClass('faq-detail-tab-active');
    expect(detailButtons[5]).toHaveAttribute('href', '/en/faq/statements-of-account.html');
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/^faq$/i);
  });

  test('renders english loan repayment faq detail content', () => {
    window.history.pushState({}, '', '/en/faq/ceba-loan-repayment.html');

    const { container } = render(<App />);
    const detailButtons = container.querySelectorAll('.faq-detail-nav-grid .faq-detail-tab');
    const detailHeading = container.querySelector('.faq-detail-title gcds-heading');

    expect(detailHeading).toHaveTextContent(
      /^Loan Assigned to CEBA Program — Loan Repayment$/i
    );
    expect(
      screen.getByText(/How do I repay my loan\? What are the payment methods\?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Export Development Canada - CEBA/i)).toBeInTheDocument();
    expect(screen.getByText(/PO Box 4530 STN A/i)).toBeInTheDocument();
    expect(
      screen.getByText(/How are payments applied to my assigned CEBA Loan\?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Payment Reminder/i)).toBeInTheDocument();
    expect(screen.getByText(/Missed Payment Reminder/i)).toBeInTheDocument();
    expect(screen.getByText(/^Date modified: 2026-01-21$/i)).toBeInTheDocument();
    expect(container.querySelector('main.faq-detail-main#main-content')).toBeInTheDocument();
    expect(container.querySelector('gcds-container#main-content')).not.toBeInTheDocument();
    expect(detailButtons[1]).toHaveClass('faq-detail-tab-active');
    expect(detailButtons[1]).toHaveAttribute('href', '/en/faq/ceba-loan-repayment.html');
  });

  test('renders faq detail scaffold at /fr/faq/remboursement-du-pret-cuec.html', async () => {
    window.history.pushState({}, '', '/fr/faq/remboursement-du-pret-cuec.html');
    await act(async () => {
      await i18n.changeLanguage('fr');
    });

    const { container } = render(<App />);
    const breadcrumbItems = container.querySelectorAll('.faq-detail-breadcrumbs .gc-breadcrumbs li');
    const detailButtons = container.querySelectorAll('.faq-detail-nav-grid .faq-detail-tab');
    const detailHeading = container.querySelector('.faq-detail-title gcds-heading');

    expect(detailHeading).toHaveTextContent(
      /^Prêt avec le programme du CUEC — Remboursement du prêt$/i
    );
    expect(
      screen.getByText(/Comment puis-je rembourser mon prêt \? Quels sont les modes de paiement \?/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Boîte postale 4530, succursale A/i)).toBeInTheDocument();
    expect(screen.getByText(/rappel de paiement à venir/i)).toBeInTheDocument();
    expect(screen.getByText(/rappel de paiement en défaut/i)).toBeInTheDocument();
    expect(screen.getByText(/^Date de modification : 2026-01-21$/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /se connecter/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier/fr'
    );
    expect(container.querySelector('main.faq-detail-main#main-content')).toBeInTheDocument();
    expect(container.querySelector('gcds-container#main-content')).not.toBeInTheDocument();
    expect(breadcrumbItems).toHaveLength(3);
    expect(breadcrumbItems[0]).toHaveTextContent(/survol du programme du cuec/i);
    expect(breadcrumbItems[1]).toHaveTextContent(/foires aux questions/i);
    expect(breadcrumbItems[2]).toHaveTextContent(/remboursement du prêt du cuec/i);
    expect(detailButtons).toHaveLength(6);
    expect(detailButtons[1]).toHaveClass('faq-detail-tab-active');
    expect(detailButtons[1]).toHaveAttribute('href', '/fr/faq/remboursement-du-pret-cuec.html');
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/foires aux questions/i);
  });

  test('renders overview content at /en/overview.html', () => {
    window.history.pushState({}, '', '/en/overview.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');
    const overviewHeading = container.querySelector('.overview-page gcds-heading');
    const overviewSectionHeadings = container.querySelectorAll('.overview-section-heading');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(overviewHeading).toHaveTextContent(/^Canada Emergency Business Account \(CEBA\)$/i);
    expect(
      screen.getByText(/important information for loan holders on repayment/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /sign-in \(if your loan has been assigned to the ceba program\)/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /sign in or register for ceba portal account/i,
      })
    ).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier'
    );
    expect(overviewSectionHeadings[0]).toHaveTextContent(/^Program Overview$/i);
    expect(screen.getByText(/^Notable Loan Terms$/i, { selector: 'h3' })).toBeInTheDocument();
    expect(overviewSectionHeadings[1]).toHaveTextContent(/^Final Program Statistics:/i);
    expect(screen.getByText('898,271')).toBeInTheDocument();
    expect(screen.getByText('571,851')).toBeInTheDocument();
    expect(screen.getByText('$49.2 Billion')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /click here for regional statistics/i })
    ).toHaveAttribute('href', '/en/statistics.html');
    expect(screen.getByText(/^Date modified: 2026-02-17$/i)).toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(1);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(overviewHeading).toHaveAttribute('character-limit', 'false');
    expect(screen.getByRole('link', { name: /^sign in$/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier'
    );
  });

  test('renders overview content at /fr/survol.html', async () => {
    window.history.pushState({}, '', '/fr/survol.html');
    await act(async () => {
      await i18n.changeLanguage('fr');
    });

    const { container } = render(<App />);
    const overviewHeading = container.querySelector('.overview-page gcds-heading');
    const overviewSectionHeadings = container.querySelectorAll('.overview-section-heading');

    expect(overviewHeading).toHaveTextContent(
      /^Compte d’urgence pour les entreprises canadiennes \(CUEC\)$/i
    );
    expect(
      screen.getByText(/mise-à-jour importante au sujet du remboursement/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /se connecter \(si votre prêt a été cédé au programme du cuec\)/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: /se connecter ou s’inscrire à un compte du portail du cuec/i,
      })
    ).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier/fr'
    );
    expect(overviewSectionHeadings[0]).toHaveTextContent(/^Survol du Programme$/i);
    expect(screen.getByText(/^Modalités de prêt notables$/i, { selector: 'h3' })).toBeInTheDocument();
    expect(overviewSectionHeadings[1]).toHaveTextContent(/^Statistiques finales du programme :$/i);
    expect(screen.getByText('898,271')).toBeInTheDocument();
    expect(screen.getByText('571,851')).toBeInTheDocument();
    expect(screen.getByText('49,2 milliards $')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /cliquez ici pour les statistiques régionales/i })
    ).toHaveAttribute('href', '/fr/statistiques.html');
    expect(screen.getByText(/^Date de modification : 2026-02-17$/i)).toBeInTheDocument();
  });

  test('renders regional statistics content at /en/statistics.html', () => {
    window.history.pushState({}, '', '/en/statistics.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');

    expect(screen.getByRole('heading', { level: 1, name: /ceba regional statistics/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /funds approved by province or territory/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /map of canada showing the share of ceba funds/i })).toHaveAttribute(
      'src',
      '/img/statistics-map-en.svg'
    );
    expect(screen.getByText(/ceba summary data as of january 26, 2022/i)).toBeInTheDocument();
    expect(screen.getByText(/existing ceba loan/i)).toBeInTheDocument();
    expect(screen.getByText(/^Date modified: 2026-03-13$/i)).toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/en/statistics.html');
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/^program overview$/i);
  });

  test('changes statistics language toggle path from english to french', async () => {
    window.history.pushState({}, '', '/en/statistics.html');

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Français' }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/fr/statistiques.html');
    });

    expect(
      screen.getByRole('heading', { level: 1, name: /statistiques régionales sur le cuec/i })
    ).toBeInTheDocument();
  });

  test('changes faq detail language toggle path from english to french', async () => {
    window.history.pushState({}, '', '/en/faq/ceba-loan-assignment.html');

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Français' }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/fr/faq/cession-de-pret-cuec.html');
    });

    expect(
      await screen.findByText(/^Prêt cédé au programme du CUEC — Cession de prêt$/i)
    ).toBeInTheDocument();
  });

  test('renders the overview warning as a notice replica', () => {
    window.history.pushState({}, '', '/en/overview.html');

    const { container } = render(<App />);
    const warning = container.querySelector('.overview-warning');

    expect(warning).toHaveAttribute(
      'aria-label',
      'Important Information for Loan Holders on Repayment'
    );
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: /important information for loan holders on repayment/i,
      })
    ).toBeInTheDocument();
    expect(container.querySelector('.overview-warning-icon')).toBeInTheDocument();
    expect(container.querySelectorAll('.overview-warning-body p')).toHaveLength(2);
  });

  test('changes overview language toggle path from english to french', async () => {
    window.history.pushState({}, '', '/en/overview.html');

    const { container } = render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'Français' }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/fr/survol.html');
    });

    expect(container.querySelector('.overview-page gcds-heading')).toHaveTextContent(
      /^Compte d’urgence pour les entreprises canadiennes \(CUEC\)$/i
    );
  });

  test('renders contact information body content at /en/contact.html', () => {
    window.history.pushState({}, '', '/en/contact.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');
    const contactHeading = container.querySelector('.contact-info-page gcds-heading');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(breadcrumbLinks[1]).toHaveTextContent(/contact information/i);
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/en/contact.html');
    expect(container.querySelector('gcds-heading')).toHaveTextContent(
      /contact information/i
    );
    expect(contactHeading).toHaveAttribute('character-limit', 'false');
    expect(screen.getByText(/there are three contact centres/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /ceba call centre/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cra ceba contact centre/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /financial institution/i })).toBeInTheDocument();
    expect(screen.getByText(/ceba portal/i)).toBeInTheDocument();
    expect(screen.getByText(/create or modify payment arrangements/i)).toBeInTheDocument();
    expect(screen.getByText(/loan details & balance\(s\)/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /online form/i })).toHaveAttribute(
      'href',
      'https://contact.ceba-cuec.ca/en'
    );
    expect(screen.getByRole('link', { name: /^sign in$/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier'
    );
    expect(screen.getByText(/date modified: 2026-01-21/i)).toBeInTheDocument();
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/contact information/i);
  });

  test('renders contact information body content at /fr/coordonnees.html', async () => {
    window.history.pushState({}, '', '/fr/coordonnees.html');
    await act(async () => {
      await i18n.changeLanguage('fr');
    });

    const { container } = render(<App />);

    expect(screen.queryByText(/formulaire de contact/i)).not.toBeInTheDocument();
    expect(container.querySelector('gcds-heading')).toHaveTextContent(/coordonnées/i);
    expect(screen.getByText(/il y a trois centres de contact/i)).toBeInTheDocument();
    expect(screen.getByText(/Le centre de contact approprié variera/i)).toBeInTheDocument();
    expect(screen.getByText(/veuillez suivre les conseils ci-dessous/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Centre d’appels du CUEC' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "Centre d'appels du CUEC de l’ARC" })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /institution financière/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Détails du prêt et solde\(s\)/i)).toHaveLength(2);
    expect(screen.getByText(/États de compte/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Vous pouvez téléphoner au Centre d’appels du CUEC de l’ARC au 1 800 361-2808\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Veuillez consulter l'institution financière qui a fourni votre prêt du CUEC\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /formulaire en ligne/i })).toHaveAttribute(
      'href',
      'https://contact.ceba-cuec.ca/fr'
    );
    expect(screen.getByRole('link', { name: /se connecter/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier/fr'
    );
    expect(screen.getByText(/2026-01-21/i)).toBeInTheDocument();
  });
});
