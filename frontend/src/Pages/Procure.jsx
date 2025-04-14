import { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import getRetailersByQuery from "../functions/lambda/GetRetailersByQuery";

const Procure = () => {
  const { user } = useContext(UserContext);
  const city = user.city;
  const state = user.state;
  const [retailers, setRetailers] = useState([]);

  const fetchRetailers = async (query = "") => {
    const result = await getRetailersByQuery(city, state, query);
    console.log(result);
    setRetailers(result.retailers);
  };

  useEffect(() => {
    fetchRetailers();
  }, [city, state]);

  return (
    <section className="flex flex-col items-center justify-center px-4 py-8">
      <SearchBar onSearch={fetchRetailers} />

      {(retailers || []).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl mt-8">
          {retailers.map((retailer, index) => (
            <div
              className="shadow-md bg-[#eaeaea] hover:shadow-lg transition-shadow rounded-3xl w-full"
              key={index}
            >
              <Link
                to={`retailer/${retailer.retailer_id}`}
                className="flex flex-col justify-center items-center text-center p-6 sm:p-8"
              >
                <img
                  src={retailer.profileImage}
                  alt="listing cover"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover hover:scale-[1.05] transition-transform duration-300"
                />
                <div className="mt-4 flex flex-col gap-2 w-full">
                  <p className="truncate text-base sm:text-lg font-bold text-slate-700">
                    {retailer.name}
                  </p>
                  <p className="text-sm text-[#727272] font-semibold truncate">
                    Contact: {retailer.contact}
                  </p>
                  <p className="text-sm text-[#727272] font-semibold line-clamp-2">
                    Address: {retailer.address}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No retailers found in this city.
        </p>
      )}
    </section>
  );
};

export default Procure;
