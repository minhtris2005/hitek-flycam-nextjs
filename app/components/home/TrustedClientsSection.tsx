// app/components/home/TrustedClientsSection.tsx
"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/contexts/LanguageContext";

const clients = [
  {
    id: 1,
    name: "Tập đoàn Vingroup",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=200&q=80",
    project: "Giám sát thi công dự án bất động sản",
    feedback: "Hitek Flycam cung cấp giải pháp drone chuyên nghiệp, giúp chúng tôi tiết kiệm 40% thời gian giám sát."
  },
  {
    id: 2,
    name: "Tổng công ty Điện lực EVN",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=80",
    project: "Kiểm tra đường dây điện cao thế",
    feedback: "Dịch vụ an toàn, chuyên nghiệp và đáp ứng mọi yêu cầu kỹ thuật khắt khe."
  },
  {
    id: 3,
    name: "Bộ Giao thông Vận tải",
    logo: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=200&q=80",
    project: "Khảo sát địa hình các dự án giao thông",
    feedback: "Đối tác tin cậy trong việc cung cấp dữ liệu địa hình chính xác cho các dự án trọng điểm."
  },
  {
    id: 4,
    name: "Công ty CP Dược phẩm Vinfa",
    logo: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=200&q=80",
    project: "Vận chuyển thuốc khẩn cấp",
    feedback: "Giải pháp vận chuyển drone giúp chúng tôi tiếp cận các khu vực khó khăn nhanh chóng."
  },
  {
    id: 5,
    name: "Tập đoàn Sun Group",
    logo: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=200&q=80",
    project: "Quay phim quảng bá du lịch",
    feedback: "Hình ảnh chất lượng cao, góc quay sáng tạo giúp dự án của chúng tôi nổi bật."
  },
  {
    id: 6,
    name: "Công ty Xây dựng COTEC",
    logo: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=200&q=80",
    project: "Khảo sát công trình xây dựng",
    feedback: "Độ chính xác cao, tiến độ nhanh chóng, hỗ trợ kỹ thuật nhiệt tình."
  }
];

export default function TrustedClientsSection() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [totalWidth, setTotalWidth] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  // Tạo mảng gấp 3 lần để tạo hiệu ứng vô hạn mượt mà
  const infiniteClients = [...clients, ...clients, ...clients, ...clients];

  // Helper function để lấy string từ translation
  const getString = (key: string): string => {
    const value = t(key);
    return typeof value === 'string' ? value : String(value || key);
  };

  // Tính toán chiều rộng
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const calculatedItemWidth = Math.min(320, containerWidth / 3.5);
        setItemWidth(calculatedItemWidth);
        setTotalWidth(calculatedItemWidth * infiniteClients.length);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [infiniteClients.length]);

  // Animation loop vô hạn - XÓA điều kiện isHovered
  useEffect(() => {
    if (itemWidth === 0) return;

    let animationFrameId: number;
    let lastTimestamp: number;
    const speed = 150; // pixels per second
    const singleLoopWidth = itemWidth * clients.length; // Chiều rộng của 1 vòng lặp

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setScrollPosition(prev => {
        let newPosition = prev + speed * deltaTime;
        
        // Khi đã cuộn hết 1 vòng lặp (tất cả clients gốc), reset về đầu
        if (newPosition >= singleLoopWidth * 2) {
          newPosition = singleLoopWidth;
        }
        
        return newPosition;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [itemWidth]); // XÓA isHovered từ dependencies

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: -20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section 
      ref={ref}
      className="py-16 bg-linear-to-b from-background to-gray-50 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-40"
        >
          <motion.h2 
            variants={titleVariants}
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
          >
            {getString("home.trustedClients.title")}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-red-600">
              {getString("home.trustedClients.highlight")}
            </span>
          </motion.h2>
          
          <motion.p 
            variants={titleVariants}
            className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto"
          >
            {getString("home.trustedClients.subtitle")}
          </motion.p>
        </motion.div>

        {/* Infinite Loop Carousel */}
        <div className="relative h-50 md:h-65">
          <div 
            ref={containerRef}
            className="absolute bottom-20 left-0 right-0 h-full overflow-visible"
          >
            <motion.div
              className="flex absolute top-1/2 -translate-y-1/2"
              style={{
                x: -scrollPosition,
                width: `${totalWidth}px`
              }}
            >
              {infiniteClients.map((client, index) => (
                <motion.div
                  key={`${client.id}-${index}`}
                  className="shrink-0 px-1"
                  style={{ width: `${itemWidth}px` }}
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    className="group relative h-full"
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Client Card */}
                    <div className="bg-white rounded-2xl p-4 md:p-6 h-full border border-gray-200 transition-all duration-300 overflow-hidden shadow-lg">
                      {/* Logo Container */}
                      <div className="relative mb-4 md:mb-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg transition-colors duration-300 relative">
                          <Image
                            src={client.logo}
                            alt={client.name}
                            fill
                            className="object-cover transition-transform duration-500"
                            sizes="(max-width: 768px) 64px, 80px"
                          />
                        </div>
                        {/* Logo Glow */}
                        <div className="absolute inset-0 rounded-full bg-linear-to-r from-primary/20 to-transparent blur-xl -z-10" />
                      </div>
                      
                      {/* Client Info */}
                      <h3 className="text-base md:text-lg font-bold text-center text-gray-800 mb-2 transition-colors duration-300 line-clamp-1">
                        {client.name}
                      </h3>
                    </div>
                    {/* Card Glow */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 blur-xl transition-opacity duration-500" />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}