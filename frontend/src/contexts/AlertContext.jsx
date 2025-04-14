import { createContext, useContext, useState, useEffect } from "react";
import { Info, AlertTriangle, XCircle, CircleCheck } from "lucide-react";
const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CircleCheck className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-4 right-4 z-[9999]">
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg w-[300px] text-sm font-medium
              ${
                alert.type === "success"
                  ? "bg-green-100 text-green-800"
                  : alert.type === "error"
                  ? "bg-red-100 text-red-800"
                  : alert.type === "info"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              } animate-fadeIn`}
          >
            {getIcon(alert.type)}
            <span>{alert.message}</span>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
