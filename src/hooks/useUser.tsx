import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

// Initialize Firebase Auth
const auth = getAuth();

const useUser = () => {
	const [user] = useAuthState(auth); // useAuthState provides the authenticated user
	return user; // Return the user object
};

export default useUser;
