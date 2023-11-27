import React, { useRef } from "react";
import { useState } from "react";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Wrapper, NavBar } from "./home.styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { useShoppingCart } from "../../context/shoppingCart";
//import LocalMallIcon from "@mui/icons-material/LocalMall";
import { HomeProduct } from "../../pages";
import ProductContainer from "./productItem/productContainer";
import Shop from '../../public/noun-shopping-bag-858425.svg';
import Image from "next/image";

const Home = ({ results }: HomeProduct) => {
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const { user, error } = useUser();
  const [productData, setProductData] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const [userLikedProducts, setUserLikedProducts] = useState();
  const [userSavedProducts, setUserSavedProducts] = useState();
  const lastId = useRef<string | null>(results[results.length - 1]._id);

  useEffect(() => {
    async function likedProducts() {
      if (!user) return;
      let response = await sanityClient.fetch(
        `*[_type == "users" && userId == $curr] {
     likedProducts

    }`,
        { curr: user?.sub }
      );
      let likedProductsArray = response[0]?.likedProducts;
      setUserLikedProducts(likedProductsArray || []);
    }
    likedProducts();
    async function savedProducts() {
      if (!user) return;
      let response = await sanityClient.fetch(
        `*[_type == "users" && userId == $curr] {
     savedProducts

    }`,
        { curr: user?.sub }
      );
      let savedProductsArray = response[0]?.savedProducts;
      setUserSavedProducts(savedProductsArray || []);
    }
    savedProducts();
  }, [user]);

  async function fetchNextPage() {
    const { current } = lastId;
    if (current === null) {
      setHasMore(false);
    }
    const data = await sanityClient.fetch(
      `*[_type == "product" && _id > $current] | order(_id) [0...3] {
     defaultProductVariant,
  _id,
  
  title,
  slug,
  category,
  vendor->{
  title,
  logo,_id
},
_id
    }`,
      { current }
    );
    if (data.length > 0) {
      lastId.current = data[data.length - 1]._id;
      setProductData((prev) => [...prev, ...data]);
    } else {
      lastId.current = null; // Reached the end
      setHasMore(false);
    }
  }

  console.log(productData, "this is all product data");

  return (
    <>
      <NavBar>
        <header>Home</header>
        <Button
          onClick={() => {
            setCartOpen(true);
            console.log("Shop cart opened");
          }}
          style={{
            width: "60px",
            height: "60px",
            paddingTop: "13px",
            borderRadius: "50%",
            color: "black",
          }}
        >
          <Badge
            badgeContent={getCartQuantity()}
            color="error"
            overlap="rectangular"
          >
            <Image src={Shop} className="shopImg" style={{ width: "40px", height: "40px", border: "1px solid red" }} unoptimized={true} width={40} height={40} alt="shop icon" />
          </Badge>
        </Button>
      </NavBar>
      <Wrapper id="parent">
        <InfiniteScroll
          dataLength={productData.length}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={<CircularProgress style={{ marginBottom: "50px" }} />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          scrollableTarget="parent"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {productData.map((product) => {
if(product.vendor&& product.vendor.logo)return (<ProductContainer
              productProps={product}
              userLikedProducts={userLikedProducts}
              userSavedProducts={userSavedProducts}
              key={product._id}

            />)
          }
            
          )}
        </InfiniteScroll>
      </Wrapper>
    </>
  );
};

export default Home;
