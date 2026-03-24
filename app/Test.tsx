"use client";
import { useAuth } from "@clerk/nextjs";
import { clientApi } from "@/lib/apiClient.client";

const Test = () => {
  const { getToken } = useAuth();
  const handleClick = async () => {
    const response = await clientApi.get("/api/jobs", { getToken });
    console.log(response.data, "I am test response");
  };

  return (
    <div>
      Test
      <button onClick={handleClick}>Fetch Just</button>
    </div>
  );
};

export default Test;
