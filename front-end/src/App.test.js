import { act, render, screen } from '@testing-library/react';
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

  test('renders a blank overview page shell at /en/overview.html', () => {
    window.history.pushState({}, '', '/en/overview.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');
    const overviewHeading = container.querySelector('.overview-page gcds-heading');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/canada emergency business account \(ceba\)/i)
    ).toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(1);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(overviewHeading).toHaveAttribute('character-limit', 'false');
    expect(screen.getByRole('link', { name: /^sign in$/i })).toHaveAttribute(
      'href',
      'https://account-compte.ceba-cuec.ca/borrower/account-compte/sign-in-identifier'
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
