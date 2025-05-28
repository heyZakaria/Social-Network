import { useEffect, useState } from "react";

export default function useFetch(url, options = {credentials: 'include',}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(url, options);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const json = await res.json();
        if (isMounted) {
          setData(json?.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setData(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [url]);
  console.log(data);
  
  return { data, loading, error };
}
