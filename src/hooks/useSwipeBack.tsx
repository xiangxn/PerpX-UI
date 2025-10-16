import { useSpring } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useRef } from 'react';

interface SwipeBackOptions {
  onBack: () => void;
  maxDrag?: number;   // 最大拖动距离
  triggerDistance?: number; // 触发返回的距离
}

export function useSwipeBack({ onBack, maxDrag = 200, triggerDistance = 100 }: SwipeBackOptions) {
  const [style, api] = useSpring(() => ({ x: 0 }));
  const lastDir = useRef(0);

  const bind = useGesture({
    onDrag: ({ down, movement: [mx], direction: [xDir] }) => {
      // console.log('down', down, 'mx', mx, 'xDir', xDir);
      if (down && xDir !== 0) {
        lastDir.current = xDir; // 仅在拖动时记录方向
      }
      if (down) {
        // 拖动时，跟随手指移动（最大 200px）
        api.start({ x: Math.max(0, Math.min(mx, maxDrag)), immediate: true });
      } else {
        if (mx > triggerDistance && lastDir.current > 0) {
          onBack(); // 触发返回
        }
        // 松手后恢复原位
        api.start({ x: 0, immediate: false });
      }
    },
  });
  (style as any)['touchAction'] = 'none';
  return { bind, style };
}
