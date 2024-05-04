import { useStateContext } from "@/context";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import { GrDocumentMissing } from "react-icons/gr";
import Button from "../Button";
import { LuQrCode } from "react-icons/lu";
import { useState } from "react";
import DownloadButton from "../DownloadButton";
import Badge from "../Badge";
import StatusIndicator from "../StatusIndicator";

function CertificateList({ certificates, loading, setCertificates=()=>{} }) {
    return (
        <section className="py-4 space-y-4">
            <ul className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
                {loading &&
                    Array.from({ length: 8 })?.map((_, i) => {
                        return (
                            <div
                                key={i}
                                className="certificate_card shimmer animate-pulse"
                            ></div>
                        );
                    })}
                {!loading &&
                    certificates &&
                    certificates?.map((certificate, i) => {
                        return (
                            <li key={i}>
                                <Certificate certificate={certificate} setCertificates={setCertificates}/>
                            </li>
                        );
                    })}
            </ul>
        </section>
    );
}

function Certificate({ certificate, setCertificates }) {
    const { getIpfsUrl, toggleValidity, getInstituteCertificates } = useStateContext();
    const { user } = useUserContext();

    const [showQr, setShowQr] = useState(false)

    const certificateImg = getIpfsUrl(certificate?.certificateIpfsUrl);
    const qrImg = getIpfsUrl(certificate?.qrIpfsUrl);
    const issueDate = new Date(parseInt(certificate?.issueDate) * 1000).toDateString()//toLocaleString('en-IN')

    return (
        <div className="certificate_card">
            <div className="certificate_card_img">
            <Image
                src={certificateImg}
                alt=""
                width={100}
                height={100}
                style={{
                    width: "100%",
                }}
                />
            {/* <Button onClick={async () => {
                    try {
                        if(user?.type === 'student') return
                        const res = await toggleValidity({_certificateHash: certificate?.hash, _instituteRegistrationId: user?.registration_id})
                        const res1 = await getInstituteCertificates(user?.registration_id)
                        console.log(res1);
                        setCertificates(res1)
                    }
                    catch(err) {
                        console.log(err);
                    }
                }} variant={certificate?.isValid ? "success" : "danger"} disabled={user?.type === 'student'} className='opacity-100 absolute left-0 top-0 m-1' label={<>{certificate?.isValid ? <FaCircleCheck /> : <IoMdCloseCircle />}<span>{user?.type === 'institute' ? 'Toggle validity' : (certificate?.isValid ? 'Valid' : 'Invalid')}</span></>}/> */}
            </div>
            <div className="certificate_card_content">
                <div>
                    <label>Recipient Name</label>
                    <span>{certificate?.recipientName}</span>
                </div>
                <div>
                    <label>Recipient Address</label>
                    <Badge.Address address={certificate?.recipientAddress}/>
                </div>
                <div>
                    <label>Course Name</label>
                    <span>{certificate?.courseName}</span>
                </div>
                <div>
                    <label>Course Code</label>
                    <span>{certificate?.courseCode}</span>
                </div>
                <div>
                    <label>Issue Date</label>
                    <span>{issueDate}</span>
                </div>
                {user?.type === "student" && (
                    <>
                        <div>
                            <label>Institute Name</label>
                            <span>{certificate?.instituteName}</span>
                        </div>
                    </>
                )}
                <div>
                    <label>Validity</label>
                    <Badge.Validity isValid={certificate?.isValid}/>
                </div>
            </div>
            {/* <Button variant="neutral" onClick={() => setShowQr(prev => !prev)} className='qr_button' title='See QR Code' label={<LuQrCode />}/> */}
            <LuQrCode className="qr_button" size={24} onClick={() => setShowQr(true)} title="See QR Code"/>
            {showQr && <div className="qr_code space-y-4">
            <Image src={qrImg} alt="" width={200} height={200} />
            <div className="space-y-4 recipient_card">
                <div>
                    <label>QR Hash</label>
                    <Badge style={{fontSize: '0.75em'}}>{certificate?.hash}</Badge>
                </div>
            <div className="flex flex-wrap w-full gap-4 items-center">
            <DownloadButton fileUri={certificate?.qrIpfsUrl} className='w-full'  label='Download QR' variant='primary'/>
            <Button onClick={() => setShowQr(false)} className='w-full' label='Hide' variant='secondary'/>
            </div>
            </div>
            </div>}
        </div>
    );
}

export default CertificateList;
