"use client";

import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Table from "@/components/Table";
import { useStateContext } from "@/context";
import { useUserContext } from "@/context/userContext";
import { formatFileSize } from "@/utils/formatFileSize";
import { removeFileExtension } from "@/utils/removeFileExtension";
import Link from "next/link";
import { useState } from "react";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { FaFileAlt } from "react-icons/fa";
import { FaFileImport, FaRegFileImage } from "react-icons/fa6";
import { FiDelete } from "react-icons/fi";
import { TbWorldUpload } from "react-icons/tb";

function Page() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const { bulkAddCertificates } = useStateContext();
    const { user } = useUserContext();

    const handleFileChange = (event) => {
        const fileList = event.target.files;
        const fileArray = Array.from(fileList);
        console.log(fileArray);
        setFiles(fileArray.filter((file) => file.type.length > 0));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await bulkAddCertificates(
                files,
                user?.name,
                user?.registration_id
            );
            console.log(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const columns = {
        action: (d) => (
            <Button
                variant="neutral"
                onClick={() =>
                    setFiles((prev) => [
                        ...prev.slice(0, d),
                        ...prev.slice(d + 1),
                    ])
                }
                label={<AiFillDelete />}
            />
        ),
        recipientAddress: (d) => <Badge.Address address={d}/>
    };

    return (
        <main className={`${files?.length > 0 ? '' : 'centered'} min-h-[90vh] max-h-[90vh] p-4`}>
            <Dropzone
                onDrop={(files) =>
                    setFiles((prev) => [
                        ...new Set([...(prev ?? []), ...files]),
                    ])
                }
            >
                {({ getRootProps, getInputProps }) => (
                    <div
                        className={`bg-neutral-900/60 transition-all p-4 lg:p-8 rounded-lg border-[1px] border-neutral-500 border-dashed grid place-items-center place-content-center gap-4 sticky top-0 ${files?.length > 0 ? 'min-h-[150px] w-full' : 'min-h-[300px]'}`}
                        {...getRootProps()}
                    >
                        <FaFileImport size={32} />
                        <input {...getInputProps()} />
                        <p className="subtext">
                            Drag and drop some files here, or click to select
                            files
                        </p>
                        <p className="subtext">File name format: {'<'}Course Name{'>'}_{'<'}Course Id{'>'}_{'<'}Recipient Name{'>'}_{'<'}Recipient Blockchain Address{'>'}</p>
                    </div>
                )}
            </Dropzone>
            <p className="subtext text-center py-4">or use an existing <Link href={'/dashboard/templates'}>template</Link></p>
            <section className={`w-full mt-4`}>
            <Table
                searchable={false}
                pagination={false}
                data={files?.map((file, index) => {
                    const [courseName, courseId, recipientName, recipientAddress] = removeFileExtension(file.name).split('_')
                    if(!courseName || !courseId || !recipientName || !recipientAddress) {
                      toast.error(`${file.name} has the wrong naming format`)
                      return null
                    }
                    return {
                      recipientName,
                      recipientAddress,
                      courseName,
                      courseId,
                      type: file.type,
                      size: formatFileSize(file.size),
                      action: index,
                    }
                }).filter(file => file !== null)}
                getColumn={columns}
            />
            </section>
            {files?.length > 0 && <Button className='m-auto mt-4' loading={loading} onClick={handleSubmit} variant="secondary" label={<><TbWorldUpload size={18} /><span>Upload</span></>}/>}
            {/* <ul className="space-y-2">
                {files.map((file, index) => (
                    <li key={index}><File file={file} index={index} setFiles={setFiles}/></li>
                ))}
            </ul> */}
        </main>
    );
}

function File({ file, index, setFiles }) {
    return (
        <div className="bg-neutral-800 rounded flex items-center justify-between gap-2 p-4 w-full">
            <FaFileAlt size={28} />
            <p className="subtext flex-1">{file.name}</p>
            <p className="subtext">{file.type}</p>
            <Button
                variant="neutral"
                onClick={() =>
                    setFiles((prev) => [
                        ...prev.slice(0, index),
                        ...prev.slice(index + 1),
                    ])
                }
            >
                <FiDelete size={28} />
            </Button>
        </div>
    );
}

export default Page;
