import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import './login.css'
import Cookies from 'js-cookie'

const Login = () => {
  const navigate = useNavigate();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await axios.post("https://s51-funny-contents-project-3.onrender.com/LOGIN", data);
      console.log(response.data._id);
      // console.log(response.data.username)
      // Cookies
      Cookies.set('name', response.data.username)
      Cookies.set("authToken", response.data.authToken)
      Cookies.set("userID", response.data._id)
      console.log(response.data)
      const authToken = Cookies.get('authToken')
      console.log(authToken)

      toast.success(`Logged in as ${response.data.username} `);
      navigate('/');

    } catch (error) {
      toast.error("Invalid username or password ");
      console.log(error.message);
    }
  };

  return (
    <div className="login_form_container">
      <h1>Welcome back....</h1>
      <br />
      <form onSubmit={handleSubmit(onSubmit)} className="login_form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter Username"
          {...register("username", {
            required: "❗Username is mandatory",
            minLength: {
              value: 3,
              message: "❗Username is too short, at least 3 letters",
            },
            maxLength: {
              value: 40,
              message: "❗Username is too long, maximum 40 characters",
            },
          })}
        />
        {errors.username && <p>{errors.username.message}</p>}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button type="submit" className="login_submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
