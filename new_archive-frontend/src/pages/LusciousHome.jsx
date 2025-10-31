import { Link } from "react-router"
const LIST = [
  {
    id: 539626,
    name: "poki girls",
  },
  {
    id: 548541,
    name: "MOMO MHA"
  },
  {
    id: 548920,
    name: "Ochaco MHA"
  },
  {
    id: 548543,
    name: "Atom eve"
  }
]

export default function LusciousHome() {
  return (
    <>
      {LIST.map((item) => (
        <Link key={item.id} to={`/luscious/${item.id}`}>
          <div className="px-3 py-1 rounded-full bg-gray-100 text-black font-semibold shadow hover:bg-gray-200 transition cursor-pointer border border-gray-300">
            {item.name}
          </div>
        </Link>
      ))}
    </>
  )
}
