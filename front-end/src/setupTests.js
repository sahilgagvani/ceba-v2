// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const fetchMock = jest.fn(
  () =>
    new Promise(() => {
      // Keep runtime config fetch pending in tests to avoid noisy async state updates.
    })
);

global.fetch = fetchMock;

if (typeof window !== 'undefined') {
  window.fetch = fetchMock;
}

afterEach(() => {
  fetchMock.mockClear();
});
