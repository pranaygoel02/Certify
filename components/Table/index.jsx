import { useUserContext } from "@/context/userContext";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import Badge from "../Badge";
import { IoSearchOutline } from "react-icons/io5";
import Button from "../Button";
import convertToSplitWords from '@/utils/convertToSplitWords'

const instituteRedundantHeaders = ["instituteName", "instituteRegistrationId"];

function Table({ data, title = "", getColumn, searchable = true, pagination = true, rounded=true }) {
    const { user } = useUserContext();

    console.log(data);

    let headers = Object.keys(data?.[0] ?? {});

    if (user?.type === "institute") {
        headers = headers.filter((h) => !instituteRedundantHeaders.includes(h));
    }

    console.log(headers);

    const [searchTerm, setSearchTerm] = useState(null)
    const [listSize, setListSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)

    const {filteredData, pages } = useMemo(() => {
        if(!searchable) return data
        const newData = data?.filter(d => {
            const values = Object.values(d).join(', ').toLowerCase();
            return values.includes(searchTerm?.trim().toLowerCase() ?? '')
        })
        return {
            filteredData: newData,
            listSize: newData?.length?? 0,
            pages: Math.ceil(newData?.length / listSize)
        }
    },[data, searchTerm, searchable, listSize])

    const handlePageChange = (page) => {
        setCurrentPage(page)
    }

    const pageList = useMemo(() => {
        const lastIndex = listSize * (currentPage - 1)
        return filteredData?.slice(lastIndex, listSize + lastIndex)
    },[filteredData, currentPage, listSize])

    if (!data) return null;

    return (
        <>
        {searchable && <div className="relative float-right mb-4">
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type='text' placeholder="Search anything from the table..." className="pl-8 w-full min-w-[30vw]"/>
            <IoSearchOutline size={16} className="absolute left-2 top-0 h-full"/>
        </div>}
        <div className={`relative overflow-x-auto shadow-md ${rounded ? 'rounded-lg' : ''} w-full `}>
            <table
                className="w-full text-sm text-left rtl:text-right overflow-x-auto text-neutral-500 dark:text-neutral-400 table-auto rounded-lg"
                style={{
                    borderCollapse: "separate !important",
                }}
            >
                <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-400">
                    <tr>
                        {headers.map((h, i) => (
                            <th scope="col" className="px-6 py-3" key={h}>
                                <div className="flex items-center whitespace-nowrap">{convertToSplitWords(h)}</div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {(pagination ? pageList : data)?.map((row, i) => (
                        <tr
                            key={`row_${i}`}
                            className="bg-white border-b dark:bg-neutral-900 dark:border-neutral-800"
                        >
                            {Object.entries(row).map((cell, j) =>
                                headers.includes(cell[0]) ? (
                                    <td className="px-6 py-4" key={j}>
                                        {getColumn?.[cell[0]]?.(cell[1], row) ??
                                            cell[1]}
                                    </td>
                                ) : null
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
       {pagination && <div className="flex items-center justify-between py-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing {filteredData?.length?? 0} of {data?.length?? 0} entries
            </p>
            <div className="flex gap-1 items-center text-sm text-neutral-500 dark:text-neutral-400">
                Page&nbsp;
                {
                    Array.from({length: pages}).map((_, i) => <Button variant={currentPage === i + 1 ? 'neutral' : 'ghost'} key={`page${i + 1}`} onClick={() => handlePageChange(i + 1)} label={i + 1}/>)
                }
            </div>
        </div>}
        </>
    );
}

export default Table;
