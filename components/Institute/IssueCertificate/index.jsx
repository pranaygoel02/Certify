import Button from "@/components/Button";
import { useUserContext } from "@/context/userContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "@/axios";
import { FaChevronDown } from "react-icons/fa";
import { useStateContext } from "@/context";
import md5 from "js-md5";
import { generateQRCode } from "@/utils/generateQrCode";
import { useSendTransaction } from "thirdweb/react";
import { prepareContractCall, resolveMethod } from "thirdweb";
import useFetch from "@/hooks/useFetch";
import { FiSearch } from "react-icons/fi";
import { MdOutlineEditNote } from "react-icons/md";
import convertToSplitWords from "@/utils/convertToSplitWords";

function IssueCertificate({ cb }) {
    const [loading, setLoading] = useState(false);
    const { user } = useUserContext();
    const { uploadToIpfs, contract, bulkAddCertificates} = useStateContext();

    // const [searchKeys, setSearchKeys] = useState(null);

    const {data: searchKeys, isFetching} = useFetch({
        method: 'post',
        url: '/institution/db/search-keys',
        body: {email: user?.email},
        dependencies: [user?.email]
    })

    console.log(searchKeys, isFetching);
    
    const {
        isLoading,
        isError,
        mutateAsync: sendTransaction,
    } = useSendTransaction();
    const addCertificate = async (obj) => {
        console.log("adding certificate", obj);
        const _issueDate = Math.floor(new Date().getTime() / 1000);
        const transaction = prepareContractCall({
            contract,
            method: resolveMethod("addCertificate"),
            params: [...Object.values(obj), _issueDate],
        });
        const res = await sendTransaction(transaction);
        console.log("result", res);
        return res;
    };

    const [recipient, setRecipient] = useState(null);
    const [showRecipientForm, setShowRecipientForm] = useState(true)
    const [manualEntry, setManualEntry] = useState(false)
    const [certificateImg, setCertificateImg] = useState(null);
    const [qrUrl, setQrUrl] = useState(null);

    const [issuing, setIssuing] = useState(false);

    useEffect(() => {
        if (!recipient) {
            setShowRecipientForm(true);
        } else {
            setShowRecipientForm(false);
        }
    }, [recipient]);

    useEffect(() => {
        if(!searchKeys || searchKeys.length === 0) {
            setManualEntry(true)
        }
    },[searchKeys])

    const searchStudent = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(e.target)?.entries());
        console.log(formData);
        if(!searchKeys || manualEntry) {
            setRecipient(formData)
            return
        }
        try {
            setLoading(true);
            const res = await axios.post("/institution/student", {
                ...formData,
                institute_reg_id: user.registration_id,
            });
            console.log(res);
            if (res.status === 200) {
                setRecipient(res.data?.[0]);
            }
        } catch (err) {
            console.log(err);
            toast.error(`Registration Failed. ${err?.response?.data?.error}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCertificateChange = async (e) => {
        e.preventDefault();
        setCertificateImg(e.target.files[0]);
    };

    const handleIssueCertificate = async (e) => {
        e.preventDefault();
        try {
            setIssuing(true);
            const { course_name, course_code } = Object.fromEntries(
                new FormData(e.target)?.entries()
            );
            console.log(certificateImg);
            const fileType = certificateImg?.type
            const [,extension] = fileType.split('/')
            const newFileName = `${course_name}_${course_code}_${recipient?.name}_${recipient?.blockchain_addr}.${extension}`
            const newFile = new File([certificateImg], newFileName, {
                type: certificateImg.type,
                lastModified: certificateImg.lastModified,
            });
            const res = await bulkAddCertificates([newFile], user?.name, user?.registration_id)
            toast.success("Certificate added successfully.");
            cb();
        } catch (err) {
            console.log(err);
            toast.error(
                `Certificate addition failed. ${err?.response?.data?.error}`
            );
        } finally {
            setIssuing(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="inline-flex gap-2 items-center justify-between w-full">
            {!manualEntry ? <p className="subtext">
                Search recipient. Enter any of the valid credentials to search
                the recipient.
            </p> : <p>Enter recipients information</p>}
            {searchKeys && <Button variant="neutral" onClick={() => {
                setManualEntry(prev => !prev)
                setShowRecipientForm(true)
            }} label={manualEntry ? <><FiSearch/><span>Search</span></> : <><MdOutlineEditNote /><span>Manual</span></>}/>}
            </div>
            <form onSubmit={searchStudent}>
                {showRecipientForm && (
                        (!manualEntry && searchKeys) ? 
                        <>
                        {
                            searchKeys?.length === 0 ? <p className="subtext">Please add database search parameters in Profile {'>'} Database to search a recipient</p> : searchKeys?.map(({key,title,type}) => <label key={key}><input name={key} type={type} placeholder={`Enter recipients ${title}`}/></label>)
                        }
                        </>
                        :
                        <>
                        <label>
                            <input
                                required={manualEntry}
                                defaultValue={recipient?.name}
                                name="name"
                                type="text"
                                placeholder="Enter recipient's name"
                            />
                        </label>
                        <label>
                            <input
                                required={manualEntry}
                                defaultValue={recipient?.registration_number}
                                name="registration_number"
                                type="text"
                                placeholder="Enter registration number"
                            />
                        </label>
                        <label>
                            <input
                                required={manualEntry}
                                defaultValue={recipient?.email}
                                name="email"
                                type="email"
                                placeholder="Enter recipient's email"
                            />
                        </label>
                        <label>
                            <input
                                required={manualEntry}
                                defaultValue={recipient?.blockchain_addr}
                                name="blockchain_addr"
                                type="text"
                                placeholder="Enter recipient's blockchain address"
                            />
                        </label>
                    </>
                )}
                <div className="flex gap-2">
                    <Button
                        disabled={!showRecipientForm}
                        className="w-full"
                        type={"submit"}
                        loading={loading}
                        label={!showRecipientForm ? 'See recipient form' : `${(!manualEntry && searchKeys) ? 'Search' : 'Submit'} recipient`}
                        style={{
                            width: "100%",
                        }}
                    />
                    {recipient && (
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowRecipientForm((prev) => !prev);
                            }}
                            variant="neutral"
                            label={
                                <span
                                    className={`transition-all ${
                                        showRecipientForm
                                            ? "rotate-[180deg]"
                                            : "rotate-0"
                                    }`}
                                >
                                    <FaChevronDown />
                                </span>
                            }
                        />
                    )}
                </div>
            </form>
            {recipient && (
                <>
                    <div className="rounded-lg bg-neutral-900/50 p-4 flex items-center flex-wrap subtext gap-2 recipient_card">
                        {
                            Object.entries(recipient)?.map(([k, value]) => {
                                return (
                                    <div key={k}>
                                        <label>{convertToSplitWords(k)}</label>
                                        <span>{value}</span>
                                    </div>
                                )
                            })
                        }
                        {/* <div>
                            <label>Name</label>
                            <span>{recipient.name}</span>
                        </div>
                        <div>
                            <label>Email</label>
                            <span>{recipient.email}</span>
                        </div>
                        <div>
                            <label>Blockchain Address</label>
                            <span>{recipient.blockchain_addr}</span>
                        </div>
                        <div>
                            <label>Registration Number</label>
                            <span>{recipient.registration_number}</span>
                        </div> */}
                    </div>

                    <form onSubmit={handleIssueCertificate}>
                        <label>
                            <input
                                name="course_name"
                                type="text"
                                required
                                placeholder="Enter course name"
                            />
                        </label>
                        <label>
                            <input
                                name="course_code"
                                type="text"
                                required
                                placeholder="Enter course code"
                            />
                        </label>
                        <label
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            htmlFor="file_input"
                        >
                            Upload certificate file
                        </label>
                        <input
                            onChange={handleCertificateChange}
                            id="file_input"
                            type="file"
                        />
                        {certificateImg && (
                            <img
                                src={URL.createObjectURL(certificateImg) ?? ""}
                                alt="Certificate"
                            />
                        )}
                        {certificateImg && (
                            <Button
                                loading={issuing || isLoading}
                                type={"submit"}
                                className="w-full"
                                label={"Issue Certificate"}
                                style={{
                                    width: "100%",
                                }}
                            />
                        )}
                    </form>
                </>
            )}
        </div>
    );
}

export default IssueCertificate;
