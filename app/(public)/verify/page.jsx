"use client";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import { useContractContext } from "@/context/contractContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Verify() {
    const { verifyHash, getIpfsUrl, formatError } = useContractContext();

    const searchParams = useSearchParams();
    const hash = searchParams.get("hash");

    const [loading, setLoading] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [valid, setValid] = useState(null);

    useEffect(() => {
        const _tmp = async () => {
            try {
                setLoading(true);
                const res = await verifyHash(hash);
                if (res) {
                    setCertificate(res);
                    setValid({
                        state: res?.isValid,
                        msg: `Verification Successful. Certificate is marked ${
                            res?.isValid ? "" : "in"
                        }valid by the institution`,
                    });
                }
            } catch (err) {
                setValid({ state: false, msg: formatError(err) });
                setCertificate(null);
            } finally {
                setLoading(false);
            }
        };
        if (hash) {
            setLoading(true);
            _tmp().then(() => setLoading(false));
        }
    }, [hash, verifyHash, formatError]);

    const handleVerifyHash = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { hash } = Object.fromEntries(
                new FormData(e.target).entries()
            );
            const res = await verifyHash(hash);
            if (res) {
                setCertificate(res);
                toast.success("Verification Successful");
                setValid({
                    state: res?.isValid,
                    msg: `Verification Successful. Certificate is ${
                        res?.isValid ? "" : "in"
                    }valid`,
                });
            }
        } catch (err) {
            toast.error("Verification Failed");
            setValid({ state: false, msg: formatError(err) });
            setCertificate(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="centered min-h-screen min-w-[30vw] max-w-[95vw] sm:max-w-[70vw] md:max-w-[50vw] m-auto space-y-4">
            <h2>Verify Certificate</h2>
            <>
                <form onSubmit={handleVerifyHash}>
                    <label>
                        <input
                            name="hash"
                            type="text"
                            defaultValue={hash}
                            placeholder="Enter a hash value to verify..."
                        />
                    </label>
                    <Button
                        type={"submit"}
                        label={"Verify"}
                        loading={loading}
                        style={{ width: "100%" }}
                    />
                </form>
                {loading && (
                    <div className="shimmer animate-pulse certificate_card w-full min-h-[200px]"></div>
                )}
                {!loading && certificate && (
                    <div className="flex flex-col xl:flex-row gap-4">
                        <Image
                            className="rounded-lg h-full w-full"
                            src={getIpfsUrl(certificate?.certificateIpfsUrl)}
                            alt=""
                            width={300}
                            height={300}
                        />
                        <div className="rounded-lg bg-neutral-900/50 p-4 grid grid-cols-2 subtext gap-2 recipient_card">
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
                                <span>
                                    {new Date(
                                        parseInt(
                                            certificate?.issueDate?._hex,
                                            16
                                        ) * 1000
                                    ).toLocaleDateString("en-IN")}
                                </span>
                            </div>
                            <div>
                                <label>Institute Name</label>
                                <span>{certificate?.instituteName}</span>
                            </div>
                        </div>
                    </div>
                )}
            </>
            {!loading && valid && (
                <div
                    className="button"
                    data-type={valid?.state ? "success" : "danger"}
                >
                    {valid?.msg}
                </div>
            )}
        </main>
    );
}

export default Verify;
