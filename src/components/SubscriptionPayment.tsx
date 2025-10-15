import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Check, Zap, ArrowLeft } from 'lucide-react';

interface SubscriptionPaymentProps {
  onBack: () => void;
}

const plans = [
  { id: 'monthly', name: '月度订阅', price: '0.01', duration: '30天', badge: null },
  { id: 'quarterly', name: '季度订阅', price: '0.025', duration: '90天', badge: '省17%', popular: true },
  { id: 'yearly', name: '年度订阅', price: '0.08', duration: '365天', badge: '省33%' },
];

const wallets = [
  { id: 'metamask', name: 'MetaMask', logo: '🦊' },
  { id: 'okx', name: 'OKX Wallet', logo: '⭕' },
  { id: 'binance', name: 'Binance Wallet', logo: '🟡' },
];

export default function SubscriptionPayment({ onBack }: SubscriptionPaymentProps) {
  const [selectedPlan, setSelectedPlan] = useState('quarterly');
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    if (!selectedWallet) return;

    setIsPaying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPaying(false);
    alert('支付成功！感谢您的订阅。');
  };

  return (
    <div className="h-full w-full flex flex-col p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={24} className="text-white" />
          </motion.button>
          <h1 className="text-3xl font-bold text-white">订阅支付</h1>
        </div>
        <p className="text-white/60 ml-14">选择适合您的订阅计划</p>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20 scrollbar-hidden">
        <div className="space-y-3">
          {plans.map((plan, index) => (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative w-full p-[2px] rounded-2xl overflow-hidden ${
                selectedPlan === plan.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-white/10'
              } ${plan.popular ? 'ring-2 ring-green-400' : ''}`}
            >
              {plan.badge && (
                <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full z-10">
                  {plan.badge}
                </div>
              )}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full z-10 flex items-center gap-1">
                  <Zap size={12} />
                  最受欢迎
                </div>
              )}
              <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {selectedPlan === plan.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check size={16} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/60">ETH</span>
                </div>
                <p className="text-white/50 text-sm">{plan.duration}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">选择支付钱包</h2>
          <div className="space-y-3">
            {wallets.map((wallet, index) => (
              <motion.button
                key={wallet.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                onClick={() => setSelectedWallet(wallet.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-[2px] rounded-xl overflow-hidden ${
                  selectedWallet === wallet.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-white/10'
                }`}
              >
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{wallet.logo}</span>
                    <span className="text-white font-medium">{wallet.name}</span>
                  </div>
                  {selectedWallet === wallet.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Check size={16} className="text-white" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handlePayment}
          disabled={!selectedWallet || isPaying}
          whileHover={{ scale: selectedWallet && !isPaying ? 1.02 : 1 }}
          whileTap={{ scale: selectedWallet && !isPaying ? 0.98 : 1 }}
          className={`w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${
            !selectedWallet || isPaying ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
          }`}
        >
          <Wallet size={24} />
          {isPaying ? '处理中...' : '立即支付'}
        </motion.button>
      </div>
    </div>
  );
}
