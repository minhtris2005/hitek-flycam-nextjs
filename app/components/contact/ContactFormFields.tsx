"use client";

import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { ContactFormData } from "@/types/contact";
import { useEffect, useRef } from 'react';
import { useLanguage } from "@/app/contexts/LanguageContext";

interface ContactFormFieldsProps {
  formData: ContactFormData;
  errors: {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: string;
    location: string;
    message: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValidateField: (fieldName: string, value: string) => void;
}

const ContactFormFields = ({ 
  formData, 
  errors, 
  onChange, 
  onSelectChange,
  onValidateField 
}: ContactFormFieldsProps) => {
  const { t } = useLanguage();
  
  // Refs để lưu timeout cho từng trường
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Dữ liệu cho combobox dịch vụ
  const serviceOptions = [
    { value: '', label: t("contact.form.serviceOptions.default") as string },
    { value: 'droneRepair', label: t("contact.form.serviceOptions.droneRepair") as string },
    { value: 'droneFilming', label: t("contact.form.serviceOptions.droneFilming") as string },
    { value: 'surveyingDrone', label: t("contact.form.serviceOptions.surveyingDrone") as string },
    { value: 'deliveryDrone', label: t("contact.form.serviceOptions.deliveryDrone") as string },
    { value: 'flightPermit', label: t("contact.form.serviceOptions.flightPermit") as string },
    { value: 'droneImport', label: t("contact.form.serviceOptions.droneImport") as string },
    { value: 'khac', label: t("contact.form.serviceOptions.other") as string }
  ];

  // Hàm xử lý thay đổi với validation debounced
  const handleChangeWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let newValue = value;
    
    // KHÔNG filter gì cả - cho phép mọi ký tự
    if (name === 'name') {
      newValue = value;
    }
    
    // Xử lý tự động format số điện thoại
    if (name === 'phone') {
      // Loại bỏ tất cả ký tự không phải số
      const numbers = value.replace(/\D/g, '');
      
      // Nếu bắt đầu bằng 84, giữ nguyên 84
      if (numbers.startsWith('84')) {
        newValue = numbers;
      } 
      // Nếu bắt đầu bằng 0, giữ nguyên 0
      else if (numbers.startsWith('0')) {
        newValue = numbers;
      }
      // Nếu không bắt đầu bằng gì cả nhưng có số
      else if (numbers) {
        newValue = '0' + numbers;
      } else {
        newValue = '';
      }
    }
    
    // Gọi onChange callback
    onChange({
      ...e,
      target: {
        ...e.target,
        name,
        value: newValue
      }
    } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);

    // Debounced validation
    debouncedValidate(name, newValue);
  };

  // Hàm xử lý thay đổi select
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectChange(e);
    // Validation ngay lập tức cho select
    onValidateField(e.target.name, e.target.value);
  };

  // Hàm debounce validation
  const debouncedValidate = (fieldName: string, value: string) => {
    // Clear timeout cũ nếu có
    if (timeoutsRef.current[fieldName]) {
      clearTimeout(timeoutsRef.current[fieldName]);
    }

    // Nếu trường rỗng và chưa có giá trị trước đó, không cần debounce
    if (!value.trim()) {
      onValidateField(fieldName, value);
      return;
    }

    // Set timeout mới cho validation sau 200ms
    timeoutsRef.current[fieldName] = setTimeout(() => {
      onValidateField(fieldName, value);
    }, 200);
  };

  // Cleanup timeouts khi component unmount
  useEffect(() => {
    // Copy current timeoutsRef vào biến local
    const currentTimeouts = timeoutsRef.current;
    
    return () => {
      Object.values(currentTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  return (
    <div className="space-y-2">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("contact.form.fields.name.label") as string} <span className="text-red-500">*</span>
        </label>
        <Input
          name="name"
          placeholder={t("contact.form.fields.name.placeholder") as string}
          value={formData.name}
          onChange={handleChangeWithValidation}
          required
          className={`placeholder:text-gray-400 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          maxLength={50}
        />
        <div className="flex justify-between items-center">
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
          <span className="text-xs text-muted-foreground mt-1 ml-auto">
            {formData.name.length}{t("contact.form.fields.name.counter") as string}
          </span>
        </div>
      </div>
      
      {/* Company */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("contact.form.fields.company.label") as string}
        </label>
        <Input
          name="company"
          placeholder={t("contact.form.fields.company.placeholder") as string}
          value={formData.company}
          onChange={handleChangeWithValidation}
          className={`placeholder:text-gray-400 ${errors.company ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          maxLength={100}
        />
        <div className="flex justify-between items-center">
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company}</p>
          )}
          <span className="text-xs text-muted-foreground mt-1 ml-auto">
            {formData.company.length}{t("contact.form.fields.company.counter") as string}
          </span>
        </div>
      </div>
      
      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("contact.form.fields.email.label") as string} <span className="text-red-500">*</span>
          </label>
          <Input
            name="email"
            type="email"
            placeholder={t("contact.form.fields.email.placeholder") as string}
            value={formData.email}
            onChange={handleChangeWithValidation}
            required
            className={`placeholder:text-gray-400 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("contact.form.fields.phone.label") as string} <span className="text-red-500">*</span>
          </label>
          <Input
            name="phone"
            type="tel"
            placeholder={t("contact.form.fields.phone.placeholder") as string}
            value={formData.phone}
            onChange={handleChangeWithValidation}
            required
            className={`placeholder:text-gray-400 ${errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Service & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("contact.form.fields.service.label") as string} <span className="text-red-500">*</span>
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleSelectChange}
            required
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.service ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          >
            {serviceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-600">{errors.service}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("contact.form.fields.location.label") as string} <span className="text-red-500">*</span>
          </label>
          <Input
            name="location"
            placeholder={t("contact.form.fields.location.placeholder") as string}
            value={formData.location}
            onChange={handleChangeWithValidation}
            required
            className={`placeholder:text-gray-400 ${errors.location ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            maxLength={100}
          />
          <div className="flex justify-between items-center">
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
            <span className="text-xs text-muted-foreground mt-1 ml-auto">
              {formData.location.length}{t("contact.form.fields.location.counter") as string}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t("contact.form.fields.message.label") as string} <span className="text-red-500">*</span>
        </label>
        <Textarea
          name="message"
          placeholder={t("contact.form.fields.message.placeholder") as string}
          rows={3}
          value={formData.message}
          onChange={handleChangeWithValidation}
          required
          className={`placeholder:text-gray-400 ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          maxLength={1000}
        />
        <div className="flex justify-between items-center">
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
          <span className="text-xs text-muted-foreground mt-1 ml-auto">
            {formData.message.length}{t("contact.form.fields.message.counter") as string}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ContactFormFields;