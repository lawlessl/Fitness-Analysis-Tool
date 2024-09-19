import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthRoute from './AuthRoute.tsx';
import UploadFitFileBox from './components/Layout/UploadBox.tsx';
import './index.css';
import AnalysisPage from './pages/ActivityDetailPage.tsx';
import ActivityListPage from './pages/ActivityList.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import UserProfile from './pages/UserProfile.tsx';

const colors = {
	brand: {
		primary: '#2589fb',
		primaryVariant: '#28536B',
		secondary: '#A188A6',
		secondaryVariant: '#8B687F',
		background: '#F2F2F2',
	},
};

const theme = extendTheme({ colors });

const root = createRoot(document.getElementById('root')!);

root.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<Router>
				<Routes>
					<Route
						path="/"
						element={
							<AuthRoute>
								<Dashboard />
							</AuthRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Signup />} />
					<Route path="/user" element={<UserProfile />} />
					<Route path="/upload" element={<UploadFitFileBox />} />
					<Route path="/activities" element={<ActivityListPage />} />
					<Route path="/activity/:activityId" element={<AnalysisPage />} />
					<Route path="*" element={<Navigate to="/" />} />
				</Routes>
			</Router>
		</ChakraProvider>
	</React.StrictMode>
);
