// app/components/services/HeroSection.tsx
import Image from 'next/image';
import BgServices from '@/public/assets/services/banner.jpg';
import LgFlycam from '@/public/assets/logo/camera-drone.png';

export default function HeroSection() {
  return (
    <section className="relative min-h-[55vh] md:min-h-[65vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={BgServices}
          alt="Dịch vụ Flycam và Drone chuyên nghiệp - Hitek Flycam"
          fill
          className="object-cover object-[50%_20%]"
          priority
          quality={85} // THÊM chất lượng tốt
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center w-full">
          {/* Container với kích thước tốt từ file about */}
          <div className="relative w-full max-w-3xl h-64 md:h-80 lg:h-96 mx-auto mb-8">
            <div className="relative w-full h-full">
              <Image
                src={LgFlycam}
                alt="Biểu tượng Flycam Hitek - Dịch vụ Drone hàng đầu Việt Nam"
                fill
                className="object-contain"
                priority
                quality={85} // THÊM chất lượng tốt
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}