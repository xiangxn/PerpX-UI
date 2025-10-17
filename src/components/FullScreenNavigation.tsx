import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Calculator } from 'lucide-react';
import NavigationMenu from './NavigationMenu';
import StrategyManagement from './StrategyManagement';
import SubscriptionPayment from './SubscriptionPayment';
import PersonalInfo from './PersonalInfo';
import PlaceholderPage from './PlaceholderPage';

type Page = 'menu' | 'strategy' | 'calculator' | 'game' | 'subscription' | 'profile';

export default function FullScreenNavigation() {
  const [currentPage, setCurrentPage] = useState<Page>('menu');
  const [direction, setDirection] = useState(0);

  const handlePageChange = (page: Page, newDirection: number = 1) => {
    setDirection(newDirection);
    setCurrentPage(page);
  };

  const handleMenuBack = () => {
    setDirection(-1);
    setCurrentPage('menu');
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'menu':
        return <NavigationMenu currentPage="strategy" onPageChange={handlePageChange} />;
      case 'strategy':
        return <StrategyManagement onBack={handleMenuBack} />;
      case 'calculator':
        return <PlaceholderPage title="仓位计算器" icon={Calculator} onBack={handleMenuBack} url="https://calc.bitsflea.com" />;
      case 'game':
        return <PlaceholderPage title="小游戏" icon={Gamepad2} onBack={handleMenuBack} url="https://rocketrise.pages.dev" />;
      case 'subscription':
        return <SubscriptionPayment onBack={handleMenuBack} />;
      case 'profile':
        return <PersonalInfo onBack={handleMenuBack} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden select-none">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      <div
        className="relative h-full w-full touch-pan-y"
        onTouchStart={(e) => {
          const touch = e.touches[0];
          (e.currentTarget as any).startX = touch.clientX;
        }}
        onTouchEnd={(e) => {
          const touch = e.changedTouches[0];
          const startX = (e.currentTarget as any).startX;
          const diff = touch.clientX - startX;

          if (Math.abs(diff) > 50) {
            // handleSwipe(diff > 0 ? -1 : 1);
          }
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
