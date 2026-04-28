// import React from 'react'
// import { useForm } from 'react-hook-form' 
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css';
// import './logout.css'
// import Cookies from 'js-cookie'

// const Logout = () => {
//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();
//     const navigate = useNavigate();

//     const onSubmit = async (data) => {
//         try {
//             const { username, password } = data;
//             const response = await axios.delete('https://s51-funny-contents-project-7.onrender.com/LOGOUT', { data: { username, password } });
//             console.log(response.data)
//             toast.success("Logout successful and user deleted");

//             Cookies.remove("name");
//             Cookies.remove("password");
            
//             navigate('/');
//         } catch (error) {
//             toast.error("Logout Failed");
//             console.log(error.message, "logout error");
//         }
//     };

//     return (
//         <div className='logout_form_container'>
//             <h1>Logout form</h1>
//             <br />
//             <form onSubmit={handleSubmit(onSubmit)} className='logout_form'>
//                 <label htmlFor="username">Username:</label>
//                 <input
//                     type="text"
//                     id="username"
//                     placeholder="Enter Username"
//                     {...register("username", {
//                         required: "❗Username is mandatory",
//                         minLength: {
//                             value: 3,
//                             message: "❗Username is too short, at least 3 letters",
//                         },
//                         maxLength: {
//                             value: 40,
//                             message: "❗Username is too long, maximum 40 characters",
//                         },
//                     })}
//                 />
//                 {errors.username && <p>{errors.username.message}</p>}

//                 <label htmlFor="password">Password:</label>
//                 <input
//                     type="password"
//                     id="password"
//                     placeholder="Enter Password"
//                     {...register("password", {
//                         required: "Password is required",
//                     })}
//                 />
//                 {errors.password && <p>{errors.password.message}</p>}

//                 <button type="submit" className="logout_submit">
//                     Logout
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default Logout;
