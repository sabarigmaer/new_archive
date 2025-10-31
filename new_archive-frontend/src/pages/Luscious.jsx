import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import cn from "classnames"
import useView from "../store/view";
import MediaPlayer from "../components/MediaPlayer";

function Gallery() {
  const params = useParams();
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const { view } = useView();
  const loaderRef = useRef(null);
  const itemsPerPage = 50;

  const fetchPictures = useCallback(async (pageNum) => {
    setLoading(true);
    try {   
      const response = await axios.post(import.meta.env.VITE_APP_BACKEND_URL + '/api/luscious', {
        page: pageNum,
        album: params.id
      });

      const data = response.data.data;
      const pictureList = data.picture.list;
      
      if (pageNum === 1) {
        setPictures(pictureList.items);
      } else {
        setPictures(prev => [...prev, ...pictureList.items]);
      }
      
      setHasNextPage(pictureList.info.has_next_page);
      setTotalPages(pictureList.info.total_pages);
      
    } catch (error) {
      console.error("Error fetching pictures:", error);
    }
    setLoading(false);
  }, [params.id, itemsPerPage]);

  useEffect(() => {
    if (params.id) {
      setPictures([]);
      setPage(1);
      fetchPictures(1);
    }
  }, [params.id, fetchPictures]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPictures(nextPage);
    }
  }, [page, hasNextPage, loading, fetchPictures]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasNextPage, loading]);

  const isGrid = view === 'grid';

  const renderPicture = (picture) => {
    // Use video URL if available and animated, otherwise use original image
    const mediaUrl = picture.is_animated && picture.url_to_video 
      ? picture.url_to_video 
      : picture.url_to_original;
    
    return (
      <div key={picture.id} className="min-h-[350px] relative group">
        <MediaPlayer src={mediaUrl} />
        {picture.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm truncate">{picture.title}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        {pictures.length > 0 && `Page ${page} of ${totalPages} - ${pictures.length} pictures loaded`}
      </div>
      <div className={cn("grid-cols-3 gap-4 px-2 pt-2", {'grid': isGrid, 'flex flex-wrap': !isGrid })}>
        {pictures.map(renderPicture)}
      </div>
      {hasNextPage && (
        <div 
          ref={loaderRef} 
          className="h-20 flex items-center justify-center"
        >
          {loading ? 'Loading...' : 'Load more'}
        </div>
      )}
      {!hasNextPage && pictures.length > 0 && (
        <div className="h-20 flex items-center justify-center text-gray-500">
          End of album
        </div>
      )}
    </div>
  );
}

export default Gallery;
