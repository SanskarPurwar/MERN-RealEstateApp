import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase';
import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await fetch('api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName, email: result.user.email,
                    photo: result.user.photoURL
                }),

            })
            const data = await res.json()
            dispatch(signInSuccess(data));
            console.log(data);
            navigate('/');
        } catch (error) {
            console.log("Couldn't sign with google ", error);
        }
    }

    return (
        <button onClick={handleGoogleClick} type='button' className='border rounded-lg bg-slate-400 hover:opacity-90 p-2 disabled:opacity-65'>Continue With Google</button>
    )
}

export default OAuth;