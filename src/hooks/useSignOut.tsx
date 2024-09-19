import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

const useSignOut = () => {
	// const auth = getAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		try {
			await signOut(auth); // Sign the user out
			navigate('/login'); // Redirect to the login page
		} catch (error) {
			console.error('Error signing out:', error);
		}
	};

	return handleSignOut;
};

export default useSignOut;
