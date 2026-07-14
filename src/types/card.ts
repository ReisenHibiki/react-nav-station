export const CARD_TYPE = {
  RESOURCE: "resource",
  SETTLEMENT: "settlement",
} as const;

export type CardType =
  typeof CARD_TYPE[keyof typeof CARD_TYPE];

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

  banner: string | null;
  rules: string | null;

  createdAt: Date;
  updatedAt: Date;

  status: (typeof SETTLEMENT_STATUS)[keyof typeof SETTLEMENT_STATUS] ;
};
// SettlementInfo中status种类约束
export const SETTLEMENT_STATUS = {
  RECRUITING: "recruiting",
  ACTIVE: "active",
  AFK: "afk",
} as const;
export type StatusType =
  typeof SETTLEMENT_STATUS[keyof typeof SETTLEMENT_STATUS];

// 普通资源卡
export type ResourceCard = BaseCard & {
  type: typeof CARD_TYPE.RESOURCE;
};

// 聚落卡
export type SettlementCard = BaseCard & {
  type: typeof CARD_TYPE.SETTLEMENT;
  settlement: SettlementInfo;
};

// Card
export type Card =
  | ResourceCard
  | SettlementCard;