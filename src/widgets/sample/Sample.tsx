"use client";

import { useState } from "react";
import Link from "next/link";

export default function Sample() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const events = [
    {
      id: 1,
      title: "2026 아이유 콘서트 in 서울",
      category: "concert",
      date: "2026.03.15",
      location: "고척스카이돔",
      price: "132,000원",
      image: "🎤",
      status: "available",
      seats: "234석 남음",
    },
    {
      id: 2,
      title: "BTS WORLD TOUR 2026",
      category: "concert",
      date: "2026.04.20",
      location: "잠실종합운동장",
      price: "165,000원",
      image: "🎵",
      status: "soldout",
      seats: "매진",
    },
    {
      id: 3,
      title: "뮤지컬 <위키드> 내한공연",
      category: "musical",
      date: "2026.05.10",
      location: "샤롯데씨어터",
      price: "99,000원",
      image: "🎭",
      status: "available",
      seats: "128석 남음",
    },
    {
      id: 4,
      title: "2026 롤드컵 결승전",
      category: "sports",
      date: "2026.11.05",
      location: "인천 영종도 경기장",
      price: "88,000원",
      image: "🏆",
      status: "available",
      seats: "523석 남음",
    },
    {
      id: 5,
      title: "스탠드업 코미디 <깔깔쇼>",
      category: "other",
      date: "2026.02.28",
      location: "홍대 라이브홀",
      price: "35,000원",
      image: "😂",
      status: "available",
      seats: "45석 남음",
    },
    {
      id: 6,
      title: "클래식 갈라 콘서트",
      category: "concert",
      date: "2026.03.08",
      location: "예술의전당",
      price: "120,000원",
      image: "🎻",
      status: "available",
      seats: "89석 남음",
    },
  ];

  const categories = [
    { id: "all", label: "전체" },
    { id: "concert", label: "콘서트" },
    { id: "musical", label: "뮤지컬/연극" },
    { id: "sports", label: "스포츠" },
    { id: "other", label: "기타" },
  ];

  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <h1 className="typography-section-header text-brand-600">
                우르르 URR
              </h1>
              <nav className="hidden md:flex gap-6">
                <a
                  href="#"
                  className="typography-body text-gray-700 hover:text-brand-600 transition-colors"
                >
                  공연
                </a>
                <a
                  href="#"
                  className="typography-body text-gray-700 hover:text-brand-600 transition-colors"
                >
                  티켓오픈
                </a>
                <a
                  href="#"
                  className="typography-body text-gray-700 hover:text-brand-600 transition-colors"
                >
                  랭킹
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <button className="typography-body text-gray-700 hover:text-brand-600 transition-colors">
                검색
              </button>
              <Link href="/login">
                <button className="px-4 py-2 bg-brand-600 text-white rounded-md typography-body-bold hover:bg-brand-700 transition-colors">
                  로그인
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-600 to-brand-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="typography-header mb-4">당신의 순간을 예매하세요</h2>
            <p className="typography-subheader text-brand-100 mb-8">
              콘서트부터 스포츠까지, 모든 티켓을 한 곳에서
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="공연명, 아티스트, 장소 검색"
                className="flex-1 px-6 py-3 rounded-lg typography-body text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <button className="px-8 py-3 bg-white text-brand-600 rounded-lg typography-body-bold hover:bg-brand-50 transition-colors">
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full typography-body-bold whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? "bg-brand-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="typography-section-header text-gray-900">
              인기 공연
            </h3>
            <button className="typography-body text-brand-600 hover:text-brand-700">
              전체보기 →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer"
              >
                {/* Image Placeholder */}
                <div className="aspect-[3/2] bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {event.image}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="typography-subheader text-gray-900 flex-1 pr-2">
                      {event.title}
                    </h4>
                    {event.status === "soldout" && (
                      <span className="px-2 py-1 bg-error-50 text-error-600 rounded typography-label font-semibold">
                        매진
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="typography-body">📅</span>
                      <span className="typography-body">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="typography-body">📍</span>
                      <span className="typography-body">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="typography-body">💺</span>
                      <span className="typography-body">{event.seats}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="typography-label text-gray-500 block">
                        시작가
                      </span>
                      <span className="typography-subheader text-brand-600">
                        {event.price}
                      </span>
                    </div>
                    <button
                      disabled={event.status === "soldout"}
                      className={`px-6 py-2 rounded-lg typography-body-bold transition-colors ${
                        event.status === "soldout"
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-brand-600 text-white hover:bg-brand-700"
                      }`}
                    >
                      {event.status === "soldout" ? "매진" : "예매하기"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="typography-section-header text-gray-900 mb-6">
            공지사항
          </h3>
          <div className="space-y-4">
            {[
              {
                title: "[필독] 티켓 예매 시 주의사항 안내",
                date: "2026.02.01",
                badge: "중요",
              },
              {
                title: "2월 오픈 예정 공연 안내",
                date: "2026.02.02",
                badge: null,
              },
              {
                title: "모바일 앱 업데이트 공지",
                date: "2026.01.30",
                badge: null,
              },
              {
                title: "설 연휴 고객센터 운영 안내",
                date: "2026.01.28",
                badge: null,
              },
            ].map((notice, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {notice.badge && (
                    <span className="px-2 py-1 bg-brand-100 text-brand-600 rounded typography-label font-semibold">
                      {notice.badge}
                    </span>
                  )}
                  <span className="typography-body text-gray-900">
                    {notice.title}
                  </span>
                </div>
                <span className="typography-label text-gray-500">
                  {notice.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="typography-subheader text-white mb-4">
                우르르 URR
              </h4>
              <p className="typography-body text-gray-400">
                대한민국 No.1
                <br />
                티켓팅 플랫폼
              </p>
            </div>
            <div>
              <h5 className="typography-body-bold text-white mb-3">고객센터</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="typography-body hover:text-white transition-colors"
                  >
                    공지사항
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="typography-body hover:text-white transition-colors"
                  >
                    자주 묻는 질문
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="typography-body hover:text-white transition-colors"
                  >
                    1:1 문의
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="typography-body-bold text-white mb-3">
                회사 정보
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="typography-body hover:text-white transition-colors"
                  >
                    회사소개
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="typography-body hover:text-white transition-colors"
                  >
                    이용약관
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="typography-body hover:text-white transition-colors"
                  >
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="typography-body-bold text-white mb-3">다운로드</h5>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-800 rounded-lg typography-body hover:bg-gray-700 transition-colors">
                  iOS
                </button>
                <button className="px-4 py-2 bg-gray-800 rounded-lg typography-body hover:bg-gray-700 transition-colors">
                  Android
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="typography-label text-gray-500">
              © 2026 우르르(URR). All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
