import '@testing-library/jest-dom/vitest';

// Polyfill ResizeObserver for Recharts in JSDOM
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!global.ResizeObserver) {
  global.ResizeObserver = RO;
}
