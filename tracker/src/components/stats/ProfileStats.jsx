import React, { useEffect, useContext, useState } from "react";
import { UserContext } from "../../App";
import axios from "axios";

//make api call to get session stats for current user
function ProfileStats() {
  const { userData, setUserData } = useContext(UserContext);

  // const [currentUserData, setCurrentUserData] = useState();

  console.log("userData", userData);

  return <div><p>{userData.user.username}</p></div>;
}

export default ProfileStats;
