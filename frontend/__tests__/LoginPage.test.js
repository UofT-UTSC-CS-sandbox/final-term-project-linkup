import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '..src/pages/Login.js';

test('Login Page Component', () => {
    it('should display the phrase "Swipe. Match. Network."', () => {
        render(<LoginPage />);
        const phraseElement = screen.getByText(/Swipe\. Match\. Network\./i);
        expect(phraseElement).toBeInTheDocument();
      });
});