import { FaCircleArrowRight } from "react-icons/fa6";
import orderMedicine from "../functions/lambda/OrderMedicine";
import { useState } from "react";
import { useAlert } from "../contexts/AlertContext";

export function Modal({
  retailerId,
  consumerId,
  batchId,
  product_name,
  product_price,
  product_manufactured,
  consumer_name,
  consumer_contact,
  consumer_email,
  consumer_address,
  retailer_name,
  retailer_contact,
  retailer_email,
  retailer_address,
  medicineId,
}) {
  const { showAlert } = useAlert();
  const [quantity, setQuantity] = useState(1);
  function openModal(id) {
    const modal = document.querySelector(`dialog[popup-id="${id}"]`);
    modal?.showModal();
  }

  function closeModal(id) {
    const modal = document.querySelector(`dialog[popup-id="${id}"]`);
    modal?.close();
  }

  async function handleOrder() {
    const response = await orderMedicine({
      retailerId,
      consumerId,
      batchId,
      product_name,
      product_price,
      product_manufactured,
      consumer_name,
      consumer_contact,
      consumer_email,
      consumer_address,
      retailer_name,
      retailer_contact,
      retailer_email,
      retailer_address,
      quantity,
      medicineId,
    });

    console.log(response);
    if (!response.body.error) {
      showAlert("success", "Order placed successfully!");
      closeModal(medicineId);
    } else {
      showAlert("error", response.body.error);
    }
  }

  return (
    <>
      <div
        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:scale-[1.05] hover:cursor-pointer duration-300 hover:bg-blue-400 text-sm w-full sm:w-auto flex items-center justify-center gap-1.5"
        onClick={() => openModal(medicineId)}
      >
        <button className="hover:cursor-pointer">Order Medicine</button>
        <FaCircleArrowRight />
      </div>

      <dialog
        popup-id={medicineId}
        className="w-[90%] max-w-md p-4 sm:p-5 border shadow-lg rounded-xl bg-white backdrop-filter backdrop-blur-[20px] text-center 
           fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
      >
        <label className="flex flex-col w-full text-left gap-1">
          <span className="text-sm font-medium text-gray-700">
            Number of Medicines
          </span>
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200"
            required
          />
        </label>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-400 hover:cursor-pointer font-medium rounded-lg text-sm sm:text-base px-4 py-2 w-full sm:w-auto transition-all duration-300"
            onClick={handleOrder}
          >
            Confirm
          </button>
          <button
            className="bg-red-500 hover:bg-red-400 hover:cursor-pointer font-medium rounded-lg text-sm sm:text-base px-4 py-2 w-full sm:w-auto transition-all duration-300"
            onClick={() => closeModal(medicineId)}
          >
            No, cancel
          </button>
        </div>
      </dialog>
    </>
  );
}
