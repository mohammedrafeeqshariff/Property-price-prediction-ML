import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import './update.css'
import Cookies from "js-cookie"

const Update = () => {

    const navigate = useNavigate()
    const {id} = useParams()
    console.log(id)
    const { register,handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async(data) => {
        data.userID = Cookies.get("userID")
        try{
           await axios.patch(`https://s51-funny-contents-project-3.onrender.com/PATCH/${id}`, data)
           toast.success("Meme updated")
            console.log(data);
            navigate('/')
        }
        catch(error){
            console.log(error.message)
        }
    };

    const cancelUpdate = ()=>{
        navigate('/')
        toast.success("Update Cancelled")
    }

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
                
                <div className='submitButtons'>
                    <button type='submit' className='updateContent'>Update ➕</button>
                    <button onClick={cancelUpdate} className='cancelUpdate'>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Update;
