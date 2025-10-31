import axios from "axios";

export const likeGallery = async (id) => {
    return axios.post(import.meta.env.VITE_APP_BACKEND_URL +`/api/gallery/${id}/like`);
}