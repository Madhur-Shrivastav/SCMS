import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getRetailerMedicines from "../functions/lambda/GetRetailerMedicines";
import { UserContext } from "../contexts/UserContext";
import getMedicineDetails from "../functions/lambda/GetMedicineDetails";

const MedicineDetails = () => {
  const { user } = useContext(UserContext);
  const { userId, medicineId } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!userId || !medicineId) return;

    const getDetails = async () => {
      try {
        const data = await getRetailerMedicines(userId);
        if (!data.error) {
          const foundMedicine = data.medicines.find(
            (m) => m.medicine_id === medicineId
          );
          setMedicine(foundMedicine || null);

          if (foundMedicine) {
            const detailData = await getMedicineDetails(medicineId);
            if (!detailData.error) {
              setDetails(detailData.details);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getDetails();
  }, [userId, medicineId]);

  if (loading) return <p>Loading medicine details...</p>;
  if (!medicine) return <p>Medicine not found.</p>;

  const isRetailer = medicine.retailer_id === user.id;
  if (!isRetailer) {
    return <p>You are not authorized to view this order.</p>;
  }

  return (
    <div>
      <h2>{details?.product_name}</h2>
      <p>
        <strong>Price:</strong> {details?.product_price || "N/A"}
      </p>
      <p>
        <strong>Salt Composition:</strong> {details?.salt_composition || "N/A"}
      </p>
      <p>
        <strong>Side Effects:</strong> {details?.side_effects || "N/A"}
      </p>
      <p>
        <strong>Subcategory:</strong> {details?.sub_category || "N/A"}
      </p>
      <p>
        <strong>Manufactured By:</strong>{" "}
        {details?.product_manufactured || "N/A"}
      </p>
      <p>
        <strong>Description:</strong> {details?.medicine_desc || "N/A"}
      </p>
    </div>
  );
};

export default MedicineDetails;
