// app/components/about/TeamSection.tsx
"use client";

import Image, { StaticImageData } from "next/image";
import long from "@/public/assets/team/Long.png";
import khoi from "@/public/assets/team/Khoi.png";
import sean from "@/public/assets/team/Sean.png";
import { useLanguage } from "@/app/contexts/LanguageContext";

// Type definitions
type TeamMemberData = {
  name: string;
  position: string;
  info: string[];
};

type TeamSectionData = {
  title?: string;
  members?: {
    tien?: TeamMemberData;
    khoi?: TeamMemberData;
    sean?: TeamMemberData;
  };
};

interface TeamMember extends TeamMemberData {
  image: StaticImageData;
}

const TeamSection = () => {
  const { t } = useLanguage();

  // Helper function to safely get string
  const getString = (value: unknown): string => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Helper function to safely get array
  const getArray = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.map(item => getString(item));
    }
    return [];
  };

  // Parse team section data với type safety
  const parseTeamSectionData = (): TeamSectionData => {
    const data = t("about.teamSection");
    
    if (typeof data !== 'object' || data === null) {
      return {};
    }
    
    const obj = data as Record<string, unknown>;
    
    const parseMember = (memberKey: string): TeamMemberData => {
      const members = obj.members;
      
      if (typeof members !== 'object' || members === null) {
        return { name: '', position: '', info: [] };
      }
      
      const membersObj = members as Record<string, unknown>;
      const member = membersObj[memberKey];
      
      if (typeof member !== 'object' || member === null) {
        return { name: '', position: '', info: [] };
      }
      
      const memberObj = member as Record<string, unknown>;
      
      return {
        name: getString(memberObj.name),
        position: getString(memberObj.position),
        info: getArray(memberObj.info),
      };
    };
    
    return {
      title: getString(obj.title),
      members: {
        tien: parseMember('tien'),
        khoi: parseMember('khoi'),
        sean: parseMember('sean'),
      },
    };
  };

  const teamData = parseTeamSectionData();
  const members = teamData.members || {};

  // Team members data với fallback
  const teamMembers: TeamMember[] = [
    {
      name: members.tien?.name || "Lâm Thứ Tiên",
      position: members.tien?.position || "Chủ tịch",
      info: members.tien?.info || ["Thông tin đang cập nhật"],
      image: long,
    },
    {
      name: members.khoi?.name || "Trần Anh Khôi",
      position: members.khoi?.position || "Tổng giám đốc",
      info: members.khoi?.info || ["Thông tin đang cập nhật"],
      image: khoi,
    },
    {
      name: members.sean?.name || "Oh Sean Beom",
      position: members.sean?.position || "Giám đốc Kinh doanh",
      info: members.sean?.info || ["Thông tin đang cập nhật"],
      image: sean,
    }
  ];

  return (
    <section className="py-20 bg-greywhite overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-foreground mb-16">
          {teamData.title || "Đội ngũ lãnh đạo"}
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-8 shadow-lg relative overflow-hidden"
            >
              {/* Team member image */}
              <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.position} tại Hitek Flycam`}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  priority={index === 0}
                />
              </div>
              
              {/* Team member info */}
              <h3 className="text-2xl font-bold text-center text-foreground mb-2">
                {member.name}
              </h3>
              
              {/* Position màu primary */}
              <p className="text-primary text-center font-semibold mb-6">
                {member.position}
              </p>
              
              {/* Team member details */}
              <div className="space-y-3">
                {member.info.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    {/* Chấm đỏ đầu dòng */}
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;