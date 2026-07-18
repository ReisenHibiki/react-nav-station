export const COIN_SCALE = 100;

export function formatCoins(value:number){
  return (value / 100).toFixed(2);
}

export function parseCoins(value:number){
  return Math.round(value * 100);
}

export type Wallet = {
  id: number;
  userId:string;
  balance: number;
  totalEarned: number;
  lastCheckIn: string | null;
  updatedAt: string;
};