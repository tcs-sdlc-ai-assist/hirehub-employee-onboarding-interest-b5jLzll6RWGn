import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from './AdminDashboard';
import * as storage from '../utils/storage';
import * as adminAuth from '../utils/adminAuth';

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  updateSubmission: vi.fn(),
  deleteSubmission: vi.fn(),
}));

vi.mock('../utils/adminAuth', () => ({
  logout: vi.fn(),
}));

const mockSubmissions = [
  {
    id: 'uuid-1',
    fullName: 'John Doe',
    email: 'john@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedAt: '2024-03-15T10:00:00.000Z',
  },
  {
    id: 'uuid-2',
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    mobile: '9876543210',
    department: 'Design',
    submittedAt: '2024-03-16T12:00:00.000Z',
  },
  {
    id: 'uuid-3',
    fullName: 'Bob Wilson',
    email: 'bob@example.com',
    mobile: '5551234567',
    department: 'Engineering',
    submittedAt: '2024-03-17T08:00:00.000Z',
  },
];

function renderDashboard(props = {}) {
  return render(<AdminDashboard {...props} />);
}

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.getSubmissions.mockReturnValue([...mockSubmissions]);
  });

  it('renders dashboard header with title and logout button', () => {
    renderDashboard();

    expect(screen.getByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('displays stat cards with correct counts', () => {
    renderDashboard();

    expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Departments')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Latest Submission')).toBeInTheDocument();
  });

  it('renders submission table with data', () => {
    renderDashboard();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Wilson')).toBeInTheDocument();
    expect(screen.getByText('5551234567')).toBeInTheDocument();
  });

  it('calls logout and onLogout when logout button is clicked', async () => {
    const user = userEvent.setup();
    const onLogout = vi.fn();
    renderDashboard({ onLogout });

    const logoutButton = screen.getByRole('button', { name: 'Logout' });
    await user.click(logoutButton);

    expect(adminAuth.logout).toHaveBeenCalledTimes(1);
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('edit action opens modal', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    expect(screen.getByRole('heading', { name: 'Edit Submission' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });

  it('edit modal closes when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderDashboard();

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    expect(screen.getByRole('heading', { name: 'Edit Submission' })).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(screen.queryByRole('heading', { name: 'Edit Submission' })).not.toBeInTheDocument();
  });

  it('edit modal saves changes and refreshes data', async () => {
    const user = userEvent.setup();
    storage.updateSubmission.mockImplementation(() => {});

    const updatedSubmissions = mockSubmissions.map((s) =>
      s.id === 'uuid-1' ? { ...s, fullName: 'John Updated' } : s
    );

    storage.getSubmissions
      .mockReturnValueOnce([...mockSubmissions])
      .mockReturnValueOnce(updatedSubmissions);

    renderDashboard();

    const editButtons = screen.getAllByRole('button', { name: 'Edit' });
    await user.click(editButtons[0]);

    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Updated');

    const saveButton = screen.getByRole('button', { name: 'Save Changes' });
    await user.click(saveButton);

    expect(storage.updateSubmission).toHaveBeenCalledTimes(1);
    expect(storage.updateSubmission).toHaveBeenCalledWith('uuid-1', {
      fullName: 'John Updated',
      mobile: '1234567890',
      department: 'Engineering',
    });

    expect(screen.queryByRole('heading', { name: 'Edit Submission' })).not.toBeInTheDocument();
  });

  it('delete action shows confirmation and removes entry', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    storage.deleteSubmission.mockReturnValue(true);

    const afterDeleteSubmissions = mockSubmissions.filter((s) => s.id !== 'uuid-2');
    storage.getSubmissions
      .mockReturnValueOnce([...mockSubmissions])
      .mockReturnValueOnce(afterDeleteSubmissions);

    renderDashboard();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[1]);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this submission?');
    expect(storage.deleteSubmission).toHaveBeenCalledWith('uuid-2');

    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('delete action does not remove entry when confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    renderDashboard();

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' });
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this submission?');
    expect(storage.deleteSubmission).not.toHaveBeenCalled();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    confirmSpy.mockRestore();
  });

  it('empty state shows no submissions message', () => {
    storage.getSubmissions.mockReturnValue([]);
    renderDashboard();

    expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays correct stat values when there are no submissions', () => {
    storage.getSubmissions.mockReturnValue([]);
    renderDashboard();

    const statCards = document.querySelectorAll('.stat-card');
    expect(statCards.length).toBeGreaterThanOrEqual(3);

    expect(screen.getByText('N/A')).toBeInTheDocument();
  });
});