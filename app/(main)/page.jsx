"use client";
import { useUserContext } from "@/context/userContext";
import InstituteAuth from "@/components/Auth/Institute";
import StudentAuth from "@/components/Auth/StudentLogin";
import { FaSchool } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
import Button from "@/components/Button";
import { useStateContext } from "@/context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { FaAngleDoubleDown } from "react-icons/fa";
import { useContractContext } from "@/context/contractContext";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function Unauthenticated() {
    const { connectToMetamask: connect } = useContractContext();
    const {setUser} = useUserContext();

    return (
        <body className={inter.className}>
        <main>
            <Header>
                <Button as="a" href="#get-started" variant='secondary' label={"Get Started"} />
            </Header>
            <div className="p-8 space-y-12 flex flex-col items-center">
                <div
                    id="home-container"
                    className="w-full flex flex-col items-center justify-center gap-8 text-center m-auto py-4 min-h-[70vh]"
                >
                    <h1 className="text-6xl max-w-[60%] font-bold leading-[4.5rem]">
                        Revolutionizing Certificate Validation and Generation
                    </h1>
                    <p className="max-w-[50%] subtext text-lg">
                        Unlock the future of credentials with CertiChain - your
                        one-stop solution for secure and immutable certificate
                        validation and generation. Whether you{`'`}re an
                        educational institution, professional organization, or
                        an individual seeking to verify credentials, CertiChain
                        leverages the power of blockchain technology to ensure
                        transparency, security, and trustworthiness.
                    </p>
                    <Button
                      as={Link}
                      href={"/auth/institute/register"}
                        label={"Register as an institution and get started"}
                    />
                </div>
                <FaAngleDoubleDown className="animate-bounce" />
                <h2>Login to get started</h2>
                <section id="get-started" className="grid md:grid-cols-3 gap-3 w-full m-auto">
                    <button
                        className="login_prompt"
                        onClick={async () => {
                            const res = await connect();
                            setUser({ type: "student" });
                        }}
                    >
                        <PiStudentFill />
                        <p>Login as Student</p>
                    </button>
                    <Link
                        href={"/auth/institute/login"}
                        className="login_prompt"
                        // onClick={() => setSelectedState("institute")}
                    >
                        <FaSchool />
                        <p>Login as Institute</p>
                    </Link>
                    <Link href={"/verify"} className="login_prompt">
                        <FaCircleCheck />
                        <p>Verify Certificate</p>
                    </Link>
                </section>
            </div>
        </main>
        </body>
    );
}

export default Unauthenticated;
