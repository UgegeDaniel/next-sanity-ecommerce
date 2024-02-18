import React from "react";
import Link from "next/link";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { UseUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { ProfileNav, Wrapper } from "../../components/Home/home.styles";
import Addressbook from "../../components/profilePage/detailsPage/mydetails";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import MyDetails from "../../components/profilePage/detailsPage/mydetails";

const Details = () => {
  return (
    <>
      <div>
        <ProfileNav>
          <Link href="/profile">
            <div className="">
              <ArrowBackRoundedIcon />
            </div>
          </Link>
          <header>My Details</header>
        </ProfileNav>
      </div>
      <Wrapper>
        <MyDetails />
      </Wrapper>
    </>
  );
};

export default Details;
export const getServerSideProps = withPageAuthRequired();
