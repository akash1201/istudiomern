import React from "react";
import { Link, useLocation } from "react-router-dom";
import Axios from "axios";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const QuicckBooksCallback = () => {
  let query = useQuery();
  let realmId = query.get("realmId");
  let state = query.get("state");
  let code = query.get("code");
  const msg='';
  console.log("code "+code);
   Axios.get("api/quickbooks/callback", {params:{ "realmId":realmId, "state":state, "code":code }})
    .then((res) => {
        alert("You have successfully updated quickbooks token")
        window.close();
    })
    .catch((e) => {
      console.log(e);
    });
  return <p>"Do not close this window  and do not refresh this page"</p>;
};
export default QuicckBooksCallback;
