import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App';

test('renders learn react link', () => {
  // The default test looks for a "learn react" link which doesn't exist in your app.
  // This is a placeholder test. It's better to remove it or write a meaningful test.
  // For now, we will just ensure the app renders without crashing.
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Example of a better test:
  // const welcomeMessage = screen.getByText(/Welcome to SimpleNotes/i);
  // expect(welcomeMessage).toBeInTheDocument();
});
