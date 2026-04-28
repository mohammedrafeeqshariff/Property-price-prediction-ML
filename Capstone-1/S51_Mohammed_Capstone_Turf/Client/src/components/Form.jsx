// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';

// const UserForm = () => {
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState(null);
//   const [clientName, setClientName] = useState('');
//   const [clientLocation, setClientLocation] = useState('');
  
//   // const session = account.getSession('current');

      
//   // console.log(session.provider);
//   // console.log(session.providerUid);
//   // console.log(session.providerAccessToken);


//   useEffect(() => {

//   }, [clientName, clientLocation, formData, step, navigate]);

//   const onSubmit = async (data) => {
//     try {
//       console.log("submitted data", data);


//       if (step < 3) {
//         setStep(step + 1);
//       } else {
//         setClientName(data.name);
//         setClientLocation(data.location);
//         setFormData(data);
//         if (clientName && clientLocation && step === 3 && formData) {
//           if (formData.userType === 'user') {
//             navigate('/userHome', { state: { name: clientName, location: clientLocation } });
//           } else if (formData.userType === 'owner') {
//             navigate('/ownerHome', { state: { name: clientName, location: clientLocation } });
//           }
//         }

//       }
//     } catch (error) {
//       console.error("Error while submitting form:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <div className="max-w-md w-full p-8 bg-gray-800 shadow-lg rounded-md">
//         <p className="">{step}/3</p>
//         <form onSubmit={handleSubmit(onSubmit)} className="w-full">
//           {step === 1 && (
//             <div className="w-full">
//               <label htmlFor="name" className="block text-gray-300 text-lg font-semibold">Enter your name:</label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 {...register('name', { required: 'Name is mandatory' })}
//                 className="mt-2 p-3 w-full border border-gray-600 rounded-md bg-gray-700 text-gray-300"
//               />
//               {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//               <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Next</button>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="w-full">
//               <label htmlFor="location" className="block text-gray-300 text-lg font-semibold">Choose your District:</label>
//               <select
//                 name="location"
//                 id="location"
//                 {...register('location', { required: 'Location is mandatory' })}
//                 className="mt-2 p-3 w-full border border-gray-600 rounded-md bg-gray-700 text-gray-300"
//               >
//                 <option value="" disabled>Select one</option>
//                 <option value="Chennai">Chennai</option>
//                 <option value="Madurai">Madurai</option>
//                 <option value="Chengalpattu">Chengalpattu</option>
//               </select>
//               {errors.location && <p className="text-red-500">{errors.location.message}</p>}
//               <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Next</button>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="w-full">
//               <label htmlFor="userType" className="block text-gray-300 text-lg font-semibold">Are you here to upload your TURF?</label>
//               <select
//                 name="userType"
//                 id="userType"
//                 {...register('userType', { required: 'User type is mandatory' })}
//                 className="mt-2 p-3 w-full border border-gray-600 rounded-md bg-gray-700 text-gray-300"
//               >
//                 <option value="" disabled>Select one</option>
//                 <option value="owner">Yes</option>
//                 <option value="user">No</option>
//               </select>
//               {errors.userType && <p className="text-red-500">{errors.userType.message}</p>}
//               <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">Submit</button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UserForm;
