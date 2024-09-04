import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api/axios";
import { AxiosInstance } from "axios";

export const useSplitsData = (currentUser: { id: any; email: any; }, interceptor: AxiosInstance, triggerRefresh: unknown) => {
  const [activeSplitList, setActiveSplitList] = useState([]);
  const [paidSplitList, setPaidSplitList] = useState([]);
  const [splitstoPay, setSplitsToPay] = useState([]);
  const [invitedtoPay, setInvitedToPay] = useState([]);

  useEffect(() => {
    const endPoints = [
      { url: `/api/payments?status=active&initiator=${currentUser.id}`, toState: "active" },
      { url: `/api/payments?status=paid&initiator=${currentUser.id}`, toState: "paid" },
      { url: `/api/payments?status=toPay&email=${currentUser.email}`, toState: "topay" },
      { url: `/api/payments?status=invited&email=${currentUser.email}`, toState: "invited" },
    ];

    const fetchData = async () => {
      const requests = endPoints.map(endPoint => apiRequest(interceptor, endPoint.url, "get"));
      const responses = await Promise.all(requests);
      responses.forEach((response, index) => {
        if (response?.status === 200) {
          const list = response.data.reverse();
          const stateSetter: any = {
            active: setActiveSplitList,
            paid: setPaidSplitList,
            topay: setSplitsToPay,
            invited: setInvitedToPay,
          }[endPoints[index].toState];
          stateSetter(list);
        }
      });
    };

    fetchData();
  }, [triggerRefresh]);

  return { activeSplitList, paidSplitList, splitstoPay, invitedtoPay };
};
