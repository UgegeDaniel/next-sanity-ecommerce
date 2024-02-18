import React, { useState, useEffect } from "react";
// import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from "@headlessui/react";
import { sanityClient } from "../../../lib/sanity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAppAuth, { FbUser } from "../../../utils/firebase";

const MyDetails = () => {
  // const { user, error } = useUser();
  const { getUserFromLocalStorage, updateFieldsInFirebase } = useAppAuth();
  const user = getUserFromLocalStorage();
  const [profileDetails, setProfileDetails] = useState<any>("");
  const [userId, setUserId] = useState<string>("");

  const [firstName, setFirstname] = useState((JSON.parse(user!)?.firstName));
  const [lastName, setLastname] = useState(JSON.parse(user!)?.lastName);
  const [email, setEmail] = useState(JSON.parse(user!)?.email);
  const [dob, setDob] = useState(JSON.parse(user!)?.dob);
  const [gender, setGender] = useState(JSON.parse(user!)?.gender);

  const [userdetails, setUserdetails] = useState<Partial<FbUser>>({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
  });

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setUserdetails((prevValues) => ({ ...prevValues, [name]: value }));
  // };
  // const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const updatedUserDetails = { ...userdetails, gender: e.target.value };
  //   setUserdetails(updatedUserDetails);
  // };

  useEffect(() => {
    // const getUID = async () => {
    //   const data = await sanityClient.fetch<{ _id: string }[]>(
    //     `
    //       *[_type == 'users' && email == $auth0ID]{
    //         _id
    //       }`,
    //     { auth0ID: JSON.parse(user!)?.email }
    //   );

    //   setUserId(data[0]?._id || "");
    //   console.log(data);
    // };
    if(user){
      setProfileDetails(JSON.parse(user!))
    }
    // getUID();
  }, [user]);

  useEffect(() => {
    async function getDetails() {
      if (!user) return;

      const results = await sanityClient.fetch(
        `*[_type == "users" && email == "${JSON.parse(user!)?.email}"] {
              _id,
              firstName,
              lastName, 
              dob,
              email,
              gender,
              userId
      }`
      );

      setProfileDetails(results);
    }
    getDetails();
  }, [user]);

  // useEffect(() => {
  //   if (profileDetails != "") {
  //     setFirstname(profileDetails.firstName);
  //     setLastname(profileDetails.lastName);
  //     // setEmail(profileDetails[0].email)
  //     setDob(profileDetails.dob);
  //     setGender(profileDetails.gender);
  //   }
  // }, [profileDetails]);

  const handleSaveChanges = async () => {
    // This'll send user's details to Sanity if user's details weren't found there
    if (profileDetails == "") {
      const userDetails = {
        _type: "users",
        // userId: auth0ID,
        firstName: firstName,
        lastName: lastName,
        email: JSON.parse(user!)?.email,
        dob: dob,
        gender: gender,
      };

      sanityClient.create(userDetails);
    }

    if (profileDetails != "") {
      var id = profileDetails[0]._id;
      const userDetails = {
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
      };

      sanityClient.patch(id).set(userDetails).commit();
    }

    // Prepare the data to send to the server

    const data = {
      _id: userId, // You should set this based on your data structure
      firstName: userdetails.firstName,
      lastName: userdetails.lastName,
      dob: userdetails.dob,
      gender: userdetails.gender,
    };

    toast.info("Updating Profile...", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    fetch("/api/updateUser", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Error Updating Profile 😞", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          updateFieldsInFirebase(JSON.parse(user!)?.email, {
            firstName,
            lastName,
            dob,
            gender,
          });
          toast.success("Profile Updated Successfully 😉", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch((err) => {
        console.log(err, "This didn't");
      });
  };
  return (
    <>
      <div className="mx-4 mb-12">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveChanges();
          }}
        >
          <div className="w-12/12 h-auto border-gray-300">
            <div className=" px-2 py-3">
              <h3 className="text-base font-medium text-gray-600 mb-2">
                FIRST NAME
              </h3>
              <input
                type="text"
                name="firstName"
                className="text-base h-8 outline-none w-full placeholder-gray-700"
                placeholder={profileDetails?.firstName || ""}
                onChange={(e) => {
                  setFirstname(e.target.value);
                }}
                value={firstName}
                required
              />
            </div>
            <div className="border-t border-t-gray-300 px-2 py-3">
              <h3 className="text-base font-medium text-gray-600 mb-2">
                LAST NAME
              </h3>
              <input
                type="text"
                name="lastName"
                className="text-base h-8 outline-none w-full placeholder-gray-700"
                placeholder={profileDetails?.lastName || ""}
                onChange={(e) => {
                  setLastname(e.target.value);
                }}
                required
                value={lastName}
              />
            </div>
            <div className="border-t border-t-gray-300 px-2 py-3">
              <h3 className="text-base font-medium text-gray-600 mb-[10px]">
                EMAIL ADDRESS
              </h3>

              <div className="text-base h-8 outline-none w-full">
                {JSON.parse(user!)?.email}
              </div>
            </div>
            <div className="border-t border-t-gray-300 px-2 py-3">
              <h3 className="text-base font-medium text-gray-600 mb-2">
                DATE OF BIRTH
              </h3>
              <input
                type="date"
                name="dob"
                className="text-base h-8 outline-none"
                onChange={(e) => {
                  setDob(e.target.value);
                }}
                value={dob}
                required
              />
            </div>
            <div className="border-t border-t-gray-300 px-2 py-3">
              <h3 className="text-base font-medium text-gray-600 mt-8 mb-2">
                GENDER
              </h3>
              <div className="text-base mb-8 flex flex-col gap-y-2">
                <div className="flex gap-x-4">
                  <input
                    type="radio"
                    value="Male"
                    name="gender"
                    id="male"
                    checked={gender === "Male"}
                    required
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="border-t border-t-gray-300"></div>
                <div className="flex gap-x-4 ">
                  <input
                    type="radio"
                    value="Female"
                    name="gender"
                    id="female"
                    checked={gender === "Female"}
                    onChange={(e) => {
                      setGender(e.target.value);
                    }}
                  />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
            </div>
          </div>

          <div className=" mt-8 w-12/12">
            <button
              type="submit"
              className="h-12 bg-black text-white rounded-md w-full "
            >
              {profileDetails == "" ? "SAVE DETAILS" : "UPDATE DETAILS"}
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </>
  );
};

export default MyDetails;
