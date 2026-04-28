import { useForm } from 'react-hook-form';
import { account, ID } from '../appwriteBaseCode';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const SignupUser = async (email, password) => {
    try {
      // Create a new user, Appwrite will automatically generate the user ID
      const user = await account.create(ID.unique(), email, password);
      console.log('User created:', user);
  
      // Now login the user to create a session
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);
  
      // Send a verification email
      await account.createVerification(`http://localhost:5173/verifyEmail/${user.$id}`);
      console.log('Verification email sent.');
  
      // Navigate to the verification page
      navigate(`/verifyEmail/${user.$id}`);
    } catch (error) {
      console.error('Error during signup or verification:', error.message);
    }
  };
  
  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      await SignupUser(email, password);
    } catch (error) {
      console.error('Error during form submission:', error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-black">Email</label>
            <input
              type="text"
              id="email"
              className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded mt-1"
              placeholder="Enter email"
              {...register('email', {
                required: '*Email is mandatory',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: '*Invalid email pattern',
                },
              })}
            />
            {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-black">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border bg-white border-gray-300 text-black rounded mt-1"
              placeholder="Enter password"
              {...register('password', {
                required: '*Password is mandatory',
                minLength: {
                  value: 8,
                  message: '*Password must be at least 8 characters',
                },
              })}
            />
            {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
