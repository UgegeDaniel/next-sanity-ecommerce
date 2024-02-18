import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "./config";
import { initializeApp } from "firebase/app";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const fbUsersRef = collection(db, "users");
const fbPaymentRef = collection(db, "payments");

// Types
export type FbUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: "Male" | "Female" | "";
  walletBalance: number;
  attemptsBalance: number;
};

type Auth0User = {
  given_name: string;
  family_name: string;
  email: string;
  sub: string;
  nickname: string;
};

type Transaction = {
  reference: string;
};

const useAppAuth = () => {
  // Function for finding a user by email
  const findUserByEmail = async (email: string): Promise<FbUser | null> => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        let userData: FbUser | null = null;
        querySnapshot.forEach((doc) => {
          userData = { ...doc.data(), id: doc.id } as FbUser;
        });
        return userData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  };


  // Function for storing user to Firebase
  const storeUserToFirebase = async (user: Auth0User) => {
    if (user) {
      const userFromFirebase = await findUserByEmail(user.email);
      if (!userFromFirebase) {
        const newUser = await createNewUserInFirebase(user);
        localStorage.setItem("user", JSON.stringify(newUser));
        return;
      } else {
        const existingUserDoc = userFromFirebase;
        localStorage.setItem("user", JSON.stringify(existingUserDoc));
        return;
      }
    }
  };
  const getUserFromLocalStorage = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString;
    } catch (error) {
      console.error("Error retrieving user from local storage:", error);
      return null;
    }
  };
  // Helper function to save new payment reference in Firebase
  const saveNewPaymentRefInFirebase = async (
    email: string,
    reference: string,
    amount: number
  ) => {
    await addDoc(fbPaymentRef, {
      email,
      reference,
      amount,
    });
  };

  // Helper function to create a new user in Firebase
  const createNewUserInFirebase = async (user: Auth0User) => {
    const newUserRef = await addDoc(fbUsersRef, {
      firstName: user.given_name,
      lastName: user.family_name,
      email: user.email,
      dob: "",
      gender: "",
      walletBalance: 0,
      attemptsBalance: 0,
      sub: user.sub,
      nickname: user.nickname,
      phone: "",
      country: "",
      state: "",
      city: "",
      address1: "",
      address2: "",
    });
    const newUserSnapshot = await getDoc(newUserRef);
    return newUserSnapshot.data();
  };

  async function getDocumentIdByEmail(email: string) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      } else {
        console.error("No document found with the provided email.");
        return null;
      }
    } catch (error) {
      console.error("Error getting document ID from Firebase:", error);
      return null;
    }
  }

  async function updateFieldsInFirebase(
    userEmail: string,
    fieldsToUpdate: Partial<FbUser>
  ) {
    const documentId = (await getDocumentIdByEmail(userEmail)) as string;
    const filteredProfile: Partial<FbUser> = Object.fromEntries(
      Object.entries(fieldsToUpdate).filter(([_, value]) => value !== undefined)
    );
    try {
      const docRef = doc(db, "users", documentId);
      const existingUserData = (await getDoc(docRef)).data() as FbUser;
      const updatedUserData = { ...existingUserData, ...filteredProfile };
      await updateDoc(docRef, updatedUserData);
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      return true; // Return true to indicate successful update
    } catch (error) {
      console.error("Error updating document in Firebase:", error);
      return false; // Return false to indicate error in update
    }
  }

  return {
    storeUserToFirebase,
    getUserFromLocalStorage,
    updateFieldsInFirebase,
    saveNewPaymentRefInFirebase
  };
};

export default useAppAuth;
