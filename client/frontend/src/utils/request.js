import { GRAPHQL_SERVER } from "./constants";

export const graphQLRequest = async (payLoad, options = {}) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    const res = await fetch(`${GRAPHQL_SERVER}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ...options,
      },
      body: JSON.stringify(payLoad),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        return null;
      }
    }

    const { data } = await res.json();
    return data;
  }

  return null;
};
