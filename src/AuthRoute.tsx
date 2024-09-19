import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface IAuthRouteProps {
	children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
	const { children } = props;
	const auth = getAuth();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setLoading(false);
			} else {
				console.log('unauthorized');
				setLoading(false);
				navigate('/Login');
			}
		});
		return () => unsubscribe();
	}, [auth, navigate]);

	if (loading) {
		return <p></p>;
	}

	return <div>{children}</div>;
};

export default AuthRoute;
