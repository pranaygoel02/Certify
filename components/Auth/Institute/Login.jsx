import Button from "@/components/Button";
import { useUserContext } from "@/context/userContext";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from '@/axios'
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";

function Login() {

    const [loading,setLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const {setUser} = useUserContext()

    const loginInstitute = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = Object.fromEntries(new FormData(e.target)?.entries())
        try {
            const res = await axios.post('/institution/login', formData)
            if(res.status === 200) {
                toast.success('Login Successful')
                setUser({...res.data, type: 'institute'})
            }
        }
        catch(err) {
            console.log(err);
            toast.error(`Login Failed. ${err?.response?.data?.error}`)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <section className="form_div">
            <h2>Institute Login</h2>
            <form onSubmit={loginInstitute} className="flex flex-col">
                <label>
                    <input name="email" type="email" placeholder="Enter institute email"/>
                </label>
                <label className="relative">
                    <input required name="password" type={showPassword ? 'text' : "password"} placeholder="Enter institute password"/>
                    <button className="absolute right-2 top-[50%] translate-y-[-50%]" 
                    onClick={(e) => {
                        e.preventDefault();
                        setShowPassword(prev => !prev)
                    }}
                    >{showPassword ? <RxEyeClosed/> : <RxEyeOpen />}</button>
                </label>
                <Button className='w-full' variant='primary' loading={loading} type="submit" label='Login' style={{
                    width: '100%'
                }}/>
            </form>
        </section>
    );
}

export default Login;
