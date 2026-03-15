"use client";

import { useState, useCallback } from "react";
import { formatPhone } from "@/shared/lib/format";
import type { PaymentMethod } from "@/shared/lib/constants";

export function usePaymentForm() {
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [termsAgreed, setTermsAgreed] = useState(false);

  const isFormValid =
    buyerName.length >= 2 &&
    buyerPhone.replace(/-/g, "").length >= 10 &&
    termsAgreed;

  const handleNameChange = useCallback((value: string) => {
    setBuyerName(value);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setBuyerPhone(formatPhone(value));
  }, []);

  const toggleTerms = useCallback(() => {
    setTermsAgreed((prev) => !prev);
  }, []);

  const resetForm = useCallback(() => {
    setBuyerName("");
    setBuyerPhone("");
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
