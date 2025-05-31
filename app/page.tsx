"use client";
import React, { useEffect, useState } from "react";
import freighterApi from "@stellar/freighter-api";
import { Calendar, Gift, Wallet, Clock, Heart, Star } from "lucide-react";

interface GiftSchedule {
  id: string;
  recipientAddress: string;
  amount: string;
  specialDay: string;
  date: string;
  description: string;
  status: "pending" | "sent" | "failed";
}

export default function GiftingApp() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [giftSchedules, setGiftSchedules] = useState<GiftSchedule[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [specialDay, setSpecialDay] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

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

  // Hediye programla
  const handleScheduleGift = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!publicKey) {
      alert("Lütfen önce cüzdanınızı bağlayın!");
      return;
    }

    const newGift: GiftSchedule = {
      id: Date.now().toString(),
      recipientAddress,
      amount,
      specialDay,
      date,
      description,
      status: "pending",
    };

    setGiftSchedules([...giftSchedules, newGift]);

    // Form'u temizle
    setRecipientAddress("");
    setAmount("");
    setSpecialDay("");
    setDate("");
    setDescription("");
    setShowCreateForm(false);

    // Burada akıllı sözleşme çağrısı yapılacak
    console.log("Scheduling gift:", newGift);
  };

  const specialDayOptions = [
    "Evlilik Yıldönümü",
    "Sevgililer Günü",
    "Doğum Günü",
    "Yeni Yıl",
    "Anneler Günü",
    "Babalar Günü",
    "Mezuniyet",
    "Özel Gün",
  ];

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
            Özel günlerde sevdiklerinize otomatik hediye gönderin. Stellar
            blockchain ile güvenli ve zamanında teslimat.
          </p>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-md mx-auto mb-8">
          {publicKey ? (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-6 h-6 text-green-400" />
                <span className="text-green-400 font-semibold">
                  Cüzdan Bağlı
                </span>
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
              Freighter Cüzdanını Bağla
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
                Yeni Hediye Programla
              </button>
            </div>

            {/* Create Gift Form */}
            {showCreateForm && (
              <div className="max-w-2xl mx-auto mb-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-pink-400" />
                    Hediye Programla
                  </h2>

                  <form onSubmit={handleScheduleGift} className="space-y-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">
                        Alıcı Cüzdan Adresi
                      </label>
                      <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                          Miktar (XLM)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                          placeholder="100"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-bold mb-2">
                          Özel Gün
                        </label>
                        <select
                          value={specialDay}
                          onChange={(e) => setSpecialDay(e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                          required
                        >
                          <option value="">Seçiniz</option>
                          {specialDayOptions.map((option) => (
                            <option
                              key={option}
                              value={option}
                              className="text-gray-900"
                            >
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">
                        Gönderim Tarihi
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-bold mb-2">
                        Açıklama (Opsiyonel)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 h-24 resize-none"
                        placeholder="Hediyeniz için özel bir mesaj..."
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Hediye Programla
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors duration-200"
                      >
                        İptal
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
                  Programlanan Hediyeler
                </h2>

                <div className="grid gap-4">
                  {giftSchedules.map((gift) => (
                    <div
                      key={gift.id}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <Heart className="w-6 h-6 text-pink-400" />
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
                              ? "Bekliyor"
                              : gift.status === "sent"
                              ? "Gönderildi"
                              : "Başarısız"}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-300 text-sm">
                          <span className="font-semibold">Alıcı:</span>{" "}
                          {gift.recipientAddress.slice(0, 8)}...
                          {gift.recipientAddress.slice(-8)}
                        </p>
                        {gift.description && (
                          <p className="text-gray-300 text-sm">
                            <span className="font-semibold">Mesaj:</span>{" "}
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
