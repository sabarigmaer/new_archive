import { Link } from "react-router";
import useView from "../store/view";

function Header() {
    const { view, toggleView } = useView();
    return <div className="flex items-center justify-center border-b border-b-black p-4 gap-6">
        <Link to="/" className="text-xl">
            Home
        </Link>
        <Link to="/archive" className="text-xl">
            Archives
        </Link>
        <Link to="/rule34" className="text-xl">
            Rule 34
        </Link>
        <button className="ml-auto" onClick={toggleView}>
            {view.toUpperCase()}
        </button>
    </div>
}

export default Header;