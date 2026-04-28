import './Upload.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from "js-cookie"


const Upload = () => {

    const navigate = useNavigate()
    
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
        try{
      data.userID = Cookies.get("userID")
           await axios.post("https://s51-funny-contents-project-3.onrender.com/POST", data)
           toast.success("Meme uploaded")
            console.log(data);
            navigate('/')
        }
        catch(error){
            console.log(error.message)
            console.log("cannot upload")
        }
    };
                                     
    return (
        <div className='form_container'>
            <form onSubmit={handleSubmit(onSubmit)} className='form'>

                <label htmlFor="content">URL:</label>
                <input
                    type="url"
                    id="content"
                    placeholder='Enter the content URL'
                    {...register('content', { required: '❗URL is required' })}
                />
                {errors.content && <p>{errors.content.message}</p>}

                <button type='submit' className='submit'>Add ➕</button>
            </form>
        </div>
    );
};

export default Upload;
