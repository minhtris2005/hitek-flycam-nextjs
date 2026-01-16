"use client";

import { useState, useEffect, useRef } from 'react';
import ContactFormFields from '@/app/components/contact/ContactFormFields';
import ContactInfo from '@/app/components/contact/ContactInfo';
import SubmitButton from '@/app/components/contact/SubmitButton';
import ThankYouModal from '@/app/components/contact/ThankYouModal';
import { ContactFormData } from '@/types/contact';
import { sendContactEmail } from '@/lib/emailService';
import { useLanguage } from '@/app/contexts/LanguageContext';

const ContactForm = () => {
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    location: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [successMessage, setSuccessMessage] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Reset success message sau 10 giây
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setSuccessMessage('');
      }, 10000); // 10 giây
    
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Validation functions
  const validateName = (name: string) => {
    if (!name.trim()) {
      return language === 'vi' ? 'Họ và tên là bắt buộc' : 'Full Name is required';
    }
    if (name.length < 3) {
      return language === 'vi' ? 'Họ và tên phải có ít nhất 3 ký tự' : 'Full Name must be at least 3 characters';
    }
    return '';
  };

  const validateCompany = (company: string) => {
    if (company && company.length < 3) {
      return language === 'vi' ? 'Tên công ty phải có ít nhất 3 ký tự' : 'Company Name must be at least 3 characters';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return language === 'vi' ? 'Email là bắt buộc' : 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return language === 'vi' ? 'Email không hợp lệ' : 'Invalid email address';
    }
    return '';
  };

  const validatePhone = (phone: string) => {
    if (!phone.trim()) {
      return language === 'vi' ? 'Số điện thoại là bắt buộc' : 'Phone number is required';
    }
    // Chấp nhận số điện thoại Việt Nam (bắt đầu bằng 0, 84, +84)
    const phoneRegex = /^(0|\+84|84)(\d{9,10})$/;
    const cleanedPhone = phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanedPhone)) {
      return language === 'vi' ? 'Số điện thoại không hợp lệ' : 'Invalid phone number';
    }
    return '';
  };

  const validateService = (service: string) => {
    if (!service.trim()) {
      return language === 'vi' ? 'Dịch vụ là bắt buộc' : 'Service is required';
    }
    return '';
  };

  const validateLocation = (location: string) => {
    if (!location.trim()) {
      return language === 'vi' ? 'Địa điểm là bắt buộc' : 'Location is required';
    }
    if (location.length < 3) {
      return language === 'vi' ? 'Địa điểm phải có ít nhất 3 ký tự' : 'Location must be at least 3 characters';
    }
    return '';
  };

  const validateMessage = (message: string) => {
    if (!message.trim()) {
      return language === 'vi' ? 'Nội dung tin nhắn là bắt buộc' : 'Message is required';
    }
    if (message.length < 3) {
      return language === 'vi' ? 'Nội dung tin nhắn phải có ít nhất 3 ký tự' : 'Message must be at least 3 characters';
    }
    return '';
  };

  // Hàm validate từng trường
  const validateField = (fieldName: string, value: string) => {
    const validatorMap: Record<string, (value: string) => string> = {
      name: validateName,
      company: validateCompany,
      email: validateEmail,
      phone: validatePhone,
      service: validateService,
      location: validateLocation,
      message: validateMessage
    };
    
    const validator = validatorMap[fieldName];
    const error = validator ? validator(value) : '';
    setErrors((prev: typeof errors) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  // Validate toàn bộ form khi submit
  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      company: validateCompany(formData.company),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      service: validateService(formData.service),
      location: validateLocation(formData.location),
      message: validateMessage(formData.message)
    };
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  // Kiểm tra form có hợp lệ không
  const isFormValid = () => {
    return (
      validateName(formData.name) === '' &&
      validateEmail(formData.email) === '' &&
      validatePhone(formData.phone) === '' &&
      validateService(formData.service) === '' &&
      validateLocation(formData.location) === '' &&
      validateMessage(formData.message) === ''
    );
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let newValue = value;
    
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
    
    // Các trường khác giữ nguyên
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [name]: newValue
    }));

    // Debounced validation
    debouncedValidate(name, newValue);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev: ContactFormData) => ({
      ...prev,
      [name]: value
    }));

    // Validation ngay lập tức cho select
    validateField(name, value);
  };

  // Hàm debounce validation
  const debouncedValidate = (fieldName: string, value: string) => {
    // Clear timeout cũ nếu có
    if (timeoutsRef.current[fieldName]) {
      clearTimeout(timeoutsRef.current[fieldName]);
    }

    // Nếu trường rỗng và chưa có giá trị trước đó, không cần debounce
    if (!value.trim()) {
      validateField(fieldName, value);
      return;
    }

    // Set timeout mới cho validation sau 200ms
    timeoutsRef.current[fieldName] = setTimeout(() => {
      validateField(fieldName, value);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear tất cả timeouts trước khi validate
    Object.values(timeoutsRef.current).forEach(timeout => {
      if (timeout) clearTimeout(timeout);
    });

    // Validate form ngay lập tức khi submit
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('loading');
    setSuccessMessage('');

    try {
      // OPTIMISTIC UI: Hiển thị modal ngay lập tức
      setSubmittedName(formData.name);
      setShowThankYou(true);
      setSubmitStatus('success');

      // Reset form ngay
      const submittedData = { ...formData };
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        location: '',
        message: ''
      });
      setErrors({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        location: '',
        message: ''
      });

      // Gửi email ở background (không chờ)
      sendContactEmail(submittedData).catch((error: Error) => {
        // Không hiển thị lỗi cho user vì đã thấy modal success
        console.error('Email sending failed:', error);
      });

    } catch (error: unknown) {
    console.error('Submit error:', error);
    setSubmitStatus('error');
    setSuccessMessage(t("contact.form.submit.error.message") as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ThankYouModal
        isOpen={showThankYou}
        onClose={() => {
          setShowThankYou(false);
          setSubmitStatus('idle');
        }}
        customerName={submittedName}
      />

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {t("contact.form.title") as string}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <ContactFormFields 
              formData={formData}
              errors={errors}
              onChange={handleChange}
              onSelectChange={handleSelectChange}
              onValidateField={validateField}
            />

            {/* Thông báo thành công */}
            {submitStatus === 'success' && successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{t("contact.form.submit.success.title") as string} {successMessage}</p>
                    <p className="mt-1 text-sm text-green-600 opacity-75">
                      {t("contact.form.submit.success.confirmation") as string} {formData.email || 'email của bạn'}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitStatus('idle');
                          setSuccessMessage('');
                        }}
                        className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
                      >
                        <span className="sr-only">Đóng</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thông báo lỗi */}
            {submitStatus === 'error' && successMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{t("contact.form.submit.error.title") as string} {successMessage}</p>
                  </div>
                  <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitStatus('idle');
                          setSuccessMessage('');
                        }}
                        className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                      >
                        <span className="sr-only">Đóng</span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <SubmitButton 
              isLoading={isLoading} 
              isValid={isFormValid()}
            />
          </form>
        </div>

        {/* Contact Information */}
        <ContactInfo />
      </div>
    </>
  );
};

export default ContactForm;