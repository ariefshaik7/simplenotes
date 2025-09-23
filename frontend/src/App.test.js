import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  // This test ensures that the main App component renders without any errors.
  // Since the App component itself contains the Router, we don't need to wrap it here.
  render(<App />);

  // As a follow-up, you could expand this test to find a specific element
  // that should be visible on the login page by default.
});