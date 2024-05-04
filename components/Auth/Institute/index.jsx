import { useMemo, useState } from "react";
import Login from "./Login";
import Register from "./Register";

function Page() {
    const [selectedState, setSelectedState] = useState("login");
    const {cb, text} = useMemo(() => {
        return {
            cb: () => setSelectedState(prev => prev === 'login' ? 'register' : 'login'),
            text: selectedState === 'login'? `Don't have an account? Register` : `Already registered? Login`
        }
    },[selectedState])
    return (
        <>
            {selectedState === "login" ? <Login /> : <Register />}
            <button className="subtext" onClick={cb}>{text}</button>
        </>

    )
}

export default Page;
