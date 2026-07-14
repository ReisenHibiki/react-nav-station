"use client";

import SettlementEmpty from "./SettlementEmpty";
import SettlementDetail from "./SettlementDetail";
import Loading from "@/components/Loading";
import { useSettlement } from "@/hooks/useSettlement";


export default function SettlementPage(){

  const {
    data,
    loading
  } = useSettlement();
  

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