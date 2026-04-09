const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password.',
  'Invalid email or password': 'Invalid email or password.',
  'Email and password are required': 'Enter both email and password.',
  'Too many login attempts. Please try again later.': 'Too many login attempts. Please wait 5 minutes and try again.',
  'Database connection error. Please try again later.': 'The server could not reach the database. Please try again shortly.',
};

export function getReadableAuthError(error?: string | null) {
  if (!error) {
    return 'Unable to sign in right now. Please try again.';
  }

  return AUTH_ERROR_MESSAGES[error] || 'Unable to sign in right now. Please try again.';
}

export function getReadableSignupError(error?: string | null) {
  if (!error) {
    return 'Unable to create the account right now. Please try again.';
  }

  if (error === 'Admin signup is disabled. Please sign in as an existing admin.') {
    return 'Admin creation is restricted. Sign in with an existing super-admin account first.';
  }

  if (error === 'An admin with this email already exists') {
    return 'An admin with this email already exists.';
  }

  if (error === 'Too many signup attempts. Please try again later.') {
    return 'Too many signup attempts. Please wait 5 minutes and try again.';
  }

  if (error === 'Database connection error. Please try again later.') {
    return 'The server could not reach the database. Please try again shortly.';
  }

  if (error === 'Invalid email format') {
    return 'Enter a valid email address.';
  }

  if (error === 'Password must be at least 6 characters long') {
    return 'Use a password with at least 6 characters.';
  }

  return 'Unable to create the account right now. Please try again.';
}
