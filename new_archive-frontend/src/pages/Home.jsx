import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

const Rule34Tags = ["user:Bigmanfrom06","eufoniuz","rinkoai","user:Tylertoo22","erophoenix", "demonicaa", "myaiwaifu69",  "siegwharheit","soprano_r34","user:sscrogg","mmax2281","lucakp","coug","meat_master", "doctor_payne", "srodskiy", "yeero","mr_face", "seacreator", "user:FatLexa","optimystic", "khyleri", "darklust", "micchan", "paingoro", "san_p.dro", "sasasa_r_23", "siahken", "sky_(freedom)", "tight_(ohmygod)", "user:mah0ragahelp", "artist_request+ubel_(sousou_no_frieren)", "h0rny_ai", "user:ProomGroom","whatajinx", "user:chrimbus2", "mochi_(mochi444420)", "xxai", "user:popoptemkin", "dandanhub", "blank_forest", "blk9201", "camonome", "clowenqq"]

function Home() {
  const [galleries, setGalleries] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(import.meta.env.VITE_APP_BACKEND_URL + "/api/galleries");
      const galleriesArray = response.data;
      setGalleries(galleriesArray)
    };
    fetchData()
  }, []);

  return <div>
  <div className="flex flex-wrap p-4 gap-3">
    {Rule34Tags.map(tag => (
      <Link key={tag} to={"/rule34/"+tag}>
        <div className="px-3 py-1 rounded-full bg-gray-100 text-black font-semibold shadow hover:bg-gray-200 transition cursor-pointer border border-gray-300">
          {tag}
        </div>
      </Link>
    ))}
  </div>
   <div className="grid grid-cols-3 gap-6 px-4">
    {
      galleries.map( gallery => <Link to={gallery.type == "ehentai" ? "/ehentai/"+ gallery.id : "/gallery/"+gallery.id}>
        <div>{gallery.title}</div>
        <img 
          src={gallery.coverImage}
        />
      </Link>)
    }
  </div>
  </div>
 
}

export default Home;
