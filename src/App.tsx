import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthRedirect, ProtectedRoute } from './utils';
import { LoginForm, RegistrationForm, Dashboard } from './screens';

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route element={<AuthRedirect />}>
						<Route
							path='/signup'
							element={<RegistrationForm />}
						/>
						<Route
							path='/signin'
							element={<LoginForm />}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path='/'
							element={<Dashboard />}
						/>
					</Route>
				</Routes>
			</Router>
		</>
	);
}

export default App;
