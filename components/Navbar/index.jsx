import { useStateContext } from "@/context";
import ConnectWalletBtn from "@/components/ConnectWalletBtn";
import { useUserContext } from "@/context/userContext";
import { FaRegUser } from "react-icons/fa";
import { LuLogOut } from "react-icons/lu";
import Button from "../Button";
import Header from "../Header";
import Badge from "../Badge";
import Link from "next/link";

function Navbar() {
    const { address } = useStateContext();
    const { logout, user, userLoggedIn, toggleProfileModal } = useUserContext();
    return (
        <Header>
            <nav className="flex items-center subtext gap-4">
                {userLoggedIn && (
                    <>
                    {user?.type === 'institute' && 
                    <>
                    <Link href={'/dashboard/bulk-upload'}>Bulk Upload</Link>
                    <Link href={'/dashboard/templates'}>Templates</Link>
                    </>
                    }
                    {/* {address && <span className="subtext">Logged in as <Badge>{address.substring(0,6)+'...'+address.substring(address.length - 4, address.length)}</Badge></span>} */}
                    {address && <Button variant="outline" disabled={user?.type !== 'institute'} onClick={() => toggleProfileModal(true)} label={<><FaRegUser /><span>{address.substring(0,6)+'...'+address.substring(address.length - 4, address.length)}</span></>}/>}
                    </>
                )}
                {!address && <ConnectWalletBtn />}
                {userLoggedIn && <Button onClick={logout} variant="neutral" label={<><LuLogOut /><span>Logout</span></>} />}
            </nav>
        </Header>
    );
}

export default Navbar;
