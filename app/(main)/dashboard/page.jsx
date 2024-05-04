"use client";

import Profile from "@/components/Auth/Institute/Profile";
import Button from "@/components/Button";
import CertificateList from "@/components/CertificateList";
import IssueCertificate from "@/components/Institute/IssueCertificate";
import Modal from "@/components/Modal";
import { useStateContext } from "@/context";
import { useUserContext } from "@/context/userContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import { TbRefresh } from "react-icons/tb";
import { resolveMethod } from "thirdweb";
import { useReadContract } from "thirdweb/react";
import { TbFilter } from "react-icons/tb";
import { FaArrowRight } from "react-icons/fa";
import Table from "@/components/Table";
import Badge from "@/components/Badge";
import Link from "next/link";
import Switch from "@/components/Switch";

import { RxTable } from "react-icons/rx";
import { LuLayoutGrid } from "react-icons/lu";
import { GrDocumentMissing } from "react-icons/gr";

export default function Dashboard() {
    const { user } = useUserContext();
    const [open, toggle] = useState(false);
    const {address, contract, toggleValidity, getIpfsUrl} = useStateContext()

    const [showFilters, setShowFilters] = useState(false);
    const [filter,setFilter] = useState(null)

    const filterConfig = [
        {
            title: 'Validity',
            data: [
                {
                    id: 'isValid',
                    type: 'checkbox',
                    label: 'Valid',
                    value: true,
                    defaultChecked: filter?.isValid?.includes(true) || false,
                    onChange: (e) => {
                        console.log(e.target.checked);
                        if(e.target.checked) {
                            setFilter(prev => ({...prev, isValid: [...(prev?.isValid ?? []),e.target.value]}))
                        }
                        else {
                            setFilter(prev => ({...prev, isValid: (prev?.isValid ?? []).filter(d => d !== e.target.value)}))
                        }
                    }
                },
                {
                    id: 'isValid',
                    type: 'checkbox',
                    label: 'Invalid',
                    value: false,
                    defaultChecked: filter?.isValid?.includes(false) || false,
                    onChange: (e) => {
                        if(e.target.checked) {
                            setFilter(prev => ({...prev, isValid: [...(prev?.isValid ?? []),e.target.value]}))
                        }
                        else {
                            setFilter(prev => ({...prev, isValid: (prev?.isValid ?? []).filter(d => d !== e.target.value)}))
                        }
                    }
                }
            ]
        },
        {
            title: 'Time Range',
            data: [
                {
                    type: 'date',
                    label: 'From',
                    id: 'from',
                    value: filter?.date?.fromDate ?? new Date().toJSON().slice(0,10),
                    onChange: (e) => {
                        setFilter(prev => ({...prev, issueDate: {...(prev?.issueDate ?? {}),fromDate: e.target.value}}))
                    }
                },
                {
                    type: 'date',
                    label: 'To',
                    id: 'to',
                    value: filter?.date?.toDate ?? new Date().toJSON().slice(0,10),
                    onChange: (e) => {
                        setFilter(prev => ({...prev, issueDate: {...(prev?.issueDate ?? {}),toDate: e.target.value}}))
                    }
                }
            ]
        }
    ]

    const { data: certificates, isLoading: loading, isError, refetch, isRefetching, isFetching } = useReadContract({ 
      contract, 
      method: resolveMethod(user?.type === 'institute' ? "getInstituteCertificates" : 'getStudentCertificates'), 
      params:  user?.type === 'institute' ? [user.registration_id] : [address]
    });

    const tableColums = {
        isValid: (d, certi) => user?.type === 'institute' ? <Switch on={d} toggle={async (e) => {
            e.preventDefault()
            console.log(certi.hash);
            await toggleValidity({_certificateHash: certi.hash,_instituteRegistrationId: user?.registration_id})
        }}/> : <Badge.Validity isValid={d}/>,
        issueDate: (d) => new Date(parseInt(d) * 1000).toLocaleDateString('en-IN'),
        recipientAddress: (d) => <Badge.Address address={d}/>,
        certificateIpfsUrl: (d) => <Link href={getIpfsUrl(d)} target="_blank">Link</Link>,
        qrIpfsUrl: (d) => <Link href={getIpfsUrl(d)} target="_blank">Link</Link>,
        hash: (d) => <Badge style={{fontSize: '0.75em'}}>{d}</Badge>
    }


    const filteredCertificates = useMemo(() => {
        if(!filter) return certificates?.length > 0 ? certificates : null
        console.log(filter);
        return certificates.filter(certi => {
            const validity = (filter?.isValid ?? []).length > 0 ? filter?.isValid : ['true', 'false']
            const fromDate = filter?.issueDate?.fromDate ? new Date(filter?.issueDate.fromDate) : new Date(0)
            const toDate = filter?.issueDate?.toDate ? new Date(filter?.issueDate?.toDate) : new Date()
            const _issueDate = new Date(parseInt(certi.issueDate) * 1000)
            const certificateIssueDateInRange = _issueDate >= fromDate && _issueDate <= toDate;
            console.log(fromDate, _issueDate, toDate);
            return validity.includes(String(certi.isValid)) && certificateIssueDateInRange;
        })
    }, [filter, certificates])

    console.log(filteredCertificates);

    const [view, toggleView] = useState('grid')

    if (!(loading || isFetching || isRefetching) && (filteredCertificates?.length === 0 || !filteredCertificates) && (certificates?.length === 0 || !certificates))
        return (
            <section className="w-full grid place-items-center place-content-center min-h-[70vh] text-4xl gap-4 opacity-70">
                <GrDocumentMissing />
                <p className="subtext">
                    No certificates were issued by this institute yet
                </p>
                {user?.type === 'institute' && <Button
                        onClick={() => toggle(true)}
                        variant="secondary"
                        label={
                            <>
                                <IoIosAdd />
                                <span>Issue certificate</span>
                            </>
                        }
                    />}
            </section>
        );

    return (
        <>
            <div className={`p-4 ${showFilters ? 'scale-95 opacity-85' : 'scale-100 opacity-100'} transition-all duration-300`}>
                <div className="flex w-full items-center justify-between">
                    <div>
                        <h2>Issued Certificates</h2>
                    </div>
                    <div className="flex align-center gap-4"> 
                    <div className="flex items-center bg-neutral-900 p-1 rounded-lg">
                        <Button variant={view === 'grid' ? 'neutral' : 'ghost'} onClick={() => toggleView('grid')} label={<LuLayoutGrid size={18}/>} />
                        <Button variant={view === 'table' ? 'neutral' : 'ghost'} onClick={() => toggleView('table')} label={<RxTable size={18}/>} />
                    </div>
                    <Button
                        onClick={() => setShowFilters(prev => !prev)}
                        variant="ghost"
                        label={
                            <>
                                <TbFilter />
                                <span>Filters</span>
                            </>
                        }
                    />
                    <Button
                        onClick={refetch}
                        variant="neutral"
                        label={
                            <>
                                <TbRefresh />
                                <span>Refresh</span>
                            </>
                        }
                    />
                    {user?.type === 'institute' && <Button
                        onClick={() => toggle(true)}
                        variant="secondary"
                        label={
                            <>
                                <IoIosAdd />
                                <span>Issue certificate</span>
                            </>
                        }
                    />}
                    </div>
                </div>
                {isError && <p>Something went wrong</p>}
                {
                    view === 'grid' ? <CertificateList certificates={filteredCertificates} loading={loading || isFetching || isRefetching} /> : (filteredCertificates ? <Table title='All Certificates' data={filteredCertificates} getHeader={() => {}} getColumn={tableColums}/> : null)
                }
            </div>
            {showFilters && <aside className="space-y-4 p-4 fixed right-0 top-0 z-20 h-screen w-screen md:max-w-[30vw] bg-black/90 backdrop-blur-sm border border-neutral-900">
                    <header className="inline-flex w-full items-center justify-between">
                        <h2>Filters</h2>
                        <Button variant="neutral" label={<><span>Close</span><FaArrowRight/></>} onClick={() => setShowFilters(false)}/>
                    </header>
                    <form>
                        {
                            filterConfig?.map((f,i) => {
                                return (
                                    <fieldset className="space-y-2" key={i}>
                                        <legend>{f.title}</legend>
                                        <div className="flex flex-wrap gap-4">
                                        {
                                            f.data?.map((d,j) => {
                                                const isCheckboxOrRadio = ['checkbox', 'radio'].includes(d.type);
                                                return (
                                                    <label key={j}>
                                                        {!isCheckboxOrRadio && d.label}
                                                        <input
                                                            onChange={d.onChange}
                                                            type={d.type}
                                                            id={d.id}
                                                            name={d.id}
                                                            defaultValue={d.value}
                                                        />
                                                        {isCheckboxOrRadio && d.label}
                                                    </label>
                                                )
                                            })
                                        }
                                        </div>
                                    </fieldset>
                                )
                            })
                        }
                        {/* <Button
                            type={"submit"}
                            label={"Apply"}
                            style={{ width: "100%" }}
                        /> */}
                    </form>
                    </aside>}
            {user?.type === 'institute' && 
            <>
            <Modal title='Issue Certificate' open={open} toggle={toggle}>
                <IssueCertificate cb={refetch}/>
            </Modal>            
            </>
            }
        </>
    );
}
