// cards.type
export type CardType =
  | "resource"
  | "settlement";

// 所有 Card 共有字段
export type BaseCard = {
  id: number;
  createdAt: Date;

  name: string;
  description: string | null;
  icon: string | null;
  link: string;

  sectionId: number;
  featuredOrder: number | null;
};

// 聚落扩展信息
export type SettlementInfo = {
  id: number;

  cardId: number;
  userId: string;

  banner: string | null;
  rules: string | null;

  createdAt: Date;
  updatedAt: Date;

  status: string ;
};

// 普通资源卡
export type ResourceCard = BaseCard & {
  type: "resource";
};

// 聚落卡
export type SettlementCard = BaseCard & {
  type: "settlement";
  settlement: SettlementInfo;
};

// Card
export type Card =
  | ResourceCard
  | SettlementCard;