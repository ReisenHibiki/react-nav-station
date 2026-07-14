"use client";

import SettlementForm from "@/components/settlement/SettlementForm";
import Loading from "@/components/Loading";
import { useSettlement } from "@/hooks/useSettlement";
import { SettlementStatus } from "@/types/settlement";


export default function EditSettlementPage(){

  const {
    data,
    loading
  } = useSettlement();


  if(loading){
    return (
      <Loading size="lg" text="加载中..." />
    );
  }


  if(!data?.settlement){
    return (
      <div>
        暂无聚落
      </div>
    );
  }


  const settlement = data.settlement;


  return (
    <SettlementForm

      mode="edit"

      initialData={{

        name:settlement.card.name,

        description:settlement.card.description ?? "",

        rules:settlement.rules ?? "",

        status:settlement.status as SettlementStatus

      }}

    />
  );

}