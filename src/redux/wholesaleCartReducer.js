import {
  ADD_TO_WHOLESALE_CART,
  REMOVE_FROM_WHOLESALE_CART,
  CLEAR_WHOLESALE_CART,
  UPDATE_WHOLESALE_QUANTITY,
  SET_WHOLESALE_CART,
} from "./wholesaleCartActions";

const initialState = {
  items: [],
};

export const wholesaleCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_WHOLESALE_CART: {
      const { product, configs, offers } = action.payload;
      const productId = product._id || product.id;

      const existing = state.items.find((p) => p.productId === productId);

      if (existing) {
        const updatedDesigns = [...existing.designs];
        const designIdsToKeep = [];

        configs.forEach((newC) => {
          const designId = newC.designId || crypto.randomUUID();
          designIdsToKeep.push(designId);

          const existingD = updatedDesigns.find((d) => d.designId === designId);
          if (existingD) {
            Object.assign(existingD, newC, {
              designId,
              offers: offers || [],
            });
          } else {
            updatedDesigns.push({
              ...newC,
              designId,
              offers: offers || [],
            });
          }
        });

        const filteredDesigns = updatedDesigns.filter(
          (d) => !d.designId || designIdsToKeep.includes(d.designId),
        );

        return {
          ...state,
          items: state.items.map((p) =>
            p.productId === productId ? { ...p, designs: filteredDesigns } : p,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId,
            name: product.productName || product.name,
            price: product.price,
            image: product.image || product.images?.[0] || "",
            customizations: product.customizations || [],
            designs: configs.map((c) => ({
              ...c,
              designId: c.designId || crypto.randomUUID(),
              offers: offers || [],
            })),
          },
        ],
      };
    }

    case REMOVE_FROM_WHOLESALE_CART: {
      const { productId, designId } = action.payload;

      return {
        ...state,
        items: state.items
          .map((p) =>
            p.productId === productId
              ? {
                  ...p,
                  designs: p.designs.filter((d) => d.designId !== designId),
                }
              : p,
          )
          .filter((p) => p.designs.length > 0),
      };
    }

    case UPDATE_WHOLESALE_QUANTITY: {
      const { productId, designId, quantity } = action.payload;
      const nextQuantity = Math.max(1, Number(quantity) || 1);

      return {
        ...state,
        items: state.items.map((p) =>
          p.productId === productId
            ? {
                ...p,
                designs: p.designs.map((d) =>
                  d.designId === designId ? { ...d, quantity: nextQuantity } : d,
                ),
              }
            : p,
        ),
      };
    }

    case CLEAR_WHOLESALE_CART:
      return initialState;

    case SET_WHOLESALE_CART:
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};
