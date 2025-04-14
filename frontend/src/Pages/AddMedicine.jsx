import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Papa from "papaparse";
import { storage } from "../functions/firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useAlert } from "../contexts/AlertContext";
import putMedicineBatch from "../functions/lambda/PutMedicineBatch";

const AddMedicine = () => {
  const { userId } = useParams();
  const { showAlert } = useAlert();
  const [formData, setFormData] = useState({
    product_name: "",
    medicine_desc: "",
    product_manufactured: "",
    salt_composition: "",
    product_price: "",
    side_effects: "",
    quantity: "",
    image_urls: [],
  });

  console.log(formData);

  const handleChange = (name, value) => {
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        [name]: value,
      };

      return updatedFormData;
    });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadPromises = Array.from(files).map((file) => {
      const storageRef = ref(
        storage,
        `productImages/${Date.now()}_${file.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            console.log(
              `Upload Progress for ${file.name}: ${
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              }%`
            );
          },
          (error) => {
            console.error("File upload error:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });

    Promise.all(uploadPromises)
      .then((urls) => {
        setFormData((prevData) => ({
          ...prevData,
          image_urls: [...prevData.image_urls, ...urls],
        }));
        showAlert("success", "Images uploaded successfully");
      })
      .catch((error) => {
        showAlert("error", "Some images failed to upload");
      });
  };

  const [medicines, setMedicines] = useState([]);
  const [isCSVUploaded, setIsCSVUploaded] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    const expectedHeaders = [
      "product_name",
      "medicine_desc",
      "product_manufactured",
      "salt_composition",
      "product_price",
      "side_effects",
      "quantity",
      "image_urls",
    ];

    if (file) {
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const headers = result.meta.fields || [];
          const missing = expectedHeaders.filter((h) => !headers.includes(h));

          if (missing.length > 0) {
            showAlert("error", `Missing columns: ${missing.join(", ")}`);
            setIsCSVUploaded(false);
            return;
          }
          const formattedData = result.data.map((row) => {
            const cleaned = Object.fromEntries(
              Object.entries(row).map(([key, value]) => [
                key.trim(),
                value?.trim?.() || "",
              ])
            );
            return {
              ...cleaned,
              image_urls: cleaned.image_urls
                ? cleaned.image_urls.split(/;\s*|\s+/).map((url) => url.trim())
                : [],
            };
          });

          setMedicines(formattedData);
          setIsCSVUploaded(true);
        },
        error: (err) => {
          showAlert("error", `Error parsing CSV: ${err.message}`);
          setIsCSVUploaded(false);
        },
      });
    }
  };

  console.log(medicines);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCSVUploaded) {
      if (medicines?.length > 0) {
        const response = await putMedicineBatch(userId, medicines);
        console.log(response);
      } else {
        alert("Empty CSV!");
      }
    } else {
      if (
        !formData.product_name ||
        !formData.product_manufactured ||
        !formData.product_price ||
        !formData.salt_composition ||
        !formData.medicine_desc ||
        !formData.side_effects ||
        !formData.product_price ||
        !formData.quantity
      ) {
        showAlert("warning", "Please fill in all fields.");
        return;
      }

      const response = await putMedicineBatch(userId, [formData]);
      response.body.message
        ? showAlert("success", response.body.message)
        : showAlert("error", response.body.error);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white flex flex-col gap-10 p-[4rem] rounded-2xl w-full sm:w-[35rem] lg:w-[40rem] sm:my-[3rem]"
      >
        <div className="flex flex-col justify-center items-center border-b-2">
          <h1 className="text-black text-[2rem] sm:text-[2.5rem] font-bold">
            Add Medicine
          </h1>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-5">
          <label className="relative w-full my-3">
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder=""
              className="peer block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] p-1"
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Medicine Name
            </span>
          </label>

          <label className="relative w-full my-3">
            <input
              type="text"
              name="product_manufactured"
              value={formData.product_manufactured}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              placeholder=""
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Manufacturer
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              placeholder=""
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Quantity
            </span>
          </label>
          <label className="relative w-full my-3">
            <input
              type="number"
              step="0.01"
              min="0"
              name="product_price"
              value={formData.product_price}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              placeholder=""
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Price in Rupees
            </span>
          </label>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="relative w-full my-3">
            <input
              type="text"
              name="salt_composition"
              value={formData.salt_composition}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              placeholder=""
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Salt Composition
            </span>
          </label>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="relative w-full my-3">
            <input
              type="text"
              name="medicine_desc"
              value={formData.medicine_desc}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              placeholder=""
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Description
            </span>
          </label>
        </div>
        <div className="flex flex-col w-full gap-2">
          <label className="relative w-full my-3">
            <input
              type="text"
              name="side_effects"
              value={formData.side_effects}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="block py-3 text-black w-full text-sm bg-transparent border-b-2 border-black appearance-none focus:outline-none focus:border-[#9bd300] peer p-1"
              placeholder=""
            />
            <span
              className="absolute left-2 top-2 text-black text-lg duration-300 px-1
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black peer-focus:top-[-0.75rem] peer-focus:text-sm peer-focus:text-[#9bd300]"
            >
              Side Effects
            </span>
          </label>
        </div>
        <div className="flex flex-col w-full gap-2 rounded-lg shadow-sm hover:bg-gray-100 focus:border-2 focus:border-[#9bd300] duration-300 focus:outline-none">
          <input
            type="file"
            id="file"
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <label
            htmlFor="file"
            className="text-black font-medium cursor-pointer inline-block px-10 py-4"
          >
            Upload Product Images
          </label>
        </div>
        {formData.image_urls.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {formData.image_urls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Preview ${idx}`}
                className="w-24 h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        <label className="text-black text-center font-medium cursor-pointer inline-block px-10 ">
          OR
        </label>
        <div className="flex flex-col w-full gap-2 rounded-lg shadow-sm hover:bg-gray-100 focus:border-2 focus:border-[#9bd300] duration-300 focus:outline-none">
          <input
            type="file"
            id="csv_file"
            className="hidden"
            accept=".csv"
            onChange={handleCSVUpload}
          />

          <label
            htmlFor="csv_file"
            className="text-black font-medium cursor-pointer inline-block px-10 py-4"
          >
            {fileName ? `Selected: ${fileName}` : "Upload CSV"}
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#9bd300] hover:bg-[#9bd300c4] p-2 rounded-full text-black mx-auto transition-scale hover:scale-[1.1] duration-[300ms] font-bold text-[14px] w-full"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default AddMedicine;
