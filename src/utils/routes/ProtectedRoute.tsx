import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
	const isAuthenticated = localStorage.getItem('uid');

	if (!isAuthenticated) {
		return (
			<Navigate
				to='/signin'
				replace
			/>
		);
	}

	return <Outlet />;
};

export default ProtectedRoute;
