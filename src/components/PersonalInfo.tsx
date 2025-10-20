import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, Receipt, Edit2, Check, X, Bell, Users } from 'lucide-react';
import { useSwipeBack } from '@/hooks/useSwipeBack';
import { animated } from '@react-spring/web';
import { useAuth } from '@/context/AuthContext';
import { Invoice, ProfileResponse } from '@/grpc/perpx';
import dayjs from 'dayjs';
import { capitalizeFirstLetter, cutTxId } from '@/utils/helper';
import { postEvent } from "@tma.js/sdk-react"

interface PersonalInfoProps {
  onBack: () => void;
}

declare global {
  interface Window {
    Telegram?: any;
  }
}

function showTxId(chain: string, txId: string) {
  const cTx = cutTxId(txId)
  switch (chain) {
    case 'BSC':
      return (
        <a href={`https://bscscan.com/tx/${txId}`} target="_blank" className="text-cyan-400">
          {cTx}
        </a>
      )
    default:
      return cTx
  }
}

function getDays(userInfo: ProfileResponse) {
  if (userInfo.subscriptionEnd) {
    const start = new Date()
    const end = new Date(userInfo.subscriptionEnd)
    const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    return Math.round(days)
  }
  return 0
}

function ShowInfo({ userInfo }: { userInfo: ProfileResponse }) {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingBind, setIsEditingBind] = useState(false);
  const [newEmail, setNewEmail] = useState(userInfo.email);
  const [profile, setProfile] = useState(userInfo);
  const { rpc, getToken } = useAuth()
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [payments, setPayments] = useState<Invoice[]>([]);

  let bindInfo: string[] = []
  if (userInfo.telegramChatId) {
    bindInfo.push(userInfo.telegramChatId)
  }
  if (userInfo.telegramThreadId) {
    bindInfo.push(userInfo.telegramThreadId)
  }

  const handleSaveEmail = async () => {
    const res = await rpc.updateEmail({ token: getToken()!, email: newEmail })
    if (res.success) {
      setProfile({ ...profile, email: newEmail });
    }
    setIsEditingEmail(false);
  };

  const handleCancelEdit = () => {
    setNewEmail(profile.email);
    setIsEditingEmail(false);
  };

  const handleBindGroup = () => {
    postEvent("web_app_switch_inline_query", { query: `bn_ticker_bot?start=bind_group`, chat_types: ['groups'] })
    setIsEditingBind(false)
  };
  const handleBindUser = () => {
    postEvent("web_app_open_tg_link", { path_full: `bn_ticker_bot?start=bind_user` })
    setIsEditingBind(false)
  };

  useEffect(() => {
    const getPayments = async () => {
      const res = await rpc.getInvoices({ token: getToken()!, page, pageSize })
      console.debug('getInvoices:', res)
      setPayments(res.invoices)
    }
    getPayments()
  }, [userInfo, page])

  return (
    <div className="flex-1 overflow-y-auto space-y-6 pb-20 scrollbar-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm p-6 rounded-2xl border border-white/10"
      >
        <div className="flex items-center gap-4 mb-4">
          {profile.avatar ? (
            <div className="text-5xl"><img src={profile.avatar} className="w-12 h-12" /></div>
          ) : (
            <div className="text-5xl">👤</div>
          )}

          <div>
            <h2 className="text-2xl font-bold text-white">欢迎回来!</h2>
            <p className="text-white/60">管理您的账户信息</p>
          </div>
          <div className="ml-auto bg-white/5 rounded-xl p-3">
            <p className="text-white/50 text-sm">订阅剩余</p>
            <p className="text-cyan-400 font-bold">{getDays(profile)} 天</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
            <User size={20} className="text-white/60" />
            <div className="flex-1">
              <p className="text-white/50 text-sm">Telegram Name</p>
              <p className="text-white font-medium">{profile.telegramName}</p>
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
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-white/60" />
                <div>
                  <p className="text-white/50 text-sm">Bot绑定信息</p>
                  <p className="text-white font-medium">{bindInfo.join(',')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditingBind ? (
                  <>
                    <motion.button
                      title='绑定用户'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBindUser}
                      className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <User size={18} className="text-green-400" />
                    </motion.button>
                    <motion.button
                      title='绑定群组'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleBindGroup}
                      className="p-2 bg-green-500/20 rounded-lg hover:bg-green-500/30 transition-colors"
                    >
                      <Users size={18} className="text-green-400" />
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditingBind(true)}
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
          {payments.map((payment, index) => (
            <motion.div
              key={payment.invoiceId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{capitalizeFirstLetter(payment.status)}</span>
                <span className="text-green-400 font-bold">{parseFloat(payment.amount).toFixed(2)} {payment.currency}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between text-white/50">
                  <span>日期:</span>
                  <span>{dayjs(payment.paidAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                </div>
                <div className="flex items-center justify-between text-white/50">
                  <span>交易哈希:</span>
                  <span className="font-mono">
                    {showTxId(payment.chain, payment.txHash)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PersonalInfo({ onBack }: PersonalInfoProps) {
  const { user } = useAuth()
  const { bind, style } = useSwipeBack({ onBack });

  return (
    <animated.div {...bind()} style={style} className="h-full w-full flex flex-col p-6 overflow-hidden mt-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-center w-full gap-3 mb-2">
          {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </motion.button> */}
          <h1 className="text-3xl font-bold text-white">个人信息</h1>
        </div>
        {!user && (
          <p className="text-white/60 text-center">请在Telegram中打开</p>
        )}
      </motion.div>
      {user && (
        <ShowInfo userInfo={user!} />
      )}
    </animated.div>
  );
}
