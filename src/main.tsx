import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import './index.css';

const theme = createTheme({
	typography: {
		fontFamily: 'Poppins, sans-serif',
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />

			<App />
		</ThemeProvider>
	</React.StrictMode>
);
