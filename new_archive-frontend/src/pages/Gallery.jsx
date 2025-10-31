import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams } from "react-router";
import cn from "classnames"
import useView from "../store/view";
import MediaPlayer from "../components/MediaPlayer";
import { likeGallery } from "../api";

function Gallery() {
  const params = useParams();
  const [searchParams] = useSearchParams()
  const [files, setFiles] = useState([]);
  const [displayedFiles, setDisplayedFiles] = useState([]);
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { view } = useView();
  const loaderRef = useRef(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch gallery files
        const filesResponse = await axios.get(
          import.meta.env.VITE_APP_BACKEND_URL + "/api/galleries/" + params.id + '?' + window.location.search
        );
        setFiles(filesResponse.data);
        setDisplayedFiles(filesResponse.data.slice(0, itemsPerPage));

        // Fetch gallery information
        const galleryResponse = await axios.get(
          import.meta.env.VITE_APP_BACKEND_URL + "/api/galleries"
        );
        const currentGallery = galleryResponse.data.find(g => g.id === Number(params.id));
        setGallery(currentGallery);
      } catch (error) {
        console.error("Error fetching gallery:", error);
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

  const handleLike = async (fileId) => {        
      const response = await axios.post(import.meta.env.VITE_APP_BACKEND_URL + `/api/files/${fileId}/like`);

      const newState = displayedFiles.map(file => {
        
        if(fileId == file.id) return {
          ...file,
          likes: Number(file.likes) + 1
        }

        return file
      })
      setDisplayedFiles(newState);
  };

  const handleGalleryLike = async () => {
    try {
      const response = await likeGallery(params.id);
      setGallery(prev => ({
        ...prev,
        likes: response.data.likes
      }));
    } catch (error) {
      console.error("Error liking gallery:", error);
    }
  };

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
      {/* Gallery Header with Like Button */}
      {gallery && (
        <div className="px-4 py-4 bg-white border-b border-gray-200 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{gallery.title}</h1>
              {gallery.description && (
                <p className="text-gray-600 mt-1">{gallery.description}</p>
              )}
            </div>
            <button
              onClick={handleGalleryLike}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <span className="text-xl">💖</span>
              <span className="font-medium">
                {gallery.likes || 0}
              </span>
              <span className="text-sm">likes</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Files Grid */}
      <div className={cn("grid-cols-3 gap-4 px-2 pt-2", {'grid': isGrid, 'flex flex-wrap': !isGrid })}>
        {displayedFiles.map((file) => (
          <div key={file.id} className="min-h-[350px] relative group">
            <MediaPlayer src={file.url} />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <button
                onClick={() => handleLike(file.id)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200",
                  "bg-black bg-opacity-50 text-white hover:bg-opacity-70",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  { "animate-pulse": file.likes }
                )}
              >
                <span className="text-lg">❤️</span>
                <span className="text-sm font-medium">
                  {file.likes || 0}
                </span>
              </button>
            </div>
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

export default Gallery;
