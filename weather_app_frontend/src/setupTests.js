/**
 * Test setup for Jest + React Testing Library
 * - Adds jest-dom matchers
 * - Mocks global fetch to prevent real network calls by default
 * - Provides stable localStorage mock for audit trail tests
 * - Ensures process.env overrides do not bleed across tests
 */
import '@testing-library/jest-dom';

// Default fetch mock: no real network requests in tests.
// Individual tests can override window.fetch for specific scenarios.
beforeAll(() => {
  const fetchMock = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          name: 'Mock City',
          sys: { country: 'MC' },
          main: { temp: 20, humidity: 50 },
          weather: [{ main: 'Clear', icon: '01d' }],
          wind: { speed: 3 },
        }),
    })
  );
  // Only set if not already mocked by a test.
  if (!global.fetch) {
    global.fetch = fetchMock;
  }
});

// Stable localStorage mock to isolate audit tests
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}
beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: new LocalStorageMock(),
    writable: true,
  });
});

// Ensure env changes are isolated test-by-test
const ORIGINAL_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});
afterAll(() => {
  process.env = ORIGINAL_ENV;
});
