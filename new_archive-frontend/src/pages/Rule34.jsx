import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import cn from "classnames"
import useView from "../store/view";

function Gallery() {
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { view } = useView();
  const loaderRef = useRef(null);
  const itemsPerPage = 5;
  const [tags, setTags] = useState(new Set())
  const [selectedTags, setSelectedTags] = useState([])
  const [ended, setEnded] = useState(false) 

  // Effect to reset data when tags change
  useEffect(() => {
    setFiles([]);
    setPage(1);
    setEnded(false);
  }, [params.id, selectedTags]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log(params)
      try {
        const response = await axios.get(
          import.meta.env.VITE_APP_BACKEND_URL + `/api/rule34?tags=${params.id}&page=${page}`
        );
        if(!response.data) setEnded(true)
        // response.data is the array of files
        setFiles((prev) => [...prev, ...response.data]);
        response.data.forEach(e => {
          setTags((prev) => new Set([...prev, ...e.tags]))
        })

      } catch (error) {
        console.error("Error fetching gallery:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [params.id, page, selectedTags]);

  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !ended) {
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

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev.filter(e => e != tag)])
    } else {
      setSelectedTags( prev => [...prev, tag])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {
          [...tags].map((e) => <div className={selectedTags.includes(e) && 'text-green-700'} onClick={() => handleTagToggle(e)}>{e}</div>)
        }
      </div>
      <div className={cn("grid-cols-3 gap-4 px-2 pt-2", {'grid': isGrid, 'flex flex-wrap': !isGrid })}>
        {files
          .filter((file, idx, arr) => arr.findIndex(f => f.id === file.id) === idx)
          .map((file) => {
            const ext = file.file_url.split('.').pop()?.toLowerCase();
            if (ext === 'mp4' || ext === 'webm' || ext === 'mov') {
              return (
                <div key={file.id} className="min-h-[350px]">
                  <video
                    src={file.file_url}
                    controls
                    // style={{ maxWidth: '100%', maxHeight: '350px' }}
                    autoPlay
                  />
                </div>
              );
            } else if (ext === 'gif') {
              return (
                <div key={file.id} className="min-h-[350px]">
                  <img
                    src={file.file_url}
                    alt={file.tags}
                    loading="lazy"
                    // style={{ maxWidth: '100%', maxHeight: '350px' }}
                  />
                </div>
              );
            } else {
              return (
                <div key={file.id} className="min-h-[350px]">
                  <img
                    src={file.file_url}
                    alt={file.tags}
                    loading="lazy"
                    // style={{ maxWidth: '100%', maxHeight: '350px' }}
                  />
                </div>
              );
            }
          })}
      </div>
      <div 
        ref={loaderRef} 
        className="h-20 flex items-center justify-center"
      >
        {loading ? 'Loading...' : ''}
      </div>
    </div>
  );
}

export default Gallery;
