import Link from "next/link";


export default function SettlementEmpty(){


  return (

    <div className="flex gap-2 h-3/5 items-center justify-around">

      <Link
        href="/dashboard/settlement/create"
        className="
        w-64 h-40
        bg-white
        rounded-xl
        shadow
        flex
        items-center
        justify-center
        "
      >

        创建聚落

      </Link>



      <Link
        href="/dashboard/settlement/search"
        className="
        w-64 h-40
        bg-white
        rounded-xl
        shadow
        flex
        items-center
        justify-center
        "
      >

        搜索加入

      </Link>


    </div>

  );

}