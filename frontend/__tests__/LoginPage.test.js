import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
import {BrowserRouter} from 'react-router-dom';

import Login from '../src/pages/Login.js';

// Mock the createStore function
jest.mock('react-auth-kit/createStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getState: jest.fn(),
    dispatch: jest.fn(),
  })),
}));

// Render the AuthProvider with the mocked store
const mockStore = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
});

jest.mock('react-auth-kit/hooks/useSignIn', () => ({
  __esModule: true,
  default: jest.fn(() => jest.fn()), // Mock the useSignIn hook
}));

jest.mock('react-auth-kit/hooks/useIsAuthenticated', () => ({
  __esModule: true,
  default: jest.fn(() => true), // Mock the useIsAuthenticated hook
}));

jest.mock('../src/pages/UserContext', () => ({
  useUser: () => ({
    updateUserData: jest.fn(),
  }),
}));

test('Login Page Component', () => {
  render(
    <AuthProvider store={mockStore}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );
  const phraseElement = screen.getByText(/Swipe\. Match\. Network\./i);
  expect(phraseElement).toBeInTheDocument();
});
