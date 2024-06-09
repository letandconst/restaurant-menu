import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
	const auth = getAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOut(auth);
			console.log('clicked signout');
			localStorage.removeItem('uid');
			navigate('/signin');
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<>
			<div>Dashboard</div>
			<button onClick={() => handleSignOut()}>Sign Out </button>
		</>
	);
};

export default Dashboard;
