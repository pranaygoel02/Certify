import { createThirdwebClient, getContract, prepareContractCall, readContract, resolveMethod, sendTransaction } from "thirdweb";
import React, { createContext, useContext, useEffect, useState } from "react";
import { defineChain } from "thirdweb/chains";
import { toast } from "react-hot-toast";
import { useUserContext } from "./userContext";
import { upload } from "thirdweb/storage";
import useWallet from "@/hooks/useWallet";
import { useReadContract } from "thirdweb/react";
import { useContractContext } from "./contractContext";
import md5 from "js-md5";
import { generateQRCode, getQRCodeFiles, getQRCodes } from "@/utils/generateQrCode";
import { removeFileExtension } from "@/utils/removeFileExtension";

const StateContext = createContext(null);

export function StateProvider({ children }) {
    // const client = createThirdwebClient({
    //     clientId: "ca85179f427a2446ac9822ffaae627ae",
    // });

    // const localhost = defineChain({
    //     rpc: 'http://127.0.0.1:8545',
    //     chainId: 1337,
    //     chainName: "Localhost",
    //     nativeCurrency: {
    //         name: "Ether",
    //         symbol: "ETH",
    //         decimals: 18,
    //     }
    // })

    // const amoy = defineChain({
    //     rpc: "https://80002.rpc.thirdweb.com",
    //     chainId: 80002,
    //     chainName: "Polygon Amoy",
    //     nativeCurrency: {
    //         name: "Matic",
    //         symbol: "MATIC",
    //         decimals: 18,
    //     }
    // })

    // const ganache = defineChain({
    //     rpc: "http://127.0.0.1:7545",
    //     chainId: 31337,
    //     chainName: "Ganache",
    //     nativeCurrency: {
    //         name: "Ether",
    //         symbol: "ETH",
    //         decimals: 18,
    //     }
    // })

    // const contract = getContract({
    //     client,
    //     chain: localhost,
    //     address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    // });
    // const contract = getContract({
    //     client,
    //     chain: amoy,
    //     address: "0x3609A574a497B02951c7983efB4c03e981010489",
    // });

    
    const {contract, client, connect, isConnecting, error, connectToMetamask, activeAccount, address} = useContractContext()

    console.log('contract', contract);

    useEffect(() => {
        if(client) {
            connectToMetamask()
        }
    },[])

    const uploadToIpfs = async (file) => {
        const urls = await upload({
            client,
            files: Array.isArray(file) ? file : [file],
        });
        console.log('IPFS URL',urls);
        return urls;
    };

    function getIpfsUrl(url) {
        const u = `https://ipfs.io/ipfs/${
            url.replace("ipfs://", "")
        }`;
        return u;
    }

    const addInstitute = async (_instituteId) => {
        try {
            const transaction = await prepareContractCall({ 
                contract, 
                method: resolveMethod("addInstitute"), 
                params: [_instituteId] 
              });
              console.log('transaction', transaction, activeAccount);
              const res = await sendTransaction({ 
                transaction, 
                account: activeAccount
              })
            console.log(res);
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    const addCertificate = async (obj) => {
        console.log(obj);
        const {
            _courseName,
            _courseCode,
            _instituteName,
            _instituteRegistrationId,
            _recipientName,
            _recipientAddress,
            _certificateIpfsUrl,
            _qrIpfsUrl,
            _hash,
        } = obj;
        const _issueDate = Math.floor(new Date().getTime() / 1000);
        try {
            const transaction = await prepareContractCall({ 
                contract, 
                method: resolveMethod("addCertificate"), 
                params: [...Object.values(obj),_issueDate]
              });
              const res = await sendTransaction({
                transaction, 
                account: activeAccount
              })
            return res;
        } catch (err) {
            throw new Error(err);
        }
    };

    // [["A","A1","IEMK","AB","P1","0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","url1","url2","hash1",true,12334],["A","A1","IEMK","AB","P2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","url1","url2","hash2",true,12334]]

    const bulkAddCertificates = async (files, instituteName, instituteRegistrationId) => {
        let uploading1, uploading2, uploading3, uploading4, uploading5;
        try {
            uploading1 = toast.loading('Uploading certificates files')
            const certificateUrls = await uploadToIpfs(files)
            console.log('certificateUrls', certificateUrls);
            toast.dismiss(uploading1)
            toast.success('Certificates uploaded successfully')
            uploading2 = toast.loading('Generating hashes')
            const hashes = certificateUrls.map(md5)
            console.log('hashes', hashes);
            const verificationUrls = hashes.map(hash => `${process.env.NEXT_PUBLIC_CLIENT_URL}/verify?hash=${hash}`);
            console.log('verification urls', verificationUrls);
            toast.dismiss(uploading2)
            toast.success('Hashes generated successfully')
            uploading3 = toast.loading('Generating QR codes')
            const qrUrls = await getQRCodes(verificationUrls);
            console.log('qr urls', qrUrls);
            let formattedData = files?.map((file,i) => {
                const {name} = file
                const [courseName,courseCode,recipientName,recipientAddress] = removeFileExtension(name).trim().split('_')
                return {
                    courseName,
                    courseCode,
                    instituteName,
                    instituteRegistrationId,
                    recipientName,
                    recipientAddress,
                    certificateIpfsUrl: certificateUrls[i]
                }
            })
            const qrImageFiles = await getQRCodeFiles(qrUrls, formattedData)
            console.log('qrImageFiles', qrImageFiles);
            toast.dismiss(uploading3)
            toast.success('QR Codes generated successfully')
            uploading4 = toast.loading('Uploading QR codes')
            const qrIpfsUrls = await uploadToIpfs(qrImageFiles);
            console.log('qrIpfsUrls', qrIpfsUrls);
            toast.dismiss(uploading4)
            toast.success('QR Codes uploaded successfully')
            formattedData = formattedData.map((data,i) => ({
                ...data,
                qrIpfsUrl: qrIpfsUrls[i],
                hash: hashes[i],
                isValid: true,
                issueDate: Math.floor(new Date().getTime() / 1000)
            }))
            uploading5 = toast.loading('Processing transaction')
            // const callData = formattedData?.map(data => Object.values(data))
            console.log(formattedData);
            const transaction = await prepareContractCall({ 
                contract, 
                method: resolveMethod("addCertificates"), 
                params: [formattedData]
              });
              const res = await sendTransaction({ 
                transaction, 
                account: activeAccount
              })
              console.log('result',res);
              toast.success('Certificates uploaded successfully')
        }
        catch(err) {
            console.log(err);
            toast.error(formatError(err))
        }
        finally {
            toast.dismiss(uploading1)
            toast.dismiss(uploading2)
            toast.dismiss(uploading3)
            toast.dismiss(uploading4)
            toast.dismiss(uploading5)
        }
    }

    const getInstituteCertificates = async (_instituteId) => {
        try {
            const res = await readContract({ 
                contract, 
                method: resolveMethod("getInstituteCertificates"), 
                params: [_instituteId] 
              })
            return res;
        } catch (err) {
            throw new Error(err);
        }
    };

    const getStudentCertificates = async () => {
        console.log("fetching certificates");
        try {
            const res = await readContract({ 
                contract, 
                method: resolveMethod("getStudentCertificates"), 
                params: [address] 
              })
            console.log('student certificates >>> ',res);
            return res;
        } catch (err) {
            throw new Error(err);
        }
    };

    const toggleValidity = async ({
        _certificateHash,
        _instituteRegistrationId,
    }) => {
        const loadingToast = toast.loading("Processing...");
        console.log(
            "toggleValidity",
            _certificateHash,
            _instituteRegistrationId
        );
        try {
            const transaction = await prepareContractCall({ 
                contract, 
                method: resolveMethod("toggleCertificateValidity"), 
                params: [_certificateHash, _instituteRegistrationId] 
              });
              const res = await sendTransaction({ 
                transaction, 
                account: activeAccount 
              })
            console.log(res);
            toast.success("Validity updated");
            return res;
        } catch (err) {
            throw new Error(err);
            toast.error("Validity update failed");
        } finally {
            toast.dismiss(loadingToast);
        }
    };

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
        <StateContext.Provider
            value={{
                contract,
                address,
                connect,
                isConnecting,
                getIpfsUrl,
                uploadToIpfs,
                addInstitute,
                addCertificate,
                getInstituteCertificates,
                getStudentCertificates,
                toggleValidity,
                formatError,
                verifyHash,
                bulkAddCertificates,
                connectToMetamask,
            }}
        >
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);
