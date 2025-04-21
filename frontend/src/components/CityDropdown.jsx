import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CityDropdown({ selectedState, value, onChange }) {
  const cities = {
    "Andhra Pradesh": [
      "Visakhapatnam",
      "Vijayawada",
      "Guntur",
      "Nellore",
      "Tirupati",
    ],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila"],
    Assam: ["Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur"],
    Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Hisar"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi", "Solan"],
    Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
    Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching"],
    Meghalaya: ["Shillong", "Tura", "Nongstoin", "Jowai", "Baghmara"],
    Mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
    Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Zunheboto"],
    Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur"],
    Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
    Sikkim: ["Gangtok", "Namchi", "Mangan", "Gyalshing", "Rangpo"],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirapalli",
      "Salem",
    ],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"],
    Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
    Uttarakhand: ["Dehradun", "Haridwar", "Nainital", "Almora", "Haldwani"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  };

  const [isOpen, setIsOpen] = useState(false);
  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (selectedState && cities[selectedState]) {
      setCityOptions(cities[selectedState]);
    } else {
      setCityOptions([]);
    }
  }, [selectedState]);

  return (
    <div className="relative z-10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:border-2 focus:border-yellow-300 duration-300 focus:outline-none"
      >
        {value || "Select city"}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && cityOptions.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {cityOptions.map((city, index) => (
            <li
              key={index}
              onMouseDown={() => {
                onChange(city);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
