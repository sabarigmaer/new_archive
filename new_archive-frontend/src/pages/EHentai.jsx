import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router";
import cn from "classnames"
import useView from "../store/view";
import MediaPlayer from "../components/MediaPlayer";
import { likeGallery } from "../api";

function EHentai() {
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [displayedFiles, setDisplayedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { view } = useView();
  const loaderRef = useRef(null);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/ehentai/" + params.id
        );
        setFiles(response.data.files.images);
        setDisplayedFiles(response.data.files.images.slice(0, itemsPerPage));
      } catch (error) {
        console.error("Error fetching EHentai:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newItems = files.slice(startIndex, endIndex);
    
    if (newItems.length > 0) {
      setDisplayedFiles(prev => [...prev, ...newItems]);
      setPage(nextPage);
    }
  }, [files, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, loading]);

  const isGrid = view === 'grid';
  const likeThisGallery = useCallback( () => likeGallery(params.id) , [])
  
  return (
    <div>
      <div className="bottom-0 right-0 fixed z-10 p-2 text-2xl text-white bg-red-600 rounded-2xl m-1">
        <button onClick={likeThisGallery}>Like</button>
      </div>
      <div className={cn("grid-cols-3 gap-4 px-2 pt-2", {'grid': isGrid, 'flex flex-wrap': !isGrid })}>
        {displayedFiles.map((file) => (
          <div key={file} className="min-h-[350px] relative group">
            <MediaPlayer src={ import.meta.env.VITE_APP_BACKEND_URL + "/api/proxy?link=" +file} />
          </div>
        ))}
      </div>
      {displayedFiles.length < files.length && (
        <div 
          ref={loaderRef} 
          className="h-20 flex items-center justify-center"
        >
          {loading ? 'Loading...' : ''}
        </div>
      )}
    </div>
  );
}

export default EHentai;
