
import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { imageExtensions, videoExtensions, gifExtensions } from "../constants";

function getMediaType(url) {
    const ext = url
      .split(".")
      .pop()
      .split(/\#|\?/)[0]
      .toLowerCase();
    console.log(ext)
    if (imageExtensions.includes(ext)) return "image";
    if (gifExtensions.includes(ext)) return "gif";
    if (videoExtensions.includes(ext)) return "video";
}

function MediaPlayer({ src }) {
    const mediaType = useMemo(() => getMediaType(src), [src]);



    // Direct media loading
    if (mediaType === "image") {
        return (
            <img 
                loading="lazy" 
                src={src} 
                alt={src} 
                style={{ width: '100%', height: 'auto',  }}
                crossOrigin="anonymous"
            />
        );
    }

    if (mediaType === "gif") {
        return (
            <img 
                src={src} 
                alt={src} 
                style={{ width: '100%', height: 'auto',  }}
                crossOrigin="anonymous"
            />
        );
    }

    // if (mediaType === "video") {
    //     return (
    //         <video 
    //             src={src} 
    //             autoPlay 
    //             controls
    //             style={{ width: '100%', height: 'auto',  }}
    //             crossOrigin="anonymous"
    //         />
    //     );
    // }

    // For unknown media types, start with iframe
    return (
            <img 
                loading="lazy" 
                src={src} 
                alt={src} 
                style={{ width: '100%', height: 'auto',  }}
                crossOrigin="anonymous"
            />
        );
}

export default MediaPlayer;