import { useAuth } from "./AuthContext";
import ProductDisplay from "./ProductDisplay";
import WholesaleProductDisplay from "./WholesaleProductDisplay";

export default function ProductRoute() {
  const { role } = useAuth();

  if (role === "wholesaler") {
    return <WholesaleProductDisplay />;
  }

  return <ProductDisplay />;
}
