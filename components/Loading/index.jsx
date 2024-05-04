"use client";
import { useUserContext } from "@/context/userContext";
import InstituteAuth from "@/components/Auth/Institute";
import StudentAuth from "@/components/Auth/StudentLogin";
import { useState } from "react";
import { FaSchool } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
import Button from "../Button";
import { useStateContext } from "@/context";
import Link from "next/link";

function Unauthenticated({selectedState, setSelectedState}) {
    const { userLoggedIn, setUser } = useUserContext();
    const {connectToMetamask:connect} = useStateContext()

    return (
        <div className="px-8">
            <section className={`${selectedState ? 'centered min-h-screen max-w-[50vw] min-w-[30vw]' : ''} py-16 space-y-4 m-auto`}>
                {!userLoggedIn && !selectedState && (
                    <section className="grid grid-cols-3 gap-3 w-full">
                        <button
                            className="login_prompt"
                            onClick={() => setSelectedState("institute")}
                        >
                            <FaSchool />
                            <p>Login as Institute</p>
                        </button>
                        <button
                            className="login_prompt"
                            onClick={async () => {
                                const res = await connect()
                                setUser({type: 'student'})
                            }}
                        >
                            <PiStudentFill />
                            <p>Login as Student</p>
                        </button>
                        <button onClick={() => setSelectedState('verify')} className="login_prompt">
                            <FaCircleCheck />
                            <p>Verify Certificate</p>
                        </button>
                    </section>
                )}
                {selectedState === "institute" && <InstituteAuth />}
                {selectedState === "student" && <StudentAuth />}
                {selectedState && (
                    <Button
                        className="w-full"
                        data-type="secondary"
                        onClick={() => setSelectedState(null)}
                        label={"Back"}
                    />
                )}
            </section>
            {!selectedState && <div className="space-y-12">
                <div
                    id="home-container"
                    className="w-full flex flex-col items-start justify-center gap-8"
                >
                    <h1 className="text-6xl max-w-[50%] font-bold">
                        Your Voice, Your Vote, Your Future - Secured by the
                        Blockchain!
                    </h1>
                    <p className="max-w-[60%]">
                        At the Decentralized Voting and Election Commission, we
                        embrace the power of Web3 technology to revolutionize
                        democracy. We are committed to providing a trustless,
                        transparent, and tamper-proof voting platform,
                        empowering citizens like you to participate in shaping
                        the future of our decentralized world.
                    </p>
                </div>
                <div className="bg-secondary p-12 rounded-xl inline-flex gap-8">
                    <h1 className="text-5xl font-bold leading-[3.5rem] border-r border-muted-foreground">
                        Join Us in Reinventing Democracy
                    </h1>
                    <div className="space-y-4 text-base">
                        <p className="">
                            Together, let&apos;s redefine democracy for the
                            digital age. Join the movement towards a fairer,
                            more transparent, and inclusive society. Embrace
                            Web3 voting and let your voice be heard louder than
                            ever before.
                        </p>
                        <hr className="border-muted-foreground w-full" />
                        <p className="">
                            Register now and become a pioneer in the future of
                            decentralized governance.
                        </p>
                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Unauthenticated;
