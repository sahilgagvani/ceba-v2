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

  test('renders a blank faq page shell at /en/faq.html', () => {
    window.history.pushState({}, '', '/en/faq.html');

    render(<App />);

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /faq/i })).toHaveAttribute(
      'href',
      '/en/faq.html'
    );
  });

  test('renders a blank overview page shell at /en/overview.html', () => {
    window.history.pushState({}, '', '/en/overview.html');

    render(<App />);

    expect(screen.queryByText(/contact form/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /program overview/i })
    ).toHaveAttribute('href', '/en/overview.html');
  });
});
