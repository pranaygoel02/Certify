import axiosInstance from "@/axios";
import { useEffect, useState } from "react";

function useFetch({ method, url, dependencies = [], body }) {
    const [isFetching, setIsFetching] = useState(false);
    const [data, setData] = useState(null);
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState(null)

    const call = axiosInstance[method]

    useEffect(() => {
        const _tmp = async () => {
            try {
                setIsFetching(true);
                const {data} = await call(url, body)
                setData(data);
            } catch (err) {
                console.log(err);
                setError(err);
                setIsError(true);
            } finally {
                setIsFetching(false);
            }
        };
        _tmp();
    }, [...dependencies]);

    console.log('data', data);

    return {
        data, isFetching, isError, error
    }
}

export default useFetch;
