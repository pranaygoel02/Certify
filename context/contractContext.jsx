import { createThirdwebClient, getContract, readContract, resolveMethod } from "thirdweb";
import { createContext, useContext } from "react";
import { defineChain } from "thirdweb/chains";
import useWallet from "@/hooks/useWallet";

const ContractContext = createContext(null);

export function ContractProvider({ children }) {
    const client = createThirdwebClient({
        clientId: "ca85179f427a2446ac9822ffaae627ae",
    });

    const { connect, isConnecting, error, connectToMetamask, activeAccount, address } = useWallet(client)

    const localhost = defineChain({
        rpc: 'http://127.0.0.1:8545',
        chainId: 1337,
        chainName: "Localhost",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        }
    })

    const amoy = defineChain({
        rpc: "https://80002.rpc.thirdweb.com",
        chainId: 80002,
        chainName: "Polygon Amoy",
        nativeCurrency: {
            name: "Matic",
            symbol: "MATIC",
            decimals: 18,
        }
    })

    const ganache = defineChain({
        rpc: "http://127.0.0.1:7545",
        chainId: 31337,
        chainName: "Ganache",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        }
    })

    // const contract = getContract({
    //     client,
    //     chain: localhost,
    //     address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    // });
    
    // WORKING CONTRACT
    // const contract = getContract({
    //     client,
    //     chain: amoy,
    //     address: "0x3609A574a497B02951c7983efB4c03e981010489",
    // });

    const contract = getContract({
        client,
        chain: amoy,
        address: process.env.NEXT_PUBLIC_CONTRACT,
    });

    const verifyHash = async (_hash) => {
        console.log("verifying hash", _hash);
        try {
            const res = await readContract({ 
                contract, 
                method: resolveMethod("verifyHash"), 
                params: [_hash] 
              })
            console.log('verification result >>> ',res);
            return res;
        } catch (err) {
            throw new Error(err);
        }
    };

    function getIpfsUrl(url) {
        const u = `https://ipfs.io/ipfs/${
            url.replace("ipfs://", "")
        }`;
        return u;
    }

    const formatError = (err) => {
        const msg = err?.message
            ?.split(",")
            ?.filter((e) => e.trim().includes("reason="))?.[0]
            ?.trim()
            ?.replace("reason=", "")
            ?.replace(`"`, "")
            ?.replace(`"`, "");

        return msg;
    };

    return (
        <ContractContext.Provider
            value={{
                contract,
                formatError,
                verifyHash,
                getIpfsUrl,
                client,
                connect, 
                isConnecting, 
                error, 
                connectToMetamask, 
                activeAccount, 
                address
            }}
        >
            {children}
        </ContractContext.Provider>
    );
}

export const useContractContext = () => useContext(ContractContext);
