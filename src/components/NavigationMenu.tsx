import { motion } from 'framer-motion';
import { User, Gamepad2, CreditCard, TrendingUp, Calculator, ChevronRight } from 'lucide-react';

type MenuItem = 'strategy' | 'calculator' | 'game' | 'subscription' | 'profile';

interface NavigationMenuProps {
  currentPage: MenuItem;
  onPageChange: (page: MenuItem, direction: number) => void;
}

const menuItems: { id: MenuItem; title: string; subtitle: string; icon: any; gradient: string }[] = [
  {
    id: 'strategy',
    title: '策略管理',
    subtitle: '添加和管理交易策略',
    icon: TrendingUp,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'calculator',
    title: '仓位计算器',
    subtitle: '精确计算仓位大小',
    icon: Calculator,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    id: 'game',
    title: '小游戏',
    subtitle: '休闲娱乐放松心情',
    icon: Gamepad2,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'subscription',
    title: '订阅支付',
    subtitle: '选择订阅计划',
    icon: CreditCard,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    id: 'profile',
    title: '个人信息',
    subtitle: '账户与支付记录',
    icon: User,
    gradient: 'from-cyan-500 to-blue-600'
  },
];

export default function NavigationMenu({ currentPage, onPageChange }: NavigationMenuProps) {
  const currentIndex = menuItems.findIndex(item => item.id === currentPage);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`absolute w-64 h-64 bg-gradient-to-r ${item.gradient} rounded-full filter blur-3xl`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${(index * 20) % 80}%`,
              top: `${(index * 30) % 70}%`,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center relative z-10"
      >
        <h1 className="text-4xl font-bold text-white mb-2">PerpX</h1>
        <p className="text-white/60 text-lg">选择功能开始使用</p>
      </motion.div>

      <div className="w-full max-w-md space-y-2.5 relative z-10">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onPageChange(item.id, index - currentIndex)}
              whileHover={{ scale: 1.03, x: 10 }}
              whileTap={{ scale: 0.97 }}
              className="w-full group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`} />

              <div className={`relative bg-gradient-to-r ${item.gradient} p-[2px] rounded-2xl overflow-hidden ${
                isActive ? 'ring-2 ring-white/50' : ''
              }`}>
                <div className="bg-slate-900/90 backdrop-blur-sm rounded-2xl p-5 flex items-center gap-4">
                  <motion.div
                    className={`p-3 bg-gradient-to-br ${item.gradient} rounded-xl`}
                    animate={isActive ? {
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.1, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                    }}
                  >
                    <Icon size={28} className="text-white" />
                  </motion.div>

                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/60">{item.subtitle}</p>
                  </div>

                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <ChevronRight size={24} className="text-white/40 group-hover:text-white transition-colors" />
                  </motion.div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
