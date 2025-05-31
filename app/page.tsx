"use client";
import React, { useEffect, useState, useRef } from "react";
import freighterApi from "@stellar/freighter-api";
import {
  Calendar,
  Gift,
  Wallet,
  Clock,
  Heart,
  Star,
  Upload,
  Image,
  X,
} from "lucide-react";

interface GiftSchedule {
  id: string;
  recipientAddress: string;
  amount: string;
  specialDay: string;
  date: string;
  description: string;
  status: "pending" | "sent" | "failed";
  imageUrl?: string;
}

export default function GiftingApp() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [giftSchedules, setGiftSchedules] = useState<GiftSchedule[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [specialDay, setSpecialDay] = useState<string>("");
  const [giftPurpose, setGiftPurpose] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [repeatInterval, setRepeatInterval] = useState<string>("");
  const [specificDate, setSpecificDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [giftImage, setGiftImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Sayfa yüklendiğinde cüzdan bağlı mı kontrol et
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await freighterApi.isConnected();
        if (connected) {
          const address = await freighterApi.getPublicKey();
          setPublicKey(address);
        }
      } catch (error) {
        console.error("Error checking Freighter connection:", error);
      }
    };
    checkFreighter();
  }, []);

  // Bağlan butonuna basıldığında çalışır
  const handleConnectWallet = async () => {
    try {
      await freighterApi.setAllowed();
      const address = await freighterApi.getPublicKey();
      setPublicKey(address);
    } catch (error) {
      console.error("Error connecting to Freighter:", error);
    }
  };

  // Çıkış yap butonuna basıldığında çalışır
  const handleDisconnectWallet = () => {
    setPublicKey(null);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setGiftImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setGiftImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Hediye programla
  const handleScheduleGift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      alert("Please connect your wallet first!");
      return;
    }

    // In a real app, we would upload the image to storage and get a URL
    const imageUrl = imagePreview;

    const newGift: GiftSchedule = {
      id: Date.now().toString(),
      recipientAddress,
      amount,
      specialDay: `${specialDay} - ${giftPurpose}`,
      date: `${monthOptions.find((m) => m.value === selectedMonth)?.label} ${
        repeatInterval === "once"
          ? specificDate
          : showDatePicker && specificDate
          ? `day ${specificDate} of every month`
          : "first day of every month"
      }`,
      description: `${
        repeatOptions.find((r) => r.value === repeatInterval)?.label
      } - ${description}`,
      status: "pending",
      imageUrl: imageUrl || undefined,
    };

    setGiftSchedules([...giftSchedules, newGift]);

    // Clear form
    setRecipientAddress("");
    setAmount("");
    setSpecialDay("");
    setGiftPurpose("");
    setSelectedMonth("");
    setRepeatInterval("");
    setSpecificDate("");
    setDescription("");
    setGiftImage(null);
    setImagePreview(null);
    setShowCreateForm(false);
    setCurrentStep(1);

    // Here we would call the smart contract
    console.log("Scheduling gift:", newGift);
  };

  const specialDayOptions = [
    "Birthday",
    "Wedding Anniversary",
    "Valentine's Day",
    "Mother's Day",
    "Father's Day",
    "New Year",
    "Graduation Day",
    "Work Success",
    "Promotion",
    "Retirement",
    "Special Achievement",
  ];

  const giftPurposeOptions = [
    "Congratulations",
    "Support",
    "Celebration",
    "Thank You",
    "Apology",
    "Surprise",
    "Motivation",
    "Remembrance",
  ];

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const repeatOptions = [
    { value: "once", label: "One Time" },
    { value: "yearly", label: "Every Year" },
    { value: "monthly", label: "Every Month" },
    { value: "quarterly", label: "Every 3 Months" },
    { value: "biannual", label: "Every 6 Months" },
  ];

  // Form validation
  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return specialDay && giftPurpose;
      case 2:
        return (
          selectedMonth &&
          repeatInterval &&
          ((repeatInterval !== "once" && !showDatePicker) || specificDate)
        );
      case 3:
        return amount && parseFloat(amount) > 0;
      case 4:
        return recipientAddress && recipientAddress.length > 20;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Gift className="w-12 h-12 text-pink-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              GiftingStar
            </h1>
            <Star className="w-12 h-12 text-pink-400" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Send automatic gifts on special occasions. Secure and timely
            delivery with Stellar blockchain.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto mb-8">
          {publicKey ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-semibold">
                    Wallet Connected
                  </span>
                </div>
                <button
                  onClick={handleDisconnectWallet}
                  className="px-3 py-1 rounded-lg bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-semibold hover:bg-pink-500/30 transition-colors"
                >
                  Disconnect
                </button>
              </div>
              <p className="text-gray-300 text-sm break-all">
                {publicKey.slice(0, 8)}...{publicKey.slice(-8)}
              </p>
            </div>
          ) : (
            <button
              onClick={handleConnectWallet}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <Wallet className="w-6 h-6" />
              Connect Freighter Wallet
            </button>
          )}
        </div>

        {publicKey && (
          <>
            {/* Action Buttons */}
            <div className="text-center mb-8">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                <Gift className="w-5 h-5" />
                Schedule New Gift
              </button>
            </div>

            {/* Create Gift Form */}
            {showCreateForm && (
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-pink-400" />
                      Schedule Gift
                    </h2>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            step === currentStep
                              ? "bg-pink-500 text-white"
                              : step < currentStep
                              ? "bg-green-500 text-white"
                              : "bg-gray-600 text-gray-300"
                          }`}
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleScheduleGift} className="space-y-6">
                    {/* Step 1: Special Day and Purpose */}
                    {currentStep === 1 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-6">
                          <h3 className="text-xl text-white mb-2">
                            What special occasion are you sending a gift for?
                          </h3>
                          <p className="text-gray-300">
                            Select the special day and purpose of your gift
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-bold mb-3">
                            Select Special Day
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {specialDayOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setSpecialDay(option)}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                                  specialDay === option
                                    ? "bg-pink-500 border-pink-400 text-white"
                                    : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-bold mb-3">
                            Gift Purpose
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {giftPurposeOptions.map((purpose) => (
                              <button
                                key={purpose}
                                type="button"
                                onClick={() => setGiftPurpose(purpose)}
                                className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                                  giftPurpose === purpose
                                    ? "bg-purple-500 border-purple-400 text-white"
                                    : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                                }`}
                              >
                                {purpose}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Date and Frequency */}
                    {currentStep === 2 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-6">
                          <h3 className="text-xl text-white mb-2">
                            When should it be sent?
                          </h3>
                          <p className="text-gray-300">
                            Set the delivery time and frequency
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                              Select Month
                            </label>
                            <select
                              value={selectedMonth}
                              onChange={(e) => setSelectedMonth(e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                              <option value="">Select</option>
                              {monthOptions.map((month) => (
                                <option
                                  key={month.value}
                                  value={month.value}
                                  className="text-gray-900"
                                >
                                  {month.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                              Repeat Frequency
                            </label>
                            <select
                              value={repeatInterval}
                              onChange={(e) =>
                                setRepeatInterval(e.target.value)
                              }
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                              <option value="">Select</option>
                              {repeatOptions.map((repeat) => (
                                <option
                                  key={repeat.value}
                                  value={repeat.value}
                                  className="text-gray-900"
                                >
                                  {repeat.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => setShowDatePicker(!showDatePicker)}
                              className={`mr-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                showDatePicker
                                  ? "bg-pink-500 text-white"
                                  : "bg-white/10 text-gray-300 hover:bg-white/15"
                              }`}
                            >
                              {showDatePicker
                                ? "Hide Date"
                                : "Select Specific Date"}
                            </button>
                            <span className="text-gray-400 text-xs">
                              {showDatePicker
                                ? "Will be sent on a specific day of the month"
                                : repeatInterval !== "once"
                                ? "Will be sent on the first day of the month"
                                : ""}
                            </span>
                          </div>
                        </div>

                        {(repeatInterval === "once" || showDatePicker) && (
                          <div className="animate-fade-in">
                            <label className="block text-gray-300 text-sm font-bold mb-2">
                              {repeatInterval === "once"
                                ? "Date"
                                : "Day of Month"}
                            </label>
                            <input
                              type={
                                repeatInterval === "once" ? "date" : "number"
                              }
                              min={repeatInterval === "once" ? undefined : "1"}
                              max={repeatInterval === "once" ? undefined : "31"}
                              value={specificDate}
                              onChange={(e) => setSpecificDate(e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                              placeholder={
                                repeatInterval === "once"
                                  ? undefined
                                  : "E.g.: 15"
                              }
                            />
                            {repeatInterval !== "once" && (
                              <p className="text-gray-400 text-xs mt-1">
                                Will be sent on this day of each cycle
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 3: Amount and Photo */}
                    {currentStep === 3 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-6">
                          <h3 className="text-xl text-white mb-2">
                            How much do you want to send?
                          </h3>
                          <p className="text-gray-300">Set the gift amount</p>
                        </div>

                        <div className="max-w-md mx-auto">
                          <label className="block text-gray-300 text-sm font-bold mb-2 text-center">
                            Amount (XLM)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.1"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-center text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-pink-500"
                              placeholder="100"
                            />
                            <div className="mt-4 flex justify-center gap-2">
                              {[10, 50, 100, 500].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => setAmount(preset.toString())}
                                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm text-gray-300 transition-colors"
                                >
                                  {preset} XLM
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="max-w-md mx-auto">
                          <label className="block text-gray-300 text-sm font-bold mb-3 text-center">
                            Gift Photo (Optional)
                          </label>

                          {!imagePreview ? (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full h-40 border-2 border-dashed border-pink-500/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 transition-colors bg-white/5"
                            >
                              <Upload className="w-8 h-8 text-pink-400 mb-2" />
                              <p className="text-gray-300 text-sm">
                                Click to add a photo
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                PNG, JPG or GIF (max. 5MB)
                              </p>
                            </div>
                          ) : (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden">
                              <img
                                src={imagePreview}
                                alt="Gift preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                              >
                                <X className="w-4 h-4 text-white" />
                              </button>
                            </div>
                          )}

                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            accept="image/png, image/jpeg, image/gif"
                            className="hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-bold mb-2">
                            Personal Message (Optional)
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 h-24 resize-none"
                            placeholder="Add a personal message for your gift..."
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 4: Recipient Address */}
                    {currentStep === 4 && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-center mb-6">
                          <h3 className="text-xl text-white mb-2">
                            Who are you sending the gift to?
                          </h3>
                          <p className="text-gray-300">
                            Enter the recipient's Stellar wallet address
                          </p>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-bold mb-2">
                            Recipient Wallet Address
                          </label>
                          <input
                            type="text"
                            value={recipientAddress}
                            onChange={(e) =>
                              setRecipientAddress(e.target.value)
                            }
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                          />
                          {recipientAddress && recipientAddress.length < 20 && (
                            <p className="text-red-400 text-sm mt-2">
                              Enter a valid Stellar address
                            </p>
                          )}
                        </div>

                        {/* Summary */}
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <h4 className="text-white font-bold mb-3">
                            Gift Summary
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-300">
                              <span className="text-white">Special Day:</span>{" "}
                              {specialDay} - {giftPurpose}
                            </p>
                            <p className="text-gray-300">
                              <span className="text-white">Amount:</span>{" "}
                              {amount} XLM
                            </p>
                            <p className="text-gray-300">
                              <span className="text-white">Date:</span>{" "}
                              {
                                monthOptions.find(
                                  (m) => m.value === selectedMonth
                                )?.label
                              }
                            </p>
                            <p className="text-gray-300">
                              <span className="text-white">Frequency:</span>{" "}
                              {
                                repeatOptions.find(
                                  (r) => r.value === repeatInterval
                                )?.label
                              }
                            </p>
                            {description && (
                              <p className="text-gray-300">
                                <span className="text-white">Message:</span>{" "}
                                {description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t border-white/20">
                      <button
                        type="button"
                        onClick={prevStep}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                          currentStep === 1
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-gray-600 hover:bg-gray-700 text-white"
                        }`}
                        disabled={currentStep === 1}
                      >
                        Back
                      </button>

                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          className={`px-8 py-3 rounded-xl font-bold transition-all ${
                            isStepValid(currentStep)
                              ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                              : "bg-gray-600 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!isStepValid(currentStep)}
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className={`px-8 py-3 rounded-xl font-bold transition-all ${
                            isStepValid(currentStep)
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                              : "bg-gray-600 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!isStepValid(currentStep)}
                        >
                          Schedule Gift
                        </button>
                      )}
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateForm(false);
                          setCurrentStep(1);
                        }}
                        className="text-gray-400 hover:text-white underline text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Scheduled Gifts */}
            {giftSchedules.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Scheduled Gifts
                </h2>

                <div className="grid gap-4">
                  {giftSchedules.map((gift) => (
                    <div
                      key={gift.id}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          {gift.imageUrl ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={gift.imageUrl}
                                alt="Gift"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <Heart className="w-6 h-6 text-pink-400" />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {gift.specialDay}
                            </h3>
                            <p className="text-gray-300 text-sm">{gift.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-400">
                            {gift.amount} XLM
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              gift.status === "pending"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : gift.status === "sent"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {gift.status === "pending"
                              ? "Pending"
                              : gift.status === "sent"
                              ? "Sent"
                              : "Failed"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-300 text-sm">
                          <span className="font-semibold">Recipient:</span>{" "}
                          {gift.recipientAddress.slice(0, 8)}...
                          {gift.recipientAddress.slice(-8)}
                        </p>
                        {gift.description && (
                          <p className="text-gray-300 text-sm">
                            <span className="font-semibold">Message:</span>{" "}
                            {gift.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
