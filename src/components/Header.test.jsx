import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import * as adminAuth from '../utils/adminAuth';

vi.mock('../utils/adminAuth', () => ({
  isAuthenticated: vi.fn(),
  logout: vi.fn(),
}));

function renderHeader() {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    adminAuth.isAuthenticated.mockReturnValue(false);
  });

  it('renders HireHub logo linking to /', () => {
    renderHeader();
    const brand = screen.getByText('HireHub');
    expect(brand).toBeInTheDocument();
    expect(brand.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders Home navigation link', () => {
    renderHeader();
    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders Apply navigation link', () => {
    renderHeader();
    const applyLink = screen.getByRole('link', { name: 'Apply' });
    expect(applyLink).toBeInTheDocument();
    expect(applyLink).toHaveAttribute('href', '/apply');
  });

  it('renders Admin navigation link', () => {
    renderHeader();
    const adminLink = screen.getByRole('link', { name: 'Admin' });
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute('href', '/admin');
  });

  it('shows Login link when not authenticated', () => {
    adminAuth.isAuthenticated.mockReturnValue(false);
    renderHeader();
    const loginLinks = screen.getAllByRole('link', { name: 'Login' });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    expect(loginLinks[0]).toHaveAttribute('href', '/admin');
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('shows Logout button when authenticated', () => {
    adminAuth.isAuthenticated.mockReturnValue(true);
    renderHeader();
    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('logout button clears auth and updates UI', async () => {
    const user = userEvent.setup();

    adminAuth.isAuthenticated.mockReturnValue(true);
    const { unmount } = renderHeader();

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();

    adminAuth.isAuthenticated.mockReturnValue(false);

    await user.click(logoutButton);

    expect(adminAuth.logout).toHaveBeenCalledTimes(1);

    unmount();

    adminAuth.isAuthenticated.mockReturnValue(false);
    renderHeader();

    const loginLinks = screen.getAllByRole('link', { name: 'Login' });
    expect(loginLinks.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });
});