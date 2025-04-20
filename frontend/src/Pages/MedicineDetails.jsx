import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getMedicineDetails from "../functions/lambda/GetMedicineDetails";
import getRetailerDetails from "../functions/lambda/GetRetailerDetails";
import { UserContext } from "../contexts/UserContext";
import { Modal } from "../components/Modal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const MedicineDetails = () => {
  const { user } = useContext(UserContext);
  const { userId, retailerId, medicineId, batchId } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Retailer:", retailerId);

  useEffect(() => {
    if (!medicineId) return;

    const getDetails = async () => {
      try {
        const medicineInfo = await getMedicineDetails(medicineId);
        setMedicine(medicineInfo.details);

        const retailerInfo = await getRetailerDetails(
          user.role === "Consumer" ? retailerId : user.id
        );
        setRetailer(retailerInfo.retailer);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [medicineId]);

  if (loading)
    return (
      <p className="text-center mt-8 text-lg">Loading medicine details...</p>
    );
  if (!medicine)
    return (
      <p className="text-center mt-8 text-lg text-red-500">
        Medicine not found.
      </p>
    );

  return (
    <section className="flex flex-col gap-8 px-4 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="w-full lg:w-1/2">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop={medicine.image_urls.length > 1}
            className="rounded-2xl shadow-lg"
          >
            {medicine.image_urls.map((url, index) => (
              <SwiperSlide key={index}>
                <img
                  src={url}
                  alt={`Medicine Image ${index + 1}`}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-2xl"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex flex-col w-full lg:w-1/2 gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
              {medicine.product_name}
            </h1>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-500 mt-2">
              Manufacturer: {medicine.product_manufactured}
            </h2>
          </div>

          <div className="text-gray-700 space-y-4 text-base sm:text-lg">
            <p>
              <span className="font-semibold">Contains:</span>{" "}
              {medicine.salt_composition}
            </p>
            <p>
              <span className="font-semibold">Side Effects:</span>{" "}
              {medicine.side_effects}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ₹{" "}
              {medicine.product_price}
            </p>
            <p>
              <span className="font-semibold">Used For:</span>{" "}
              {medicine.medicine_desc}
            </p>
          </div>

          {retailerId && (
            <div className="pt-4">
              <Modal
                retailerId={retailerId}
                consumerId={userId}
                batchId={batchId}
                product_name={medicine.product_name}
                product_price={medicine.product_price}
                product_manufactured={medicine.product_manufactured}
                consumer_name={`${user.firstName} ${user.lastName}`}
                consumer_contact={user.contact}
                consumer_email={user.email}
                consumer_address={user.address}
                retailer_name={retailer.name}
                retailer_contact={retailer.contact}
                retailer_email={retailer.email}
                retailer_address={retailer.address}
                medicineId={medicine.medicine_id}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MedicineDetails;
