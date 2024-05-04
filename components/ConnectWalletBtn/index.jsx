'use client'
import { useStateContext } from "@/context";
import LoadingSpinner from "../LoadingSpinner";
import Button from "../Button";
import Image from "next/image";

function ConnetWalletBtn() {

    const { contract, connectToMetamask: connect, isConnecting } = useStateContext();

    if (!contract) {
        return <LoadingSpinner/>;
    }
  
  return <Button variant="secondary" onClick={connect} label={<>{isConnecting ? <LoadingSpinner /> : <Image width={24} height={24} alt="" src={'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/1024px-MetaMask_Fox.svg.png'}/>}<span>Connect Wallet</span></>}/>;
}

export default ConnetWalletBtn;
