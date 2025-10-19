import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, BarChart3, DollarSign, Edit2, Trash2 } from 'lucide-react';
import { animated } from '@react-spring/web';
import { ConsecutiveMoveStrategy, FundingRateStrategy, Strategy, StrategyType, VolatilitySpikeStrategy } from '../types/strategy';
import StrategyForm from './StrategyForm';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { useAuth } from '@/context/AuthContext';
import { formatNumberEN, printFloat } from '@/utils/helper';

interface StrategyManagementProps {
  onBack: () => void;
}

const typeConfig = {
  VolatilitySpike: { icon: TrendingUp, color: 'from-blue-500 to-cyan-500', name: '波动尖峰' },
  ConsecutiveMove: { icon: BarChart3, color: 'from-purple-500 to-pink-500', name: '连续移动' },
  FundingRate: { icon: DollarSign, color: 'from-green-500 to-emerald-500', name: '资金费率' },
};

function getParams(strategy: Strategy) {
  switch (strategy.type) {
    case 'VolatilitySpike':
      const vs = strategy as VolatilitySpikeStrategy
      return JSON.stringify({ volume: vs.volume, turnover: vs.turnover, amplitudeMultiple: vs.amplitudeMultiple })
    case 'ConsecutiveMove':
      const cm = strategy as ConsecutiveMoveStrategy
      return JSON.stringify({ count: cm.count, turnover: cm.turnover })
    case 'FundingRate':
      const fr = strategy as FundingRateStrategy
      return JSON.stringify({ fundingRate: fr.fundingRate })
    default:
      break;
  }
  return "{}"
}

export default function StrategyManagement({ onBack }: StrategyManagementProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const { bind, style } = useSwipeBack({ onBack });
  const { rpc, getToken, user } = useAuth()
  const [refresh, setRefresh] = useState(1)

  useEffect(() => {
    const getStrategies = async () => {
      const token = getToken()
      if (!token) return
      const res = await rpc.getStrategies({ token })
      console.log('getStrategies:', res)

      const datas: Strategy[] = []
      for (let s of res.strategies) {
        let strategy: Strategy
        switch (s.strategyType) {
          case "VolatilitySpike":
            strategy = {} as VolatilitySpikeStrategy
            const vss = JSON.parse(s.params)
            strategy.id = s.id
            strategy.symbol = s.symbol
            strategy.type = s.strategyType
            strategy.period = s.period
            strategy.volume = vss.volume
            strategy.turnover = vss.turnover
            strategy.amplitudeMultiple = vss.amplitudeMultiple
            datas.push(strategy)
            break;
          case "ConsecutiveMove":
            strategy = {} as ConsecutiveMoveStrategy
            const obj = JSON.parse(s.params)
            strategy.id = s.id
            strategy.symbol = s.symbol
            strategy.type = s.strategyType
            strategy.period = s.period
            strategy.count = obj.count
            strategy.turnover = obj.turnover
            datas.push(strategy)
            break;
          case "FundingRate":
            strategy = {} as FundingRateStrategy
            strategy.id = s.id
            strategy.symbol = s.symbol
            strategy.type = s.strategyType
            strategy.fundingRate = JSON.parse(s.params).fundingRate
            datas.push(strategy)
            break;
          default:
            break;
        }
      }

      setStrategies(datas)
    }
    getStrategies();
  }, [refresh])

  const handleDelete = async (id: number) => {
    const token = getToken()
    console.debug('handleDelete:', id, token)
    if (token) {
      const result = await rpc.deleteStrategy({
        token: token!,
        id: id
      })
      console.log('deleteStrategy:', result)
      if (result && result.success) {
        setStrategies(strategies.filter(s => s.id !== id));
        alert('删除成功')
      }
    }
  };

  const handleEdit = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setShowForm(true);
  };

  const handleSave = async (strategy: Strategy) => {
    const token = getToken()
    console.debug('handleSave:', strategy, token)
    if (token) {
      if (user!.maxStrategies === 0) {
        if (strategy.symbol === '*') {
          alert('您没有权限添加通配符策略')
          return
        }
      }
      if (editingStrategy) {
        // update existing strategy
        const result = await rpc.updateStrategy({
          token: token!,
          id: strategy.id,
          strategyType: strategy.type,
          symbol: strategy.symbol,
          period: strategy.period,
          params: getParams(strategy)
        })
        console.log('updateStrategy:', result)
        if (result && result.success) {
          setStrategies(strategies.map(s => s.id === strategy.id ? strategy : s));
          alert('更新成功')
        }
      } else {
        // add new strategy
        const result = await rpc.addStrategy({
          token: token!,
          strategyType: strategy.type,
          symbol: strategy.symbol,
          period: strategy.period,
          params: getParams(strategy)
        })
        console.log('addStrategy:', result)
        if (result && result.success) {
          setRefresh(refresh + 1)
          alert('添加成功')
        }
      }
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
    <animated.div {...bind()} style={style} className="h-full w-full flex flex-col p-6 overflow-hidden mt-2">
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
                            <span className="text-white ml-2">{formatNumberEN(strategy.volume)}</span>
                          </div>
                          <div className="bg-white/5 rounded-lg p-2">
                            <span className="text-white/50">成交额:</span>
                            <span className="text-white ml-2">{formatNumberEN(strategy.turnover)}</span>
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
                            <span className="text-white ml-2">{formatNumberEN(strategy.turnover)}</span>
                          </div>
                        </>
                      )}
                      {strategy.type === 'FundingRate' && (
                        <div className="bg-white/5 rounded-lg p-2 col-span-2">
                          <span className="text-white/50">费率:</span>
                          <span className="text-white ml-2">{printFloat(strategy.fundingRate * 100, 4)}%</span>
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
    </animated.div>
  );
}
