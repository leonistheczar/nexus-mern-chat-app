'use client';

import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type AlertVariant = 'info' | 'success' | 'warning';

interface AlertProps {
  title?: string;
  message: string;
  variant?: AlertVariant;
  onClose?: () => void;
  isVisible?: boolean; // Added to orchestrate exit animations smoothly
}

export default function Alert({
  title,
  message,
  variant = 'success',
  isVisible = true,
}: AlertProps) {
  
  const styles = {
    info: {
      bg: 'var(--color-secondary-50)',
      border: 'var(--color-secondary-200)',
      text: 'var(--color-secondary-700)',
      icon: <Info className="w-5 h-5 shrink-0" />,
    },
    success: {
      bg: 'var(--color-primary-50)',
      border: 'var(--color-primary-200)',
      text: 'var(--color-primary-600)',
      icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    },
    warning: {
      bg: 'var(--color-accent-50)',
      border: 'var(--color-accent-200)',
      text: 'var(--color-accent-700)',
      icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    },
  };

  const current = styles[variant];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex gap-3 p-4 rounded-lg border"
          style={{
            backgroundColor: current.bg,
            borderColor: current.border,
            color: current.text,
          }}
          role="alert"
        >
          {/* Lucide Variant Icon */}
          {current.icon}
          {/* Message Content */}
          <div className="flex-1">
            {title && <h5 className="font-bold mb-0.5">{title}</h5>}
            <p className="opacity-90 leading-relaxed">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}