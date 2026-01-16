"use client";

import { Button } from "@/app/components/ui/button";
import { useLanguage } from "@/app/contexts/LanguageContext";

interface SubmitButtonProps {
  isLoading: boolean;
  isValid: boolean;
}

const SubmitButton = ({ isLoading, isValid }: SubmitButtonProps) => {
  const { t } = useLanguage();

  return (
    <Button 
      type="submit" 
      className="w-full text-white" 
      size="lg"
      disabled={isLoading || !isValid}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {t("contact.form.submit.loading") as string}
        </>
      ) : (
        t("contact.form.submit.text") as string
      )}
    </Button>
  );
};

export default SubmitButton;