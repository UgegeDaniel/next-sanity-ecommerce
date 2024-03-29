import React, { useEffect } from "react";
import Image from "next/image";
import { urlFor } from "../../lib/sanity";
import { useState } from "react";
import { ProductVariantContainer } from "./productVariant.styles";
import { formatCurrency } from "../../utils/currencyFormatter";
import { ProductInfo } from "../Home/productItem/productContainer.styles";
import {
  DefaultProdVariant,
  useShoppingCart,
} from "../../context/shoppingCart";
import { ProudctInfo } from "../ShoppingCart/shoppingCartOverlay.styles";
import { ProudctVariantBackground } from "./prodInfoOverlay.styles";

interface ProductInfo {
  productInfo: {
    images: { asset: { _ref: string; _type: string } }[];
    price: number;
    sku: string;
    title: string;
    colour: string;
    _key: string;
    size: number;
  };
  variantButtonState: "selected" | "not-selected";
  productId: string;
}

const ProductSize = ({
  productInfo,
  variantButtonState,
  productId,
}: ProductInfo) => {
  console.log(ProudctInfo, "This is the product info thing");
  const [currentVariant, setCurrentVariant] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const { modifyItemQuantity, getItemQuantity, variantId } = useShoppingCart();


  return (
    <>
 {<div className="each-side rounded-2xl bg-gray-300 w-1/12 flex flex-row justify-center items-center hover:border hover:border-black">
    {productInfo?.size}
   </div>}

    </>
  );
};

export default ProductSize;
