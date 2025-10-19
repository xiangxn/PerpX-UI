import Long from "long";

export type StrategyType = 'VolatilitySpike' | 'ConsecutiveMove' | 'FundingRate';

export interface BaseStrategy {
  id: number;
  type: StrategyType;
  symbol: string;
  period: string;
}

export interface VolatilitySpikeStrategy extends BaseStrategy {
  type: 'VolatilitySpike';
  volume: number;
  turnover: number;
  amplitudeMultiple: number;
}

export interface ConsecutiveMoveStrategy extends BaseStrategy {
  type: 'ConsecutiveMove';
  count: number;
  turnover: number;
}

export interface FundingRateStrategy extends BaseStrategy {
  type: 'FundingRate';
  fundingRate: number;
}

export type Strategy = VolatilitySpikeStrategy | ConsecutiveMoveStrategy | FundingRateStrategy;

export interface UserProfile {
  telegramId: Long;
  telegramName: string;
  maxStrategies: number;
  active: boolean;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  email?: string;
  avatar?: string;
}
