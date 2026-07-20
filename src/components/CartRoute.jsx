import { useAuth } from "./AuthContext";
import Cart from "../pages/Cart";
import WholesaleCart from "../pages/WholesaleCart";

export default function CartRoute() {
  const { role } = useAuth();

  if (role === "wholesaler") {
    return <WholesaleCart />;
  }

  return <Cart />;
}
