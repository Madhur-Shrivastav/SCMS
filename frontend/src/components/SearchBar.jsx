import { Search } from "lucide-react";
import { useState } from "react";
const SearchBar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-2/3 lg:w-1/3 shadow-md my-[1rem] overflow-hidden"
    >
      <button className=" duration-300 transition hover:scale-[1.2] ">
        <span className="text-gray-500 font-medium cursor-pointer hover:text-yellow-300">
          Search
        </span>
      </button>

      <input
        type="text"
        name="search"
        placeholder="Type to search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-grow bg-transparent outline-none px-3 text-gray-700"
      />
      <button>
        <Search className="text-gray-500 w-5 h-5 cursor-pointer duration-300 transition hover:scale-[1.4] hover:text-yellow-300 " />
      </button>
    </form>
  );
};

export default SearchBar;
