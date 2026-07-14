import SettlementForm from "@/components/settlement/SettlementForm";


export default function EditSettlementPage(){

  return (

    <SettlementForm

      mode="edit"

      settlementId={3}

      initialData={{

        name:"测试聚落",

        description:"xxx",

        rules:"xxx",

        status:"active"

      }}

    />

  );

}