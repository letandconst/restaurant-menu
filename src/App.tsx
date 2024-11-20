import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginForm, RegistrationForm, Dashboard, Items, Categories, ForgotPassword } from './screens';

import { AuthRedirect, ProtectedRoute } from './utils';
import Layout from './layout/Layout';

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
						<Route
							path='/forgot-password'
							element={<ForgotPassword />}
						/>
					</Route>
					<Route element={<ProtectedRoute />}>
						<Route
							path='/*'
							element={<Layout />}
						>
							<Route
								index
								element={<Dashboard />}
							/>
							<Route
								path='items'
								element={<Items />}
							/>
							<Route
								path='categories'
								element={<Categories />}
							/>
						</Route>
					</Route>
				</Routes>
			</Router>
		</>
	);
}

export default App;
