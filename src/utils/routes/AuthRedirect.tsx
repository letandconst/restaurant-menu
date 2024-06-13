import { Navigate, Outlet } from 'react-router-dom';

const AuthRedirect = () => {
	const isAuthenticated = localStorage.getItem('uid');

	if (isAuthenticated) {
		return (
			<Navigate
				to='/'
				replace
			/>
		);
	}

	return <Outlet />;
};

export default AuthRedirect;
