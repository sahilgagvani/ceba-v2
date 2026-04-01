import { render, screen } from '@testing-library/react';
import './i18n';
import App from './App';

describe('App page rendering', () => {
  afterEach(() => {
    window.history.pushState({}, '', '/');
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

  test('renders a blank faq page shell at /en/faq.html', () => {
    window.history.pushState({}, '', '/en/faq.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(screen.getByText(/frequently asked questions/i)).toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(breadcrumbLinks[1]).toHaveTextContent(/^faq$/i);
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/en/faq.html');
  });

  test('renders a blank overview page shell at /en/overview.html', () => {
    window.history.pushState({}, '', '/en/overview.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/canada emergency business account \(ceba\)/i)
    ).toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(1);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
  });

  test('renders a blank contact information shell at /en/contact.html', () => {
    window.history.pushState({}, '', '/en/contact.html');

    const { container } = render(<App />);
    const breadcrumbLinks = container.querySelectorAll('.gc-breadcrumbs a');

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(breadcrumbLinks).toHaveLength(2);
    expect(breadcrumbLinks[0]).toHaveTextContent(/ceba program overview/i);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/en/overview.html');
    expect(breadcrumbLinks[1]).toHaveTextContent(/contact information/i);
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/en/contact.html');
    expect(container.querySelector('gcds-heading')).toHaveTextContent(
      /contact information/i
    );
    expect(
      container.querySelector('.custom-top-nav .nav-link.active')
    ).toHaveTextContent(/contact information/i);
  });
});
