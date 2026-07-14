type Settlement = {

  id:number;

  cardId:number;

  createdBy:string;

  banner:string|null;

  rules:string|null;

  status:string;

};


type Props={

  settlement:Settlement;

  role:"owner"|"member";

};



export default function SettlementDetail({

  settlement,

  role

}:Props){



  return (

    <div>


      <h1>
        聚落 ID:
        {settlement.id}
      </h1>


      <p>
        状态:
        {settlement.status}
      </p>



      {
        role==="owner" &&

        <div>

          <button>
            修改聚落
          </button>


          <button>
            管理成员
          </button>


        </div>
      }



      <button>
        退出聚落
      </button>


    </div>

  );

}