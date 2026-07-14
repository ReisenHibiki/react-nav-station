"use client";

import { useEffect, useState } from "react";
import SettlementEmpty from "./SettlementEmpty";
import SettlementDetail from "./SettlementDetail";
import Loading from "@/components/Loading";
import { Settlement } from "@/types/settlement";

type SettlementResponse = {
  settlement: Settlement | null;
  role?: "owner" | "member";
};


export default function SettlementPage(){

  const [data,setData] = useState<SettlementResponse | null>(null);

  const [loading,setLoading] = useState(true);


  useEffect(()=>{

    async function fetchSettlement(){

      try{

        const res = await fetch("/api/settlement");


        if(!res.ok){
          throw new Error("Failed to fetch settlement");
        }


        const result =
          await res.json();


        setData(result);
        console.log(result)


      }catch(error){

        console.error(error);

      }finally{

        setLoading(false);

      }

    }


    fetchSettlement();


  },[]);



  if(loading){
    return (
      <div>
        <Loading size="lg" text="加载中..."/>
      </div>
    );

  }



  if(!data?.settlement){

    return (
      <SettlementEmpty/>
    );

  }


  return (
    <SettlementDetail
      settlement={data.settlement}
      role={data.role!}
    />
  );

}