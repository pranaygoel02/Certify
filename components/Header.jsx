import { useUserContext } from "@/context/userContext";
import Link from "next/link";

function Header({ children }) {

    const {user} = useUserContext()

    return (
        <header className="flex justify-between items-center w-full p-4 border-b-[1px] border-neutral-800">
            <Link href={user?.type === 'institute' ? '/dashboard' : '/'}><h1 className="font-bold">Certify</h1></Link>
            {children}
        </header>
    );
}

export default Header;