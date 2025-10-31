import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { saveToIndexedDB, getFromIndexedDB } from '../utils/indexedDB';
import { posts } from "rule34js";
import MediaPlayer from '../components/MediaPlayer';
import { imageExtensions, videoExtensions, gifExtensions } from '../constants';

function Upload() {
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [visibleGroups, setVisibleGroups] = useState(10);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState(new Set());
    const [groupedFiles, setGroupedFiles] = useState({});
    const [originalSizeGroups, setOriginalSizeGroups] = useState(new Set());
    const [previewState, setPreviewState] = useState({
        isOpen: false,
        currentGroup: null,
        currentIndex: 0
    });
    
    useEffect(() => {
        posts({ tags: ['optimystic']}).then(console.log)
        const fetchData = async () => {
            try {

                // If no cached data, fetch from API
                const { data } = await axios.get(
                    `https://archive.org/metadata/${params.id}`
                );
                
                // Filter media files (images, videos, gifs)
                const allMediaExtensions = [...imageExtensions, ...videoExtensions, ...gifExtensions];
                const fileList = data.files
                    .map(e => e.original || e.name)
                    .filter(file => {
                        const lowerFile = file.toLowerCase();
                        const extension = lowerFile.split('.').pop();
                        return allMediaExtensions.includes(extension);
                    });
                
                // Group files by their parent directory
                const groups = fileList.reduce((acc, file) => {
                    const parts = file.split('/');
                    const group = parts.length > 1 ? parts.slice(0, -1).join('/') : 'root';
                    if (!acc[group]) {
                        acc[group] = [];
                    }
                    acc[group].push(file);
                    return acc;
                }, {});
                
                // Save to IndexedDB
                await saveToIndexedDB(params.id, { groups, fileList });
                
                setGroupedFiles(groups);
                setFiles(fileList);
            } catch (error) {
                console.error('Error fetching data:', error);
                
                // Try to get data from IndexedDB as fallback
                try {
                    const cachedData = await getFromIndexedDB(params.id);
                    if (cachedData) {
                        setGroupedFiles(cachedData.groups);
                        setFiles(cachedData.fileList);
                    }
                } catch (dbError) {
                    console.error('Error accessing cached data:', dbError);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 100
            ) {
                setVisibleGroups(prev => prev + 5);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupName)) {
                newSet.delete(groupName);
            } else {
                newSet.add(groupName);
            }
            return newSet;
        });
    };

    const toggleOriginalSize = (groupName) => {
        setOriginalSizeGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupName)) {
                newSet.delete(groupName);
            } else {
                newSet.add(groupName);
            }
            return newSet;
        });
    };

    const openPreview = (groupName, index) => {
        setPreviewState({
            isOpen: true,
            currentGroup: groupName,
            currentIndex: index
        });
    };

    const closePreview = () => {
        setPreviewState({
            isOpen: false,
            currentGroup: null,
            currentIndex: 0
        });
    };

    const navigatePreview = (direction) => {
        if (!previewState.currentGroup) return;
        
        const currentFiles = groupedFiles[previewState.currentGroup];
        let newIndex = previewState.currentIndex + direction;
        
        if (newIndex < 0) {
            newIndex = currentFiles.length - 1;
        } else if (newIndex >= currentFiles.length) {
            newIndex = 0;
        }
        
        setPreviewState(prev => ({
            ...prev,
            currentIndex: newIndex
        }));
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!previewState.isOpen) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    navigatePreview(-1);
                    break;
                case 'ArrowRight':
                    navigatePreview(1);
                    break;
                case 'Escape':
                    closePreview();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [previewState.isOpen, previewState.currentGroup, previewState.currentIndex]);

    if (loading) {
        return (
            <div className="container mx-auto px-8 py-8">
                <div className="text-center text-gray-600 text-lg">Loading files...</div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-8">
            {previewState.isOpen && previewState.currentGroup && (
                <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Close button */}
                        <button
                            onClick={closePreview}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation buttons */}
                        <button
                            onClick={() => navigatePreview(-1)}
                            className="absolute left-4 text-white hover:text-gray-300 p-2"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => navigatePreview(1)}
                            className="absolute right-4 text-white hover:text-gray-300 p-2"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Media content */}
                        <div className="max-h-[90vh] max-w-[90vw] relative">
                            <MediaPlayer 
                                src={import.meta.env.VITE_APP_BACKEND_URL+`/api/proxy?link=https://ia800903.us.archive.org/21/items/${params.id}/${groupedFiles[previewState.currentGroup][previewState.currentIndex]}`}
                            />
                            <div className="absolute bottom-0 left-0 right-0 text-center text-white backdrop-blur-sm bg-black/20 py-2">
                                {groupedFiles[previewState.currentGroup][previewState.currentIndex].split('/').pop()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-6">
                {Object.entries(groupedFiles)
                    .slice(0, visibleGroups)
                    .map(([groupName, groupFiles]) => (
                    <div key={groupName} className="bg-white rounded-lg shadow-md">
                        <div className="sticky top-[20px] flex items-center justify-between bg-gray-50">
                            <button 
                                onClick={() => toggleGroup(groupName)}
                                className="flex-1 px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {groupName === 'root' ? 'Root Files' : groupName}
                                    <span className="ml-2 text-sm text-gray-500">
                                        ({groupFiles.length} files)
                                    </span>
                                </h2>
                                <svg 
                                    className={`w-6 h-6 transform transition-transform ${expandedGroups.has(groupName) ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {expandedGroups.has(groupName) && (
                                <button
                                    onClick={() => toggleOriginalSize(groupName)}
                                    className="px-4 py-2 mx-4 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {originalSizeGroups.has(groupName) ? 'Grid View' : 'Original Size'}
                                </button>
                            )}
                        </div>
                        
                        {expandedGroups.has(groupName) && (
                            <div className="p-6">
                                <div className={originalSizeGroups.has(groupName) 
                                    ? "space-y-6"
                                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                                }>
                                    {groupFiles.map((file, index) => (
                                        <div 
                                            key={index} 
                                            className={`group relative bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
                                                originalSizeGroups.has(groupName) 
                                                    ? "hover:-translate-y-1 w-fit mx-auto"
                                                    : "hover:-translate-y-1"
                                            }`}
                                            onClick={() => openPreview(groupName, index)}
                                        >
                                            <div>
                                                <MediaPlayer 
                                                    src={import.meta.env.VITE_APP_BACKEND_URL+`/api/proxy?link=https://ia800903.us.archive.org/21/items/${params.id}/${encodeURIComponent(file)}`}
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {file.split('/').pop()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {Object.keys(groupedFiles).length > visibleGroups && (
                <div className="text-center text-gray-600 text-lg py-8">
                    Loading more groups...
                </div>
            )}
        </div>
    );
}

export default Upload;