"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
}

export default function ThankYouModal({ isOpen, onClose, customerName }: ThankYouModalProps) {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Close Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Success Icon with Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2
                  }}
                  className="mx-auto mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full blur-xl opacity-60"></div>
                    <div className="relative bg-linear-to-br from-green-400 to-green-600 rounded-full p-4 w-24 h-24 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                </motion.div>

                {/* Thank You Text */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {t("contact.thankYou.title") as string}
                  </h2>
                  <p className="text-lg text-gray-600 mb-2">
                    {customerName && (
                      <span className="font-semibold text-primary">
                        {customerName}
                      </span>
                    )}
                  </p>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed">
                    {t("contact.thankYou.message") as string}
                  </p>
                </motion.div>

                {/* Additional Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-linear-to-r from-primary/5 to-red-500/5 rounded-2xl p-5 mb-6"
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {t("contact.thankYou.info") as string}
                  </p>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-linear-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {t("contact.thankYou.button") as string}
                  </Button>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-red-500/10 to-transparent rounded-full -ml-16 -mb-16 blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}