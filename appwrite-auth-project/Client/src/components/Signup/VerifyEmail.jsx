import { useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { account } from '../appwriteBaseCode'

const VerifyEmail = () => {

    const userID = useParams()
    const [searchParams] = useSearchParams()
    const secret = searchParams.get('secret') 
    const navigate = useNavigate()

    useEffect(()=>{
        const VerifyEmailaddress = async ()=>{
            try {
                if(userID && secret){
                    await account.updateVerification(userID, secret)
                    alert('Email verified...')
                    navigate('/signup')
                }
                else{
                    alert('Invalid Link!')
                }
            } catch (error) {
                console.log(error)
                alert('Email verification failed!')
            }
        }

        VerifyEmailaddress()
    },[userID, secret, navigate])

  return (
    <div>
      we have Sent a mail to you click and login to your account...
    </div>
  )
}

export default VerifyEmail
