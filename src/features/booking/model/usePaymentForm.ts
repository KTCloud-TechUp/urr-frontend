"use client";

import { useState, useCallback } from "react";
import { formatPhone } from "@/shared/lib/format";
import type { PaymentMethod } from "@/shared/lib/constants";

interface UsePaymentFormOptions {
  initialName?: string;
  initialPhone?: string;
}

export function usePaymentForm({ initialName = "", initialPhone = "" }: UsePaymentFormOptions = {}) {
  // null = 사용자가 아직 수정 안 함 → initialValue 사용
  // string = 사용자가 직접 입력한 값 → override 우선
  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const [phoneOverride, setPhoneOverride] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const buyerName = nameOverride ?? initialName;
  const buyerPhone = phoneOverride ?? (initialPhone ? formatPhone(initialPhone) : "");

  const isFormValid =
    buyerName.length >= 2 &&
    buyerPhone.replace(/-/g, "").length >= 10 &&
    termsAgreed;

  const handleNameChange = useCallback((value: string) => {
    setNameOverride(value);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhoneOverride(formatPhone(value));
  }, []);

  const toggleTerms = useCallback(() => {
    setTermsAgreed((prev) => !prev);
  }, []);

  const resetForm = useCallback(() => {
    setNameOverride(null);
    setPhoneOverride(null);
    setSelectedMethod("card");
    setTermsAgreed(false);
  }, []);

  return {
    buyerName,
    buyerPhone,
    selectedMethod,
    termsAgreed,
    isFormValid,
    handleNameChange,
    handlePhoneChange,
    setSelectedMethod,
    toggleTerms,
    resetForm,
  };
}
