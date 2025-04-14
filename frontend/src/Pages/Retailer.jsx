import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { FaLocationDot } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import getMedicineByQuery from "../functions/lambda/GetMedicineByQuery";
import getMedicineDetails from "../functions/lambda/GetMedicineDetails";
import getRetailerDetails from "../functions/lambda/GetRetailerDetails";
import getRetailerInventory from "../functions/lambda/GetRetailerInventory";

const Retailer = () => {
  const { retailerId } = useParams();
  const [retailer, setRetailer] = useState(null);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    getRetailerDetails(retailerId)
      .then((retailer) => {
        setRetailer(retailer.retailer);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [retailerId]);

  console.log(retailer);

  const fetchMedicines = async (query = "") => {
    const result =
      query === ""
        ? await getRetailerInventory(retailerId)
        : await getMedicineByQuery(query, retailerId);

    if (result.medicines) {
      const detailedMedicines = await Promise.all(
        result.medicines.map(async (med) => {
          const details = await getMedicineDetails(med.medicine_id);
          console.log(details);
          return details?.details ? { ...med, ...details.details } : med;
        })
      );

      setMedicines(detailedMedicines);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [retailerId]);

  if (!retailer) {
    return <p>Loading retailer details...</p>;
  }
  return (
    <section className="flex flex-col gap-2 items-center justify-center">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 px-4 py-6 sm:px-10 sm:py-10">
        <div className="w-full sm:w-1/2">
          <img
            src={retailer.profileImage}
            alt="Madhur Shrivastav"
            className="rounded-3xl w-full h-64 sm:h-[50vh] object-cover"
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/2 justify-evenly mt-6 sm:mt-0 gap-4 sm:gap-6">
          <div>
            <h1 className="font-bold text-2xl sm:text-4xl">{retailer.name}</h1>
            <h2 className="font-semibold text-xl sm:text-2xl text-[#727272]">
              Durga Medical Store
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <IoIosCall className="text-yellow-400 text-2xl sm:text-3xl" />
            <p className="text-base sm:text-lg">{retailer.contact}</p>
          </div>

          <div className="flex items-center gap-3">
            <MdEmail className="text-yellow-400 text-xl sm:text-2xl" />
            <p className="text-base sm:text-lg break-all">{retailer.email}</p>
          </div>

          <div className="flex items-start gap-3">
            <FaLocationDot className="text-red-500 text-xl sm:text-2xl" />
            <p className="text-base sm:text-lg break-all">
              Telpur, Mehuwala Mafi, 248001, Dehradun
            </p>
          </div>
        </div>
      </div>

      <SearchBar onSearch={fetchMedicines} />
      {(medicines || []).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl my-8 px-4">
          {medicines.map((medicine, index) => (
            <div
              className="shadow-md bg-[#eaeaea] hover:shadow-lg transition-shadow rounded-3xl w-full"
              key={index}
            >
              <Link
                to={`batch/${medicine.batch_id}/medicine/${medicine.medicine_id}`}
                className="flex flex-col justify-center items-center text-center p-6 sm:p-8"
              >
                <img
                  src={medicine.image_urls[0]}
                  alt="listing cover"
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover hover:scale-[1.05] transition-transform duration-300"
                />
                <div className="mt-4 flex flex-col gap-2 w-full">
                  <p className="text-base sm:text-lg font-bold text-[#727272] truncate">
                    {medicine.product_name}
                  </p>
                  <p className="truncate text-base sm:text-lg font-bold text-[#727272]">
                    {medicine.product_manufactured}
                  </p>
                  <p className="text-base sm:text-lg font-bold text-[#727272]">
                    ₹{medicine.product_price}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No medicines found.</p>
      )}
    </section>
  );
};

export default Retailer;
