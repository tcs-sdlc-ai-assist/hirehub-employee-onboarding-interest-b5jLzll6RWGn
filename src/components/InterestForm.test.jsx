import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import InterestForm from './InterestForm';
import * as storage from '../utils/storage';

vi.mock('../utils/storage', () => ({
  addSubmission: vi.fn(),
  isEmailDuplicate: vi.fn(),
}));

function renderInterestForm() {
  return render(
    <BrowserRouter>
      <InterestForm />
    </BrowserRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storage.isEmailDuplicate.mockReturnValue(false);
    storage.addSubmission.mockImplementation((submission) => ({
      ...submission,
      id: 'test-uuid-123',
      submittedAt: new Date().toISOString(),
    }));
  });

  it('renders all form fields', () => {
    renderInterestForm();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Department of Interest')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('renders the form heading', () => {
    renderInterestForm();
    expect(screen.getByRole('heading', { name: 'Submit Your Interest' })).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    renderInterestForm();
    const backLink = screen.getByRole('link', { name: 'Back to Home' });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup();
    renderInterestForm();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Mobile number is required.')).toBeInTheDocument();
    expect(screen.getByText('Department is required.')).toBeInTheDocument();

    expect(storage.addSubmission).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    const user = userEvent.setup();
    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'invalidemail');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(storage.addSubmission).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid mobile number', async () => {
    const user = userEvent.setup();
    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '12345');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Mobile number must be exactly 10 digits.')).toBeInTheDocument();
    expect(storage.addSubmission).not.toHaveBeenCalled();
  });

  it('shows duplicate email error', async () => {
    const user = userEvent.setup();
    storage.isEmailDuplicate.mockReturnValue(true);

    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
    expect(storage.addSubmission).not.toHaveBeenCalled();
  });

  it('shows success banner on valid submission', async () => {
    const user = userEvent.setup();
    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Your interest has been submitted successfully!')).toBeInTheDocument();
    expect(storage.addSubmission).toHaveBeenCalledTimes(1);
    expect(storage.addSubmission).toHaveBeenCalledWith({
      fullName: 'John Doe',
      email: 'john@example.com',
      mobile: '1234567890',
      department: 'Engineering',
    });
  });

  it('form clears after successful submission', async () => {
    const user = userEvent.setup();
    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByLabelText('Full Name')).toHaveValue('');
    expect(screen.getByLabelText('Email Address')).toHaveValue('');
    expect(screen.getByLabelText('Mobile Number')).toHaveValue('');
    expect(screen.getByLabelText('Department of Interest')).toHaveValue('');
  });

  it('success banner auto-dismisses after timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Your interest has been submitted successfully!')).toBeInTheDocument();

    vi.advanceTimersByTime(4000);

    await waitFor(() => {
      expect(screen.queryByText('Your interest has been submitted successfully!')).not.toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  it('clears field-level error when user starts typing', async () => {
    const user = userEvent.setup();
    renderInterestForm();

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('Full name is required.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Full Name'), 'J');

    expect(screen.queryByText('Full name is required.')).not.toBeInTheDocument();
  });

  it('handles addSubmission throwing duplicate email error', async () => {
    const user = userEvent.setup();
    storage.isEmailDuplicate.mockReturnValue(false);
    storage.addSubmission.mockImplementation(() => {
      throw new Error('Duplicate email');
    });

    renderInterestForm();

    await user.type(screen.getByLabelText('Full Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com');
    await user.type(screen.getByLabelText('Mobile Number'), '1234567890');
    await user.selectOptions(screen.getByLabelText('Department of Interest'), 'Engineering');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('This email has already been submitted.')).toBeInTheDocument();
  });
});