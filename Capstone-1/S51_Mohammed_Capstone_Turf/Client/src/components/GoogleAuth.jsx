import { Client, Account, OAuthProvider } from "appwrite";
import { useSelector } from 'react-redux';

const GoogleAuth = () => {
  const AppwriteId = import.meta.env.VITE_APPWRITE_ID;
  const AppwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const { isAuthenticated } = useSelector((state) => state.auth);

  const client = new Client()
    .setEndpoint(AppwriteEndpoint)
    .setProject(AppwriteId);

  const account = new Account(client);

  const handleGoogleLogin = async () => {
    try {
      // Clear any existing session first
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore if no session
      }

      account.createOAuth2Session(
        OAuthProvider.Google,
        window.location.origin + '/userHome',
        window.location.origin + '/login'
      );
    } catch (error) {
      console.error("Google Auth Redirect Error:", error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full py-2 bg-white border border-gray-300 rounded shadow-md hover:bg-gray-100 transition duration-200"
    >
      <img
        className="w-6 h-6 mr-2"
        src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png"
        alt="Google logo"
      />
      Sign in with Google
    </button>
  );
};

export default GoogleAuth;
