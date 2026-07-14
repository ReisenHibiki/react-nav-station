import SettlementForm from "@/components/settlement/SettlementForm";


export default function CreateSettlementPage(){

  return (

    <main
      className="
      min-h-screen
      flex
      justify-center
      items-center
      bg-gray-100
      px-4
      "
    >

      <SettlementForm
        mode="create"
      />

    </main>

  );

}