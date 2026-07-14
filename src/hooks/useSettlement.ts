// 聚落管理许多页面需要fetch数据，先自定义hook之后学TanstackQuery修改优化
"use client";
import { useEffect, useState } from "react";
import { Settlement } from "@/types/settlement";


type SettlementResponse = {
  settlement: Settlement | null;
  role?: "owner" | "member";
};


export function useSettlement(){

  const [data,setData] = useState<SettlementResponse | null>(null);
  const [loading,setLoading] = useState(true);


  async function fetchSettlement(){

    try{

      const res = await fetch("/api/settlement");

      if(!res.ok){
        throw new Error("Failed to fetch settlement");
      }

      const result = await res.json();

      setData(result);

    }catch(error){

      console.error(error);

    }finally{

      setLoading(false);

    }

  }

  useEffect(()=>{

    fetchSettlement();

  },[]);

  return {
    data,
    loading,
    refresh:fetchSettlement
  };

}