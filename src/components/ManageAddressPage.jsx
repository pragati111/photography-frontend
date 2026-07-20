import TopHeader from "../components/TopHeader";
import { ArrowLeft, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getAddresses as getCustomerAddresses,
  addAddress as addCustomerAddress,
  updateAddress as updateCustomerAddress,
  deleteAddress as deleteCustomerAddress,
  setDefaultAddressApi as setDefaultCustomerAddressApi,
} from "../api/addressApi";
import {
  getWholesaleAddresses,
  addWholesaleAddress,
  updateWholesaleAddress,
  deleteWholesaleAddress,
  setDefaultWholesaleAddressApi,
} from "../api/wholesaleAddressApi";

export default function ManageAddressPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const storedRole = auth.role || localStorage.getItem("role");
  const token =
    auth.token ||
    localStorage.getItem("token") ||
    localStorage.getItem("wholesalerToken");
  const isWholesale = storedRole === "wholesaler";
  const [editId, setEditId] = useState(null);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
const [updatingId, setUpdatingId] = useState(null);

const [savingAddress, setSavingAddress] = useState(false);
const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    house: "",
    area: "",
    pincode: "",
    city: "",
    state: "",
    type: "",
    landmark: "",
    phone: "",
  });

  const normalizeWholesaleAddress = (addr) => ({
    _id: addr._id,
    label: addr.label || addr.fullName || "Address",
    type: addr.label || addr.fullName || "Wholesale",
    street: [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", "),
    city: addr.city || "",
    state: addr.state || "",
    pincode: addr.pincode || "",
    phone: addr.phone || addr.phoneNumber || "",
    landmark: addr.landmark || "",
    isDefault: addr.isDefault,
  });

  const buildWholesalePayload = () => ({
    fullName: formData.type || "Address",
    phoneNumber: formData.phone,
    pincode: formData.pincode,
    city: formData.city,
    state: formData.state,
    country: "India",
    addressLine1: formData.house,
    addressLine2: formData.area,
    landmark: formData.landmark,
    isDefault: false,
  });

  const buildCustomerPayload = () => ({
    label: formData.type || "Home",
    street: `${formData.house}, ${formData.area}`,
    landmark: formData.landmark,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
    phone: formData.phone,
  });

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  // ✅ ADD ADDRESS (FIXED)
  const handleAdd = async () => {
    if (!formData.house || !formData.area || !formData.pincode) {
      alert("Please fill required fields");
      return;
    }

    setSavingAddress(true);


    try {
      if (editId) {
        if (isWholesale) {
          await updateWholesaleAddress(editId, buildWholesalePayload(), token);
        } else {
          await updateCustomerAddress(editId, buildCustomerPayload(), token);
        }
      } else {
        if (isWholesale) {
          await addWholesaleAddress(buildWholesalePayload(), token);
        } else {
          await addCustomerAddress(buildCustomerPayload(), token);
        }
      }

      // 🔥 REFRESH LIST
      const res = isWholesale
        ? await getWholesaleAddresses(token)
        : await getCustomerAddresses(token);

      setAddresses(
        isWholesale
          ? res.data.addresses.map(normalizeWholesaleAddress)
          : res.data.addresses,
      );

      setShowAdd(false);
      setEditId(null);
    } catch (err) {
      console.error(err);
    }finally {
    setSavingAddress(false);
  }
  };

  // DELETE
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      if (isWholesale) {
        await deleteWholesaleAddress(id, token);
      } else {
        await deleteCustomerAddress(id, token);
      }

      const res = isWholesale
        ? await getWholesaleAddresses(token)
        : await getCustomerAddresses(token);

      setAddresses(
        isWholesale
          ? res.data.addresses.map(normalizeWholesaleAddress)
          : res.data.addresses,
      );
    } catch (err) {
      console.error(err);
    } finally {
    setDeletingId(null);
  }
  };

  // SET DEFAULT
  const setDefault = async (id) => {
    setUpdatingId(id);
    try {
      if (isWholesale) {
        await setDefaultWholesaleAddressApi(id, token);
      } else {
        await setDefaultCustomerAddressApi(id, token);
      }

      const res = isWholesale
        ? await getWholesaleAddresses(token)
        : await getCustomerAddresses(token);

      setAddresses(
        isWholesale
          ? res.data.addresses.map(normalizeWholesaleAddress)
          : res.data.addresses,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = isWholesale
          ? await getWholesaleAddresses(token)
          : await getCustomerAddresses(token);

        setAddresses(
          isWholesale
            ? res.data.addresses.map(normalizeWholesaleAddress)
            : res.data.addresses,
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [token, isWholesale]);

  return (
    <>
      <TopHeader />

      <div className="mt-5 pt-20 px-4 md:px-10 bg-gray-100 min-h-screen">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div onClick={() => navigate(-1)} className="cursor-pointer">
            <ArrowLeft />
          </div>

          <h2 className="text-lg font-semibold">Manage Address</h2>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 text-sm bg-black text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition"
          >
            + Add Address
          </button>
        </div>

        {/* ADDRESS LIST */}
        <div className="space-y-4">
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
                >
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10" />
                    <div className="flex-1 space-y-3 py-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded" />
                        <div className="h-3 bg-gray-200 rounded w-5/6" />
                      </div>
                    </div>
                    <div className="w-10" />
                  </div>
                </div>
              ))}
            </>
          ) : addresses.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 shadow-md text-center border border-dashed border-gray-300">
              No Addresses added by you. Add your delivery address
            </div>
          ) : (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition border ${
                  addr.isDefault ? "border-black" : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    {updatingId === addr._id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                        <span className="text-xs text-gray-600">
                          Updating this address to default
                        </span>
                      </div>
                    ) : (
                      <input
                        type="radio"
                        checked={addr.isDefault}
                        onChange={() => setDefault(addr._id)}
                        disabled={!!updatingId}
                      />
                    )}

                    <div>
                      {addr.isDefault && (
                        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}

                      {addr.label && (
                        <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">
                          {addr.label}
                        </span>
                      )}

                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        {addr.street}
                        {addr.landmark ? `, Near ${addr.landmark}` : ""},{" "}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 text-gray-400">
                    <Pencil
                      size={18}
                      onClick={() => {
                        const [house = "", area = ""] = (
                          addr.street || ""
                        ).split(", ");
                        setFormData({
                          house,
                          area,
                          city: addr.city || "",
                          state: addr.state || "",
                          pincode: addr.pincode || "",
                          type: addr.label || "",
                          landmark: addr.landmark || "",
                          phone: addr.phone || "",
                        });

                        setEditId(addr._id);
                        setShowAdd(true);
                      }}
                      className="cursor-pointer hover:text-blue-500"
                    />
                    {deletingId === addr._id ? (
  <div className="flex items-center gap-2">

    <div className="relative w-5 h-5">

      <div className="absolute inset-0 rounded-full border border-gray-200"/>

      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-red-500 animate-spin"/>

    </div>

    <span className="text-xs text-red-500">
      Deleting Address
    </span>

  </div>
) : (
  <Trash2
    size={18}
    onClick={() => handleDelete(addr._id)}
    className="cursor-pointer hover:text-red-500"
  />
)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ ADD ADDRESS MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white w-[95%] md:w-[500px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-6">
                <ArrowLeft
                  className="cursor-pointer"
                  onClick={() => setShowAdd(false)}
                />
                <h2>{editId ? "Edit Address" : "Add a new address"}</h2>
              </div>

              {/* FORM */}
              <div className="space-y-4">
                <input
                  value={formData.house}
                  onChange={(e) =>
                    setFormData({ ...formData, house: e.target.value })
                  }
                  placeholder="House no, Building Name"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                />

                <input
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({ ...formData, area: e.target.value })
                  }
                  placeholder="Location, Town, Area"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                />

                <input
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  placeholder="Pin Code"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                />

                <div className="flex gap-3">
                  <input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="City"
                    className="w-1/2 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  />

                  <select
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-1/2 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  >
                    <option value="">Select State</option>

                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ADDRESS TYPE */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Address Type{" "}
                    <span className="text-gray-400">(optional)</span>
                  </p>

                  <div className="flex gap-3">
                    {["Home", "Work", "Other"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, type })}
                        className={`px-4 py-2 rounded-lg border text-sm transition ${
                          formData.type === type
                            ? "bg-black text-white"
                            : "hover:bg-black hover:text-white"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={formData.landmark}
                  onChange={(e) =>
                    setFormData({ ...formData, landmark: e.target.value })
                  }
                  placeholder="Full Address with Landmark"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                  rows={3}
                />
                <input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Phone Number"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black outline-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 mt-6">
                <button
disabled={savingAddress}
onClick={() => setShowAdd(false)}
                  className="w-1/2 py-3 rounded-xl border border-gray-300 text-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
  onClick={handleAdd}
  disabled={savingAddress}
  className="
  w-1/2
  py-3
  rounded-xl
  bg-black
  text-white
  font-medium
  transition
  disabled:opacity-80
  disabled:cursor-not-allowed
  flex
  justify-center
  items-center
  gap-3
"
>

  {savingAddress ? (
    <>

      <div className="relative w-5 h-5">

        <div className="absolute inset-0 rounded-full border border-white/20"/>

        <div
          className="
          absolute
          inset-0
          rounded-full
          border-2
          border-transparent
          border-t-white
          animate-spin
        "
        />

      </div>

      <span>
        {editId
          ? "Updating Address"
          : "Adding Address"}
      </span>

    </>
  ) : (
    editId
      ? "Update Address"
      : "Add Address"
  )}

</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
