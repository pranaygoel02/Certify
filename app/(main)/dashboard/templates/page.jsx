"use client";

import axiosInstance from "@/axios";
import Button from "@/components/Button";
import Certificate from "@/components/Certificate";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import { useStateContext } from "@/context";
import { useUserContext } from "@/context/userContext";
import useFetch from "@/hooks/useFetch";
import { urltoFile } from "@/utils/convertToBase64";
import html2canvas from "html2canvas";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaRegFileExcel } from "react-icons/fa";
import { GrDocumentMissing } from "react-icons/gr";
import { IoIosAdd } from "react-icons/io";
import * as XLSX from "xlsx";

function Templates() {
    const { user } = useUserContext();
    const {bulkAddCertificates} = useStateContext()

    const {
        data: templates,
        isError,
        isFetching,
    } = useFetch({
        method: "get",
        url: "/institution/template",
        body: {
            params: {
                id: user?.registration_id,
            },
        },
    });

    const [selectedTab, setSelectedTab] = useState("Templates");
    
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [excelFile, setExcelFile] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [selectedData, setSelectedData] = useState(null)

    const [generate,setGenerate] = useState(false)
    const [certificateImages, setCertificateImages] = useState([])
    const [idx, setIdx] = useState(0)

    const [openModal, toggleOpenModal] = useState(false)


    useEffect(() => {
        setSelectedTemplate(templates?.[0]);
    }, [templates]);

    console.log(templates, isFetching, isError, selectedTemplate);

    const csvRef = useRef(null);

    const handleFile = (e) => {
        let file = e.target.files[0];
        // if(file && fileType.includes(file.type)){
        console.log(file.type);
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
            setExcelFile((prev) => e.target.result);
            const workbook = XLSX.read(e.target.result, { type: "buffer" });
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const worksheetData = XLSX.utils.sheet_to_json(worksheet);
            setExcelData((prev) => worksheetData?.map(d => ({
                select: false,
                ...d
            })));
            setSelectedData(worksheetData?.[0])
        };
        // }
        // else{
        //   alert('please select excel file only')
        //   setExcelFile(prev=>null)
        // }
    }

    function handleGenerateCertificates() {
        // use selected template and excel data and #certificate
        setGenerate(true)
        setIdx(0)
        toggleOpenModal(true)
    }

    useEffect(() => {
        setSelectedData(excelData?.[idx])
    },[idx, excelData])

    const generateCertificateImage = async (ele) => {
        return new Promise((resolve, reject) => {
        html2canvas(ele, {
            allowTaint: true,
            useCORS: true,
            scale: 2
        }).then(data => {
            const base64 = data.toDataURL()
            resolve(base64)
        })
    })
    }

    useEffect(() => {
        const certificate = document.getElementById('certificate')
        if(generate) {
            generateCertificateImage(certificate).then(img => setCertificateImages(prev => [...prev, img]))
            if(idx + 1 < excelData?.length) setIdx(prev => prev + 1)
            else setGenerate(false)
        }
    },[selectedData, generate])

    const handleUploadCertificateImages = async () => {
        try {
            console.log(certificateImages);
            const res = await Promise.all(certificateImages?.map((uri, i) => {
                const obj = excelData[i]
                const fileName = `${obj.course_name}_${obj.course_id}_${obj.name}_${obj.blockchain_addr}.png`
                return urltoFile(uri,fileName,'image/png')
            }))
            console.log(res);
            await bulkAddCertificates(res,user?.name,user?.registration_id)
        }
        catch(err) {
            console.log(err);
        }
        finally {
            toggleOpenModal(false)
        }
    }

    if (!isFetching && (templates?.length === 0 || !templates))
    return (
        <section className="w-full grid place-items-center place-content-center min-h-[70vh] text-4xl gap-4 opacity-70">
            <GrDocumentMissing />
            <p className="subtext">
                No templates were found
            </p>
            {user?.type === 'institute' && <Link
                    className="flex items-center gap-1 subtext"
                    href={'/dashboard/builder'}
                ><IoIosAdd />
                <span className="">Build a new template</span></Link>}
        </section>
    );

    return (
        <>
        <div className="w-full h-full flex-1 overflow-hidden">
            <main className="grid grid-cols-5 h-full overflow-hidden">
                <aside className="border-r-[1px] border-neutral-800 flex flex-col col-span-1 h-full">
                    <div className="flex items-center gap-2 border-b-[1px] border-neutral-800 p-2">
                        {["Templates", "XLSX"]?.map((d) => (
                            <Button
                                onClick={() => setSelectedTab('Templates' === selectedTab ? 'XLSX' : 'Templates')}
                                key={d}
                                variant={
                                    selectedTab === d ? "neutral" : "ghost"
                                }
                                label={d}
                            />
                        ))}
                    </div>
                    {selectedTab === "XLSX" ? (
                        <>
                            <div className="p-2">
                                <input
                                    type="file"
                                    onChange={handleFile}
                                    accept={
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                                    }
                                    style={{
                                        display: "none",
                                    }}
                                    ref={csvRef}
                                />
                                <article>
                                    <Button
                                        variant="neutral"
                                        style={{
                                            width: "100%",
                                        }}
                                        onClick={() => {
                                            csvRef.current.click();
                                        }}
                                        label={
                                            <>
                                                <FaRegFileExcel size={18} />
                                                <span>Upload XLSX</span>
                                            </>
                                        }
                                    />
                                </article>
                            </div>
                            {excelData?.length > 0 && (
                                <ExcelTable selectedData={selectedData} setSelectedData={setSelectedData} data={excelData} />
                            )}
                        </>
                    ) : (
                        selectedTab === "Templates" && (
                            <div className="p-2">
                            <TemplateList
                                templates={templates}
                                selectedTemplate={selectedTemplate}
                                setSelectedTemplate={setSelectedTemplate}
                            />
                            </div>
                        )
                    )}
                </aside>
                <div className="w-full col-span-4">
                    <div className="w-full p-2 flex items-center justify-end gap-2 border-b-[1px] border-neutral-800 text-lg">
                        <Link
                            href={'/dashboard/builder'}
                            className={"w-full button"}
                            data-variant="neutral"
                        >Build a new template</Link>
                        {excelData?.length > 0 && <Button
                            className={"w-full"}
                            label={"Generate Certificates"}
                            variant="secondary"
                            onClick={handleGenerateCertificates}
                        />}
                    </div>
                    <section className="relative bg-neutral-900/50 w-full h-full p-8 overflow-auto max-h-[87vh]">
                        {selectedTemplate && (
                            <Certificate
                                mappingData={selectedData}
                                {...selectedTemplate?.bg}
                                assets={selectedTemplate?.assets}
                            />
                        )}
                    </section>
                </div>
            </main>
        </div>
        <Modal open={openModal} toggle={toggleOpenModal} footer={<Button disabled={certificateImages?.length !== excelData?.length} onClick={handleUploadCertificateImages} label={<>Upload Certificates</>} style={{width: '100%'}}/>}>
            <ul className="grid grid-cols-2 gap-2">
                {certificateImages?.map(img => <li className={`w-full h-full object-contain overflow-hidden cursor-pointer hover:opacity-70 transition-all rounded-lg`} key={img}><img className="w-full h-full" src={img} /></li>)}
            </ul>
        </Modal>
        </>
    );
}

const TemplateList = ({ templates, setSelectedTemplate, selectedTemplate }) => {
    return (
        <ul className="space-y-1">
            {templates?.map((template, i) => {
                return (
                    <li key={template}>
                        <div
                            onClick={() => setSelectedTemplate(template)}
                            className={`p-4 rounded-lg cursor-pointer ${
                                selectedTemplate === template
                                    ? "bg-white text-black"
                                    : "bg-neutral-800"
                            }`}
                        >
                            {template?.name ?? `Template ${i + 1}`}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

function ExcelTable({ data, selectedData, setSelectedData=()=>{} }) {
    console.log(data);

    const getColumn={
        select: (d, data) => <input type="checkbox" onChange={(e) => {
            if(e.target.checked) {
                setSelectedData((prev) => data)
            }
        }} checked={data === selectedData}/>
    }

    return <Table getColumn={getColumn} searchable={false} pagination={false} data={data} rounded={false}/>;
}

export default Templates;
