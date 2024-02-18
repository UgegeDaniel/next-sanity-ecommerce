import React, { useEffect, useState } from "react";
import {
  CartButtons,
  PlayButton,
  ProductInfoSection,
  ProudctVariantBackground,
  VendorPage,
  VendorProduct,
  VendorProductsWrapper,
  Wrapper,
} from "./prodInfoOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { formatCurrency } from "../../utils/currencyFormatter.ts";
import { CloseMenu } from "./prodInfoOverlay.styles";
import { motion } from "framer-motion";
// 🚀 Fast

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useShoppingCart } from "../../context/shoppingCart";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import ProductVariant from "./productVariant";
import DefaultProduct from "./defaultProduct";
import DefaultColor from "./defaultColor";
import DefaultSize from "./defaultSize";
import ProductColor from "./productColor";
import ProductSize from "./productsize";
import ProductImage from "./productImage";
import DefaultImage from "./defaultImage";
import ReactModal from "react-modal";
//import { useShoppingCart } from "../../context/shoppingCart";
import { useUser } from "@auth0/nextjs-auth0";
import { usePaystackPayment } from "react-paystack";
import Modal from "react-modal";
import useAppAuth from "../../utils/firebase";
//import balance from "../profilePage/walletPage/withdrawPage";
// import { useShoppingCart } from "../../context/shoppingCart";

const ProductInfoOverlay = ({ currentProduct }) => {
  const router = useRouter();
  const { user, error } = useUser();
  const { getUserFromLocalStorage } = useAppAuth();
  const [variantButtonState, setVariantButtonState] = useState("not-selected"); // either not-selected or selected
  const { modifyItemQuantity, getItemQuantity, variantId, deactivateDefault } =
    useShoppingCart();
  const [overlayVisibility, setOverlayVisibility] = useState(false);
  const [showGameSettingsOverlay, setShowGameSettingsOverlay] = useState(false);
  const [numberOfAttempts, setNumberOfAttempts] = useState(0);
  const [productModal, setProductModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showVariant, setShowVariant] = useState(false);
  const [openPlay, setOpenPlay] = useState(false);
  const [amountToPay, setAmountToPay] = useState("");
  const [imageViewer, setImageViewer] = useState(false);

  console.log(currentProduct, "this is the current Product");
  const cartButtonState = () => {
    if (getItemQuantity(currentProduct._id) == null) return "Add to cart";
    if (getItemQuantity(currentProduct._id) !== itemQuantity) {
      return "Update quantity";
    } else {
      return "In cart";
    }
  };

  const { getWallet, setWallet } = useShoppingCart();

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    setAmountToPay(numberOfAttempts * 100);
  };

  const config = {
    email: user?.email,
    amount: numberOfAttempts * 100 * 100, // converting to kobo for paystack and multiplying by 100 (1attempt = 100naira)
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  };
  const initializePayment = usePaystackPayment(config);
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const [itemQuantity, setItemQuantity] = useState(
    getItemQuantity(currentProduct._id) || 1
  );

  const increment = () => {
    setItemQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (itemQuantity === 1) return;
    setItemQuantity((prev) => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(amountToPay);

    window.location.href = `https://wordsearch-eta.vercel.app/?existingParams=value&numberofAttempts=${numberOfAttempts}`;
    // window.location.href = `https://chimaobi098.github.io/wordsearch/?existingParams=value&numberofAttempts=${numberOfAttempts}`;
  };
  // initializePayment(onSuccess, onClose);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  async function onSuccess() {
    let data = await fetch("/api/manageGameAttempts", {
      method: "POST",
      body: JSON.stringify({
        numberOfAttempts,
        productId: currentProduct._id,
      }),
    });
    let res = await data.json();
    console.log(res);
    if (res._id) {
      window.location.href = `https://wordsearch-eta.vercel.app?sessionId=${res._id}`;
      console.log("hello world");
      // window.location.href = `https://chimaobi098.github.io/wordsearch?sessionId=${res._id}`;
    } else {
      alert("there was an error contact us");
    }
  }

  function hideModal() {
    setIsModalVisible(false);
  }

  function OpenModal() {
    setIsModalVisible(true);
  }

  function onClose() {
    alert("just try again");
  }

  function handleGamePayment(e) {
    console.log(amountToPay);
    const balance = getWallet() - amountToPay;
    setWallet(balance);
    console.log(balance);
    return balance;
  }

  // Inside your component
  // useEffect(() => {
  //   Modal.setAppElement('#'); // Replace '#root' with your app's root element ID
  // }, []);
  const openWordSearchGame = () => {
    // Replace 'path/to/local/project' with the relative path to your local project's files
    const localProjectPath =
      "https://main--comforting-kelpie-ae0e91.netlify.app?userId=" +
      JSON.parse(getUserFromLocalStorage())?.id;
    window.open(localProjectPath, "_blank");
  };
  return (
    <>
      {/* IMAGE VIEWER */}
      {imageViewer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => {
            setImageViewer(false);
          }}
          className="w-[100%] h-[100vh] flex justify-center items-center"
          style={{ zIndex: 100 }}
        >
          {!showVariant && (
            <Image
              layout="fill"
              objectFit="contain"
              src={urlFor(
                currentProduct.defaultProductVariant?.images[0]
              ).url()}
              alt="Product Image"
              unoptimized={true}
            />
          )}

          {showVariant && (
            <motion.div
              style={{
                width: "100%",
                height: "70vh",
                position: "relative",
                overflowY: "hidden",
              }}
              onClick={() => {
                setImageViewer(true);
              }}
            >
              <DefaultImage
                productInfo={currentProduct}
                variantButtonState={variantButtonState}
                unoptimized={true}
              />
            </motion.div>
          )}

          {showVariant &&
            currentProduct.variants.map((variant) => {
              if (variantId === variant._key) {
                return (
                  <motion.div
                    key={variant._key}
                    className="translate-y-[-50%]"
                    style={{
                      width: "100%",
                      height: "70vh",
                      position: "absolute",
                      overflowY: "hidden",
                      top: "50%",
                    }}
                  >
                    <ProductImage
                      productInfo={variant}
                      productId={currentProduct._id}
                      variantButtonState={variantButtonState}
                    />
                  </motion.div>
                );
              } else {
                return null;
              }
            })}
        </motion.div>
      )}

      {productModal ? (
        <ReactModal
          style={customStyles}
          isOpen={isModalVisible}
          onRequestClose={hideModal}
          contentLabel="Do you want to continue shopping"
        >
          <div>
            <h1>Your Item has been added to the cart.</h1>

            <ul>
              <li>
                <button onClick={hideModal}>Continue Shopping</button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCartOpen(true);
                    setIsModalVisible(false);
                  }}
                >
                  Go to Checkout
                </button>
              </li>
            </ul>

            <button onClick={hideModal}>Close</button>
          </div>
        </ReactModal>
      ) : (
        ""
      )}

      {showVariant ? (
        <div
          className="h-auto w-auto"
          style={{ display: imageViewer ? "none" : "block" }}
        >
          <ProudctVariantBackground
            id="variant-background"
            onClick={(e) => {
              // console.log(e.target.id);
              if (e.target.id == "variant-background") {
                setOverlayVisibility(false);
              }
            }}
          >
            <motion.div
              id="overlay-container"
              initial={{ y: "70vh" }}
              animate={{ y: "0vh" }}
            >
              {/* <ReactModal 
        isOpen={true}
        onRequestClose={hideModal}
        contentLabel="Do you want to continue shopping"
      >
      
      </ReactModal> */}

              <div
                style={{
                  width: "100%",
                  height: "40vh",
                  position: "relative",
                  marginBottom: "2rem",
                }}
              >
                <motion.div
                  whileTap={{ scale: 0.92, borderRadius: "20px" }}
                  style={{
                    width: "100%",
                    height: "42vh",
                    position: "relative",
                    overflowY: "hidden",
                  }}
                  onClick={() => {
                    setImageViewer(true);
                  }}
                >
                  <DefaultImage
                    productInfo={currentProduct}
                    variantButtonState={variantButtonState}
                    unoptimized={true}
                  />
                </motion.div>

                {currentProduct.variants.map((variant) => {
                  if (variantId === variant._key) {
                    return (
                      <motion.div
                        key={variant._key}
                        whileTap={{ scale: 0.92, borderRadius: "20px" }}
                        style={{
                          width: "100%",
                          height: "42vh",
                          position: "absolute",
                          overflowY: "hidden",
                          top: 0,
                        }}
                        onClick={() => {
                          setImageViewer(true);
                        }}
                      >
                        <ProductImage
                          productInfo={variant}
                          productId={currentProduct._id}
                          variantButtonState={variantButtonState}
                        />
                      </motion.div>
                    );
                  } else {
                    return null;
                  }
                })}
              </div>
              <CloseMenu
                className="cursor-pointer"
                onClick={() => {
                  deactivateDefault();
                  setOverlayVisibility(false);
                  router.back();
                }}
              >
                <CloseRoundedIcon />
              </CloseMenu>
              <div className="text-left w-full mb-4">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <h4 style={{ margin: "0" }}>{currentProduct.title}</h4>
                </div>

                <h1>
                  {formatCurrency(currentProduct?.defaultProductVariant?.price)}
                </h1>
              </div>

              <div className="flex-col w-full ">
                <DefaultColor
                  productInfo={currentProduct}
                  variantButtonState={variantButtonState}
                />

                {currentProduct.variants.map((variant) => {
                  if (variantId === variant._key) {
                    return (
                      <ProductColor
                        key={variant._key}
                        productInfo={variant}
                        productId={currentProduct._id}
                        variantButtonState={variantButtonState}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
              </div>

              <div className="w-full flex flex-row gap-x-2 items-center mt-2">
                <DefaultProduct
                  productInfo={currentProduct}
                  variantButtonState={variantButtonState}
                />
                {currentProduct.variants.map((variant) => (
                  <ProductVariant
                    key={variant._key}
                    productInfo={variant}
                    productId={currentProduct._id}
                    variantButtonState={variantButtonState}
                  ></ProductVariant>
                ))}
              </div>

              <div className="w-full mt-4 flex flex-col gap-y-4">
                <div>Select Size</div>
                <div className="sizes flex flex-row flex-wrap gap-x-2 text-sm items-center">
                  <DefaultSize
                    productInfo={currentProduct}
                    variantButtonState={variantButtonState}
                  />

                  {currentProduct.variants.map((variant) => {
                    if (variantId === variant._key) {
                      return (
                        <ProductSize
                          key={variant._key}
                          productInfo={variant}
                          productId={currentProduct._id}
                          variantButtonState={variantButtonState}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>

              <div className="fixed bottom-0 px-4 pt-0 md:pt-12 bg-white h-32 w-full">
                <button
                  className="w-full m-auto bg-black text-white h-12 rounded-sm"
                  onClick={() => {
                    deactivateDefault();
                    setVariantButtonState("selected");
                    modifyItemQuantity(currentProduct, itemQuantity);
                    console.log("Variants product mode");
                    setProductModal(true);
                    OpenModal();
                    setShowVariant(false);
                    if (user && openPlay) {
                      setShowGameSettingsOverlay(true);
                      return;
                    }
                    // alert("your items have been added to the cart");
                  }}
                >
                  Next
                </button>
              </div>
            </motion.div>
          </ProudctVariantBackground>
        </div>
      ) : (
        ""
      )}

      {showVariant == false ? (
        <>
          <Head>
            <title>{`Ecommerce || ${currentProduct.title}`}</title>
            <meta
              name="description"
              content="This is a really cool product that I think you should buy"
            />
            <meta
              name="image"
              content={urlFor(
                currentProduct.defaultProductVariant?.images[0]
              ).url()}
            />
          </Head>
          <Wrapper initial={{ y: "100vh" }} animate={{ y: "0vh" }}>
            <div
              style={{
                width: "100%",
                height: "40vh",
                position: "relative",
                marginBottom: "2rem",
              }}
            >
              <motion.div
                whileTap={{ scale: 0.92, borderRadius: "20px" }}
                style={{
                  width: "100%",
                  height: "42vh",
                  position: "relative",
                  overflowY: "hidden",
                }}
              >
                <Image
                  layout="fill"
                  objectFit="cover"
                  src={urlFor(
                    currentProduct.defaultProductVariant?.images[0]
                  ).url()}
                  alt="Product Image"
                  unoptimized={true}
                  onClick={() => {
                    setImageViewer(true);
                  }}
                />
              </motion.div>
            </div>
            <ProductInfoSection>
              <CloseMenu
                onClick={() => {
                  router.back();
                }}
              >
                <CloseRoundedIcon />
              </CloseMenu>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h4 style={{ margin: "0" }}>{currentProduct.title}</h4>
              </div>

              <h1>
                {formatCurrency(currentProduct?.defaultProductVariant?.price)}
              </h1>
              {/* <div id="quantity-control-container">
              <button
                className="quantity-change-buttons"
                onClick={() => {
                  decrement();
                }}
              >
                {<RemoveRoundedIcon />}
              </button>
              <div id="quantity">{itemQuantity}</div>
              <button
                className="quantity-change-buttons"
                onClick={() => {
                  increment();
                }}
              >
                {<AddRoundedIcon />}
              </button>
            </div> */}
              <div className="w-full h-auto flex flex-grow justify-evenly text-white my-8">
                <button
                  style={{ color: "black", border: "2px solid black" }}
                  className="border w-5/12 rounded-md h-12"
                  onClick={() => {
                    // if (currentProduct.variants) {
                    //   console.log("add Product");
                    //   setOverlayVisibility(true);
                    // } else {
                    //   if (cartButtonState() == "In cart") return;
                    //   modifyItemQuantity(currentProduct, itemQuantity);
                    //   console.log("Product added");
                    // }
                    if (currentProduct.variants == null) {
                      modifyItemQuantity(currentProduct, itemQuantity);
                      setProductModal(true);
                      OpenModal();
                      console.log("No Variant");
                    } else {
                      if (currentProduct.variants.length > 0) {
                        setShowVariant(true);
                        console.log("Variant Product");
                        setOpenPlay(false);
                      }
                    }
                  }}
                >
                  Add to Bag
                </button>
                <button
                  className="bg-[#0aad0a] hover:bg-[green] w-5/12 h-12 rounded-md"
                  onClick={() => openWordSearchGame()}
                  // onClick={() => {
                  //   // router.replace("/api/auth/login");
                  //   setOpenPlay(true);
                  //   if (currentProduct.variants == null) {
                  //     modifyItemQuantity(currentProduct, itemQuantity);
                  //     setShowGameSettingsOverlay(true);
                  //     console.log("No Variant");
                  //   } else {
                  //     if (currentProduct.variants.length > 0) {
                  //       setShowVariant(true);
                  //       console.log("Variant Product");
                  //     }
                  //   }
                  //   if (user && openPlay) {
                  //     setShowGameSettingsOverlay(true);
                  //     return;
                  //   }
                  // }}
                >
                  Play
                </button>
              </div>
              <Accordion>
                <AccordionSummary
                  style={{ padding: "15px" }}
                  expandIcon={<ExpandMoreRoundedIcon />}
                >
                  <h3 style={{ fontWeight: "bold" }}>Product Description</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  style={{ padding: "15px" }}
                  expandIcon={<ExpandMoreRoundedIcon />}
                >
                  <h3 style={{ fontWeight: "bold" }}>Size Guide</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </p>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  style={{ padding: "15px" }}
                  expandIcon={<ExpandMoreRoundedIcon />}
                >
                  <h3 style={{ fontWeight: "bold" }}>Shipping Info</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse malesuada lacus ex, sit amet blandit leo
                    lobortis eget.
                  </p>
                </AccordionDetails>
              </Accordion>
              <VendorPage>
                <div id="vendorData">
                  <p id="vendor-title">{currentProduct.vendor.title}</p>
                  <p id="more-vendor-info">
                    {`${currentProduct.vendorProductCount} Product${
                      currentProduct.vendorProductCount == 1 ? "" : "s"
                    } Available`}
                  </p>
                </div>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Link href={`/vendor/${currentProduct.vendor._id}`}>
                    <Image
                      src={urlFor(currentProduct.vendor.logo).url()}
                      alt="vendorLogo"
                      height={"60rem"}
                      width={"60rem"}
                      unoptimized={true}
                    />
                  </Link>
                </motion.div>
              </VendorPage>
              <h2
                style={{
                  marginTop: "50px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                More from this vendor
              </h2>
              <VendorProductsWrapper>
                {currentProduct?.moreFromVendor?.map((product, i) => (
                  <Link
                    href={`/product/${product.slug.current}`}
                    passHref
                    scroll
                    key={i}
                  >
                    <VendorProduct whileTap={{ scale: 0.9 }} key={product._id}>
                      <div
                        style={{
                          width: "100%",
                          height: "70%",
                          position: "relative",
                        }}
                      >
                        <Image
                          layout="fill"
                          objectFit="cover"
                          src={urlFor(
                            product.defaultProductVariant.images[0]
                          ).url()}
                          alt="Product Image"
                          unoptimized={true}
                        />
                      </div>
                      <div style={{ padding: "0 0.5rem" }}>
                        <h2>
                          {formatCurrency(product.defaultProductVariant.price)}
                        </h2>
                        <p>{product.title}</p>
                      </div>
                    </VendorProduct>
                  </Link>
                ))}
                {currentProduct.moreFromVendor.length === 0 ? (
                  <p>No more proudcts from this vendor</p>
                ) : null}
              </VendorProductsWrapper>
            </ProductInfoSection>
          </Wrapper>
        </>
      ) : (
        ""
      )}

      {showGameSettingsOverlay && (
        <ProudctVariantBackground
          id="variant-background"
          onClick={(e) => {
            console.log(e.target.id);
            if (e.target.id == "variant-background") {
              setShowGameSettingsOverlay(false);
            }
          }}
        >
          <motion.div
            id="overlay-container"
            initial={{ y: "70vh" }}
            animate={{ y: "0vh" }}
          >
            <p className="w-full">
              <ArrowBackIosNewIcon
                onClick={(e) => {
                  setShowGameSettingsOverlay(false);
                }}
              />
            </p>
            <form className="w-full h-auto" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-16 mt-8">
                <div className="flex flex-col w-full gap-y-2">
                  <label className="md:text-lg font-bold">
                    Number of attempts:
                  </label>
                  <input
                    className="w-full border-2 rounded-md h-12 p-2"
                    placeholder="how many attempts do you want?"
                    value={numberOfAttempts}
                    type="number"
                    required
                    onChange={(e) => {
                      setNumberOfAttempts(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col w-full gap-y-2">
                  <label className="md:text-lg font-bold">
                    Amount needed to pay:
                  </label>
                  <input
                    className="w-full border-2 rounded-md h-12 p-2"
                    placeholder="how much is needed to pay?"
                    value={amountToPay}
                    type="number"
                    required
                    onChange={(e) => {
                      setAmountToPay(numberOfAttempts * 100);
                    }}
                    // onChange={(e) => {
                    //   setNumberOfAttempts(e.target.value);
                    // }}
                  />
                </div>
              </div>

              {/* <span>Total cost: {formatCurrency(numberOfAttempts * 100)}</span> */}
              <button
                onClick={() => {
                  console.log("Play User");
                  handleGamePayment();
                }}
                className=" fixed bottom-0  md:right-0 bg-black text-white w-11/12 md:w-[420px] h-12 mb-12 md:mb-6 rounded-sm md:mx-4"
                type="submit"
              >
                pay
              </button>
            </form>
          </motion.div>
        </ProudctVariantBackground>
      )}
    </>
  );
};

export default ProductInfoOverlay;
