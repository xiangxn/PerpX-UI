export type StrategyType = 'VolatilitySpike' | 'ConsecutiveMove' | 'FundingRate';

export interface BaseStrategy {
  id: string;
  type: StrategyType;
  createdAt: string;
}

export interface VolatilitySpikeStrategy extends BaseStrategy {
  type: 'VolatilitySpike';
  symbol: string;
  period: string;
  volume: number;
  turnover: number;
  amplitudeMultiple: number;
}

export interface ConsecutiveMoveStrategy extends BaseStrategy {
  type: 'ConsecutiveMove';
  symbol: string;
  period: string;
  count: number;
  turnover: number;
}

export interface FundingRateStrategy extends BaseStrategy {
  type: 'FundingRate';
  symbol: string;
  fundingRate: number;
}

export type Strategy = VolatilitySpikeStrategy | ConsecutiveMoveStrategy | FundingRateStrategy;

export interface UserProfile {
  telegramId: number;
  telegramName: string;
  maxStrategies: number;
  active: boolean;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  email?: string;
  avatar?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  duration: string;
  txHash: string;
}
