'use client'

import Button from "@/components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/axios";
import password_validate from "@/utils/passwordValidate";
import { IoInformationCircleOutline } from "react-icons/io5";

function Page() {
    
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [stepCount, setStepCount] = useState(0);
    const [email, setEmail] = useState(null)
    const [error, setError] = useState(null)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = Object.fromEntries(new FormData(e.target)?.entries());
        console.log(formData);
        if(formData?.newPassword) {
            const valid = password_validate(formData.newPassword)
            if(!valid.state) {
                if(!valid.capital) setError(prev => [...(prev ?? []), "Password should have at least one capital letter"])
                if(!valid.digit) setError(prev => [...(prev ?? []), "Password should have at least one digit"])
                if(!valid.length) setError(prev => [...(prev ?? []), "Password should be greater than 8 characters"])
                return
            }
        }
        try {
            const res = await axiosInstance.post(`/institution/${stepCount === 0 ? 'reset' : 'new'}-password`, formData);
            console.log(res);
            if (res.status === 200) {
                toast.success(res?.data?.message);
                if(stepCount === 0) {
                    setEmail(formData.email)
                    setStepCount(prev => prev + 1)
                }
                if(stepCount === 1) {
                    router.replace("/auth/institute/login");
                }
            }
        } catch (err) {
            console.log(err);
            toast.error(`${err?.response?.data?.error}`);
        } finally {
            setLoading(false);
        }
    };

    if(stepCount === 0) {
        return (
            <section className="form_div">
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label>
                        <input
                            required
                            name="email"
                            type="email"
                            placeholder="Enter institute email"
                        />
                    </label>
                    <Button
                        className="w-full"
                        variant="primary"
                        loading={loading}
                        type="submit"
                        label="Submit"
                        style={{
                            width: "100%",
                        }}
                    />
                </form>
            </section>
        );
    }
    if(stepCount === 1) {
        return (
            <section className="form_div">
                <h2>Update Password</h2>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <label>
                        <input
                            name="email"
                            value={email}
                            type="email"
                            placeholder="Enter institute email"
                            readOnly
                        />
                    </label>
                    <label>
                        <input
                            required
                            name="otp"
                            placeholder="Enter OTP"
                        />
                    </label>
                    <label>
                        <input
                            required
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                        />
                    </label>
                    <Button
                        className="w-full"
                        variant="primary"
                        loading={loading}
                        type="submit"
                        label="Submit"
                        style={{
                            width: "100%",
                        }}
                    />
                </form>
            </section>
        );
    }
    {
        error && <div className="space-y-2 subtext">{error?.map(err => <p className="text-red-600 items-center gap-l text-left inline-flex gap-m" key={err}><IoInformationCircleOutline/> {err}</p>)}</div>
    }
}

export default Page;
