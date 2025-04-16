import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getMedicineByQuery from "../functions/lambda/GetMedicineByQuery";
import getRetailerInventory from "../functions/lambda/GetRetailerInventory";
import SearchBar from "../components/SearchBar";

const Inventory = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async (query = "") => {
    const result =
      query === ""
        ? await getRetailerInventory(userId)
        : await getMedicineByQuery(query, userId);

    setMedicines(result.medicines);
  };

  useEffect(() => {
    fetchMedicines();
  }, [userId]);

  return (
    <section className="flex flex-col items-center p-4">
      <SearchBar onSearch={fetchMedicines} />

      <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] mt-4">
        {medicines?.length > 0 ? (
          <div className="overflow-x-auto rounded-[0.5rem]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center text-sm uppercase ">
                  <th className="p-4 ">Batch</th>
                  <th className="p-4 ">Product Name</th>

                  <th className="p-4 ">Price</th>
                  <th className="p-4 ">Quantity</th>

                  <th className="p-4 overflow-hidden whitespace-nowrap text-ellipsis">
                    Salt Composition
                  </th>

                  <th className="p-4 ">Added At</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate(
                        `/${userId}/inventory/medicine/${medicine.medicine_id}`
                      )
                    }
                    className={`rounded-lg  transition hover:scale-[1.01] hover:text-yellow-300 duration-300 cursor-pointer ${
                      medicine.quantity === "0"
                        ? "hover:bg-red-500 bg-red-400"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-7">
                      {medicine.batch_id?.replace("batch-", "")}
                    </td>
                    <td className="p-7 whitespace-nowrap">
                      {medicine.product_name}
                    </td>

                    <td className="p-7">₹{medicine.product_price}</td>
                    <td className="p-7">{medicine.quantity}</td>

                    <td className="p-7 max-w-[10rem] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                      {medicine.salt_composition}
                    </td>

                    <td className="p-7 overflow-hidden whitespace-nowrap text-ellipsis">
                      {medicine.batch_added_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-4">No medicines found.</p>
        )}
      </div>
    </section>
  );
};

export default Inventory;
