import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router";



function Archive () {
    const [ uploads, setUploads ] = useState([]);
    useEffect(() => {
        const getUploads = async () => {
            const response = await axios.get("https://archive.org/services/search/beta/page_production/?user_query=&page_type=account_details&page_target=%40sabari_vasan678&page_elements=%5B%22uploads%22%5D&hits_per_page=100&page=1&sort=publicdate%3Adesc&aggregations=false&uid=R%3Ab58f6d4c650d4b7b9524-S%3Ad3caa20605c8145b8a49-P%3A1-K%3Ah-T%3A1757346413162&client_url=https%3A%2F%2Farchive.org%2Fdetails%2F%40sabari_vasan678")
            setUploads(response.data.response.body.page_elements.uploads.hits.hits)
        }
        getUploads()
    }, [])
    return <div className="flex flex-wrap gap-2">{
        uploads.map(upload => {
            return <Link to={`/upload/${upload.fields.identifier}`}>
                <div>{upload.fields.title}</div>
                <img src={"https://archive.org/services/img/"+upload.fields.identifier} />
            </Link>
        })
    }</div>
}

export default Archive;