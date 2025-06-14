import { useState, useEffect } from "react";

export default function useFetch(url, method = 'GET') {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setError('');
      setLoading(true);

      try {        
        const response = await fetch(url, {
          credentials: 'include',
          method
        });

        if (!response.ok) {
          throw new Error("Error fetching data");
        }

        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "An error occurred");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, method]);

  return { data, error, loading };
}
