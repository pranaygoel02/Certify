import axios from "@/axios";
import Button from "@/components/Button";
import { useStateContext } from "@/context";
import { useUserContext } from "@/context/userContext";
import password_validate from "@/utils/passwordValidate";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoInformationCircle, IoInformationCircleOutline } from "react-icons/io5";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";

function Register() {

    const [loading,setLoading] = useState(false)
    const [showPassword,setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const {addInstitute} = useStateContext()
    const {setUser} = useUserContext()


    const registerInstitute = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        console.log('registerInstitute')
        const formData = Object.fromEntries(new FormData(e.target)?.entries())
        console.log(formData);
        try {
            const valid = password_validate(formData.password)
            if(!valid.state) {
                if(!valid.capital) setError(prev => [...(prev ?? []), "Password should have at least one capital letter"])
                if(!valid.digit) setError(prev => [...(prev ?? []), "Password should have at least one digit"])
                if(!valid.length) setError(prev => [...(prev ?? []), "Password should be greater than 8 characters"])
                return
            }
            const block_res = await addInstitute(formData.registration_id)
            console.log(block_res);
            const res = await axios.post('/institution/register', formData)
            console.log(res);
            if(res.status === 200) {
                toast.success('Registration Successful. Check for verification mail.')
                setUser({...res.data, type: 'institute'})
            }
        }
        catch(err) {
            console.log(err);
            toast.error(`Registration Failed. ${err?.response?.data.error}`)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <section className="form_div">
            <h2>Institute Register</h2>
            <form onSubmit={registerInstitute} className="flex flex-col">
                <label>
                    <input required name="name" type="text" placeholder="Enter institute name"/>
                </label>
                <label>
                    <input required name="registration_id" type="text" placeholder="Enter registration ID"/>
                </label>
                {/* <label>
                    <input required name="db_url" type="text" placeholder="Enter institute student database URL"/>
                </label> */}
                <label>
                    <input required name="email" type="email" placeholder="Enter institute email"/>
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
                <Button className='w-full' variant='primary' loading={loading} type="submit" label='Register' style={{
                    width: '100%'
                }}/>
            </form>
            {
                error && <div className="space-y-2 subtext">{error?.map(err => <p className="text-red-600 items-center gap-l text-left inline-flex gap-m" key={err}><IoInformationCircleOutline/> {err}</p>)}</div>
            }
        </section>
    );
}

export default Register;
