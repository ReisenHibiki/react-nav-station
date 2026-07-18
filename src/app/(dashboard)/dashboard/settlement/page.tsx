"use client";

import SettlementEmpty from "./SettlementEmpty";
import SettlementDetail from "./SettlementDetail";
import Skeleton from "@/components/Skeleton";
import { useSettlement } from "@/hooks/useSettlement";


export default function SettlementPage(){

  const {
    data,
    loading
  } = useSettlement();
  

  if(loading){
    return (
      <div>
        <Skeleton/>
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