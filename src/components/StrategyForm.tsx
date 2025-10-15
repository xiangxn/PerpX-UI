import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, BarChart3, DollarSign } from 'lucide-react';
import { Strategy, StrategyType } from '../types/strategy';

interface StrategyFormProps {
  strategy: Strategy | null;
  onSave: (strategy: Strategy) => void;
  onCancel: () => void;
}

const strategyTypes = [
  { id: 'VolatilitySpike', name: '波动尖峰', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { id: 'ConsecutiveMove', name: '连续移动', icon: BarChart3, color: 'from-purple-500 to-pink-500' },
  { id: 'FundingRate', name: '资金费率', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
];

export default function StrategyForm({ strategy, onSave, onCancel }: StrategyFormProps) {
  const [selectedType, setSelectedType] = useState<StrategyType>(strategy?.type || 'VolatilitySpike');
  const [formData, setFormData] = useState<any>(
    strategy || {
      symbol: '',
      period: '15m',
      volume: 1000000,
      turnover: 50000000,
      amplitudeMultiple: 2.5,
      count: 3,
      fundingRate: 0.01,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, type: selectedType } as Strategy);
  };

  const renderFields = () => {
    switch (selectedType) {
      case 'VolatilitySpike':
        return (
          <>
            <div>
              <label className="block text-white/70 text-sm mb-2">交易对</label>
              <input
                type="text"
                value={formData.symbol || ''}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="BTCUSDT"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">周期</label>
              <select
                value={formData.period || '15m'}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1m">1分钟</option>
                <option value="5m">5分钟</option>
                <option value="15m">15分钟</option>
                <option value="30m">30分钟</option>
                <option value="1h">1小时</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">成交量</label>
              <input
                type="number"
                value={formData.volume || ''}
                onChange={(e) => setFormData({ ...formData, volume: Number(e.target.value) })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">成交额</label>
              <input
                type="number"
                value={formData.turnover || ''}
                onChange={(e) => setFormData({ ...formData, turnover: Number(e.target.value) })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">振幅倍数</label>
              <input
                type="number"
                step="0.1"
                value={formData.amplitudeMultiple || ''}
                onChange={(e) => setFormData({ ...formData, amplitudeMultiple: Number(e.target.value) })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </>
        );
      case 'ConsecutiveMove':
        return (
          <>
            <div>
              <label className="block text-white/70 text-sm mb-2">交易对</label>
              <input
                type="text"
                value={formData.symbol || ''}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="ETHUSDT"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">周期</label>
              <select
                value={formData.period || '5m'}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="1m">1分钟</option>
                <option value="5m">5分钟</option>
                <option value="15m">15分钟</option>
                <option value="30m">30分钟</option>
                <option value="1h">1小时</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">连续次数</label>
              <input
                type="number"
                value={formData.count || ''}
                onChange={(e) => setFormData({ ...formData, count: Number(e.target.value) })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">成交额</label>
              <input
                type="number"
                value={formData.turnover || ''}
                onChange={(e) => setFormData({ ...formData, turnover: Number(e.target.value) })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </>
        );
      case 'FundingRate':
        return (
          <>
            <div>
              <label className="block text-white/70 text-sm mb-2">交易对</label>
              <input
                type="text"
                value={formData.symbol || ''}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="SOLUSDT"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">资金费率</label>
              <input
                type="number"
                step="0.0001"
                value={formData.fundingRate || ''}
                onChange={(e) => setFormData({ ...formData, fundingRate: Number(e.target.value) })}
                className="w-full bg-white/10 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <h1 className="text-3xl font-bold text-white">{strategy ? '编辑策略' : '添加策略'}</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
        >
          <X size={24} className="text-white" />
        </motion.button>
      </motion.div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-6 pb-20 scrollbar-hidden">
        <div>
          <label className="block text-white/70 text-sm mb-3">策略类型</label>
          <div className="grid grid-cols-1 gap-3">
            {strategyTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id as StrategyType)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-[2px] rounded-xl overflow-hidden ${
                    selectedType === type.id ? `bg-gradient-to-r ${type.color}` : 'bg-white/10'
                  }`}
                >
                  <div className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                    <Icon size={24} className="text-white" />
                    <span className="text-white font-medium">{type.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {renderFields()}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full bg-gradient-to-r ${
            strategyTypes.find(t => t.id === selectedType)?.color
          } text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-shadow`}
        >
          保存策略
        </motion.button>
      </form>
    </div>
  );
}
