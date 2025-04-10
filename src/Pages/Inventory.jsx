import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import getMedicineByQuery from "../functions/lambda/GetMedicineByQuery";
import getRetailerMedicines from "../functions/lambda/GetRetailerMedicines";
import getMedicineDetails from "../functions/lambda/GetMedicineDetails";
import SearchBar from "../components/SearchBar";

const Inventory = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = async (query = "") => {
    const result =
      query === ""
        ? await getRetailerMedicines(userId)
        : await getMedicineByQuery(query, userId);

    console.log(result.medicines);

    if (result.medicines) {
      const detailedMedicines = await Promise.all(
        result.medicines.map(async (med) => {
          const details = await getMedicineDetails(med.medicine_id);
          return details?.details
            ? {
                ...med,
                ...details.details,
                batch_id: med.batch_id,
                batch_added_at: med.batch_added_at,
                price: med.price,
                quantity: med.quantity,
              }
            : med;
        })
      );

      setMedicines(detailedMedicines);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [userId]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <section className="flex flex-col items-center p-4">
      <SearchBar onSearch={fetchMedicines} />
      <div className="bg-white shadow-lg rounded-2xl p-6 w-[90%] mt-4">
        {medicines.length > 0 ? (
          <div className="overflow-x-auto rounded-[0.5rem]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-center text-sm uppercase ">
                  <th className="p-4 ">Batch</th>
                  <th className="p-4 ">Product Name</th>
                  <th className="p-4 ">Category</th>
                  <th className="p-4 ">Price</th>
                  <th className="p-4 ">Quantity</th>
                  {/* <th className="p-4 ">Manufacturer</th> */}
                  <th className="p-4 overflow-hidden whitespace-nowrap text-ellipsis">
                    Salt Composition
                  </th>
                  {/* <th className="p-4 ">Side Effects</th> */}

                  <th className="p-4 ">Added At</th>
                  {/* <th className="p-4 ">Description</th> */}
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr
                    key={index}
                    onClick={() =>
                      navigate(
                        `/${userId}/${medicine.medicine_id}/medicinedetails`
                      )
                    }
                    className="rounded-lg hover:bg-gray-50 transition hover:scale-[1.01] hover:text-yellow-300 duration-300 cursor-pointer"
                  >
                    <td className="p-7">
                      {medicine.batch_id?.replace("batch-", "")}
                    </td>
                    <td className="p-7 whitespace-nowrap">
                      {medicine.product_name}
                    </td>
                    <td className="p-7 max-w-[10rem] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                      {medicine.sub_category}
                    </td>
                    <td className="p-7">{medicine.product_price}</td>
                    <td className="p-7">{medicine.quantity}</td>
                    {/* <td className="p-7 whitespace-nowrap">
                      {medicine.product_manufactured}
                    </td> */}
                    <td className="p-7 max-w-[10rem] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                      {medicine.salt_composition}
                    </td>
                    {/* <td className="p-7 max-w-[10rem] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                      {medicine.side_effects}
                    </td> */}

                    <td className="p-7 overflow-hidden whitespace-nowrap text-ellipsis">
                      {formatDate(medicine.batch_added_at)}
                    </td>
                    {/* <td className="p-7 max-w-[15rem] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                      {medicine.medicine_desc}
                    </td> */}
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
