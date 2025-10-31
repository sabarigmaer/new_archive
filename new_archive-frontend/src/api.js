import axios from "axios";

export const likeGallery = async (id) => {
    return axios.post(`http://localhost:3000/api/gallery/${id}/like`);
}