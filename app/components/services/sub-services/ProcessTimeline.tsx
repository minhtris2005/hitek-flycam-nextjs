// app/components/subService/ProcessTimeline.tsx
"use client";

interface ProcessStep {
  step: string;
  title: string;
}

interface ProcessTimelineProps {
  title: string;
  processes: ProcessStep[];
  subtitle?: string;
  lineColor?: string;
  stepColor?: string;
  backgroundColor?: string;
  titleColor?: string;
  titleSize?: string;
}

export default function ProcessTimeline({
  title,
  processes,
  subtitle,
  lineColor = "from-primary/30 via-primary/50 to-primary/30",
  stepColor = "from-primary to-primary/80",
  backgroundColor = "bg-background",
  titleColor = "text-primary",
  titleSize = "text-xl",
}: ProcessTimelineProps) {
  return (
    <section className={`py-16 md:py-20 ${backgroundColor}`}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className={`text-5xl md:text-6xl font-bold ${titleColor} mb-4`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Timeline Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Vertical Timeline Line - Hidden on mobile */}
            <div 
              className={`hidden md:block absolute left-1/2 -top-2 -bottom-2 w-0.5 bg-linear-to-b ${lineColor} transform -translate-x-1/2`} 
            />
            
            {/* Process Steps for Desktop */}
            <div className="hidden md:block space-y-12">
              {processes.map((process, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <div
                    key={index}
                    className="relative flex md:flex-row md:items-center"
                  >
                    {/* Left Column for Even Steps */}
                    <div className="md:w-1/2 md:pr-12 md:justify-end">
                      {isEven && (
                        <div className="w-full max-w-md">
                          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                            <h3 className={`${titleSize} font-semibold text-foreground leading-relaxed`}>
                              {process.title}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Center: Step Number */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                      <div className={`w-16 h-16 bg-linear-to-br ${stepColor} rounded-xl flex items-center justify-center shadow-lg border-4 border-white z-10`}>
                        <span className="text-white font-bold text-2xl">{process.step}</span>
                      </div>
                    </div>

                    {/* Right Column for Odd Steps */}
                    <div className="md:w-1/2 md:pl-12 md:justify-start">
                      {!isEven && (
                        <div className="w-full max-w-md">
                          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
                            <h3 className={`${titleSize} font-semibold text-foreground leading-relaxed`}>
                              {process.title}
                            </h3>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden mt-8">
              <div className="relative pl-8">
                {/* Vertical line for mobile */}
                <div className={`absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b ${lineColor}`} />
                
                <div className="space-y-8">
                  {processes.map((process, index) => (
                    <div key={index} className="relative">
                      {/* Step dot */}
                      <div className={`absolute -left-8 w-8 h-8 bg-linear-to-br ${stepColor} rounded-full flex items-center justify-center shadow-sm border-2 border-background`}>
                        <span className="text-white font-bold text-sm">{process.step}</span>
                      </div>
                      
                      {/* Content */}
                      <div className="bg-card rounded-xl p-5 shadow-sm border border-border">
                        <h3 className={`${titleSize} font-semibold text-foreground leading-relaxed`}>
                          {process.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}