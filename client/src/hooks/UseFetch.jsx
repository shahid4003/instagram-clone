import { useEffect, useState } from "react";
import api from "../utils/api";

const useFetch = ({
  url,
  immediate = true,
}) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(url);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, loading, error };
};

export default useFetch;
