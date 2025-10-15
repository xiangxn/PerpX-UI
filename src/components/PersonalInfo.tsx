import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Receipt, Edit2, Check, X, ArrowLeft } from 'lucide-react';
import { PaymentRecord, UserProfile } from '../types/strategy';

interface PersonalInfoProps {
  onBack: () => void;
}

const mockProfile: UserProfile = {
  telegramId: '@crypto_trader_123',
  email: 'user@example.com',
  avatar: '👤',
  subscriptionDays: 30,
};

const mockPayments: PaymentRecord[] = [
  {
    id: '1',
    date: '2024-10-15',
    amount: 25,
    duration: '季度订阅',
    txHash: '0x1234...5678',
  },
  {
    id: '2',
    date: '2024-07-15',
    amount: 25,
    duration: '季度订阅',
    txHash: '0x8765...4321',
  },
  {
    id: '3',
    date: '2024-04-15',
    amount: 10,
    duration: '月度订阅',
    txHash: '0xabcd...efgh',
  },
];

export default function PersonalInfo({ onBack }: PersonalInfoProps) {
  const [profile, setProfile] = useState(mockProfile);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(profile.email);

  const handleSaveEmail = () => {
    setProfile({ ...profile, email: newEmail });
    setIsEditingEmail(false);
  };

  const handleCancelEdit = () => {
    setNewEmail(profile.email);
    setIsEditingEmail(false);
  };

  return (
    <div className="h-full w-full flex flex-col p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </motion.button>
        <h1 className="text-3xl font-bold text-white">个人信息</h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20 scrollbar-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{profile.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">欢迎回来!</h2>
              <p className="text-white/60">管理您的账户信息</p>
            </div>
            <div className="ml-auto bg-white/5 rounded-xl p-3">
              <p className="text-white/50 text-sm">订阅剩余</p>
              <p className="text-cyan-400 font-bold">{profile.subscriptionDays} 天</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
              <User size={20} className="text-white/60" />
              <div className="flex-1">
                <p className="text-white/50 text-sm">Telegram ID</p>
                <p className="text-white font-medium">{profile.telegramId}</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-white/60" />
                  <div>
                    <p className="text-white/50 text-sm">邮箱地址</p>
                    {isEditingEmail ? (
                      <input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="bg-white/10 text-white rounded-lg px-3 py-1 mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        autoFocus
                      />
                    ) : (
                      <p className="text-white font-medium">{profile.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {isEditingEmail ? (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSaveEmail}
                        className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                      >
                        <Check size={18} className="text-green-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancelEdit}
                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <X size={18} className="text-red-400" />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsEditingEmail(true)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <Edit2 size={18} className="text-white" />
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Receipt size={20} className="text-white/70" />
            <h2 className="text-xl font-bold text-white">支付记录</h2>
          </div>

          <div className="space-y-3">
            {mockPayments.map((payment, index) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{payment.duration}</span>
                  <span className="text-green-400 font-bold">{payment.amount} USDT</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between text-white/50">
                    <span>日期:</span>
                    <span>{payment.date}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/50">
                    <span>交易哈希:</span>
                    <span className="font-mono">{payment.txHash}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
