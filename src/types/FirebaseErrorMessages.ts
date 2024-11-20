interface AuthError {
	code: string;
	message: string;
}

export const FirebaseErrorMessages = (error: AuthError): string => {
	switch (error.code) {
		case 'auth/weak-password':
			return 'The password is too weak.';
		case 'auth/email-already-in-use':
			return 'The email address is already taken';
		case 'auth/invalid-email':
			return 'The email address you entered is not valid.';
		case 'auth/invalid-credential':
			return 'Incorrect username or password.';
		default:
			return 'An error occurred. Please try again';
	}
};
