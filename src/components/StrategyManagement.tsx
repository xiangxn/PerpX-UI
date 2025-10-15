import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGesture } from 'react-use-gesture';
import { Plus, TrendingUp, BarChart3, DollarSign, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Strategy, StrategyType } from '../types/strategy';
import StrategyForm from './StrategyForm';

interface StrategyManagementProps {
  onBack: () => void;
}

const mockStrategies: Strategy[] = [
  {
    id: '1',
    type: 'VolatilitySpike',
    symbol: 'BTCUSDT',
    period: '15m',
    volume: 1000000,
    turnover: 50000000,
    amplitudeMultiple: 2.5,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'ConsecutiveMove',
    symbol: 'ETHUSDT',
    period: '5m',
    count: 3,
    turnover: 20000000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    type: 'FundingRate',
    symbol: 'SOLUSDT',
    fundingRate: 0.01,
    createdAt: new Date().toISOString(),
  },
];

const typeConfig = {
  VolatilitySpike: { icon: TrendingUp, color: 'from-blue-500 to-cyan-500', name: '波动尖峰' },
  ConsecutiveMove: { icon: BarChart3, color: 'from-purple-500 to-pink-500', name: '连续移动' },
  FundingRate: { icon: DollarSign, color: 'from-green-500 to-emerald-500', name: '资金费率' },
};

export default function StrategyManagement({ onBack }: StrategyManagementProps) {
  const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies);
  const [showForm, setShowForm] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);

  const bind = useGesture({
    onDrag: ({ movement: [mx], velocity, down }) => {
      if (!down && mx > 150 && velocity > 0.2) {
        onBack();
      }
    },
  });

  const handleDelete = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setShowForm(true);
  };

  const handleSave = (strategy: Strategy) => {
    if (editingStrategy) {
      setStrategies(strategies.map(s => s.id === strategy.id ? strategy : s));
    } else {
      setStrategies([...strategies, { ...strategy, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    }
    setShowForm(false);
    setEditingStrategy(null);
  };

  if (showForm) {
    return (
      <StrategyForm
        strategy={editingStrategy}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false);
          setEditingStrategy(null);
        }}
      />
    );
  }

  return (
    <div {...bind()} className="h-full w-full flex flex-col p-6 overflow-hidden mt-2">
      <div className="flex items-center justify-between mb-6" >
        <div className="flex items-center justify-center w-full gap-3">
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </motion.button> */}
          <h1 className="text-3xl font-bold text-white">策略管理</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow z-50"
        >
          <Plus size={20} />
          添加
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-20 scrollbar-hidden">
        {Object.entries(
          strategies.reduce((acc, strategy) => {
            if (!acc[strategy.type]) acc[strategy.type] = [];
            acc[strategy.type].push(strategy);
            return acc;
          }, {} as Record<StrategyType, Strategy[]>)
        ).map(([type, items]) => {
          const config = typeConfig[type as StrategyType];
          const Icon = config.icon;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-white/70">
                <Icon size={18} />
                <span className="text-sm font-medium">{config.name}</span>
              </div>

              {items.map((strategy, index) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-gradient-to-br ${config.color} p-[2px] rounded-2xl overflow-hidden group`}
                >
                  <div className="bg-slate-800/90 backdrop-blur-sm p-5 rounded-2xl">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{strategy.symbol || '未命名'}</h3>
                        <div className="flex items-center gap-2">
                          <Icon size={16} className="text-white/60" />
                          <span className="text-sm text-white/60">{config.name}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(strategy)}
                          className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Edit2 size={16} className="text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(strategy.id)}
                          className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {strategy.type === 'VolatilitySpike' && (
                        <>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">周期:</span>
                            <span className="text-white ml-2">{strategy.period}</span>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">倍数:</span>
                            <span className="text-white ml-2">{strategy.amplitudeMultiple}x</span>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">成交量:</span>
                            <span className="text-white ml-2">{(strategy.volume / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">成交额:</span>
                            <span className="text-white ml-2">{(strategy.turnover / 1000000).toFixed(1)}M</span>
                          </div>
                        </>
                      )}
                      {strategy.type === 'ConsecutiveMove' && (
                        <>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">周期:</span>
                            <span className="text-white ml-2">{strategy.period}</span>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">次数:</span>
                            <span className="text-white ml-2">{strategy.count}</span>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2 col-span-2">
                            <span className="text-white/50">成交额:</span>
                            <span className="text-white ml-2">{(strategy.turnover / 1000000).toFixed(1)}M</span>
                          </div>
                        </>
                      )}
                      {strategy.type === 'FundingRate' && (
                        <div className="bg-white/5 rounded-lg p-2 col-span-2">
                          <span className="text-white/50">费率:</span>
                          <span className="text-white ml-2">{(strategy.fundingRate * 100).toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
