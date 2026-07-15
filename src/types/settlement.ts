// This is for dashboard/settlement page/component/api that related to settlement
import { SETTLEMENT_STATUS } from "@/types/card";

// 为dashboard聚落页面的返回数据约束type
export type Settlement = {
  id:number;
  cardId:number;
  createdBy:string;
  banner:string|null;
  rules:string|null;
  status:string;

  card:{
    name:string;
    description:string|null;
    icon:string|null;
    link:string|null;
  };

  members:Member[];
};

export type  Member = {
    id:number;
    userId:string;
    role:"owner"|"member";
    joinedAt:string;
    username: string;
    avatar: string
  }

// 为前端创建/编辑表单的type
export type SettlementStatus =
  | typeof  SETTLEMENT_STATUS.RECRUITING
  | typeof  SETTLEMENT_STATUS.ACTIVE
  | typeof  SETTLEMENT_STATUS.AFK;


export type SettlementFormData = {

  name:string;
  description:string;
  rules:string;
  status:SettlementStatus;

};