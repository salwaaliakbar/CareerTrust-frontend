"use client";

import React from "react";
import { Star, Calendar, Briefcase, MapPin } from "lucide-react";
import { JobseekerReview } from "@/services/api/myReviews.service";
import Image from "next/image";

interface MyReviewsCardProps {
  reviews: JobseekerReview[];
  isLoading?: boolean;
}

export default function MyReviewsCard({ reviews, isLoading }: MyReviewsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getAspectColor = (score: number) => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return "Excellent";
    if (score >= 3.5) return "Good";
    if (score >= 2.5) return "Average";
    return "Poor";
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm p-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="w-full bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-8 border border-blue-100">
        <div className="text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
          <p className="text-gray-600">
            Share your work experience by writing reviews for companies where you have worked.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Your Reviews ({reviews.length})</h2>
        <span className="text-sm text-gray-600">Anonymous • Helping others</span>
      </div>

      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
        >
          {/* Header: Company Info */}
          <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-5 border-b border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                {review.company.logo && (
                  <div className="shrink-0">
                    <Image
                      src={review.company.logo}
                      alt={review.company.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{review.company.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {review.employment.position}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {review.company.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {review.employment.startDate}
                      {review.employment.endDate && ` - ${review.employment.endDate}`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  Your Review
                </span>
                <p className="text-xs text-gray-500 mt-2">{formatDate(review.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="p-5 border-b border-gray-100">
            <p className="text-gray-700 leading-relaxed">{review.reviewText}</p>
          </div>

          {/* Sentiment Analysis Breakdown */}
          <div className="bg-gray-50 p-5">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">AI Sentiment Analysis</h4>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(review.sentimentScores.overall)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {review.sentimentScores.overall.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {getScoreLabel(review.sentimentScores.overall)} ({review.rating}/5 manual rating)
              </p>
            </div>

            {/* Aspect Scores Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                {
                  label: "Work-Life Balance",
                  key: "workLifeBalance" as const,
                  icon: "⚖️",
                },
                {
                  label: "Company Culture",
                  key: "companyCulture" as const,
                  icon: "🤝",
                },
                { label: "Career Growth", key: "careerGrowth" as const, icon: "📈" },
                { label: "Salary & Benefits", key: "salaryBenefits" as const, icon: "💰" },
              ].map((aspect) => (
                <div key={aspect.key} className="bg-white rounded-lg p-3 border border-gray-200">
                  <div className="text-2xl mb-1">{aspect.icon}</div>
                  <p className="text-xs text-gray-600 font-medium mb-1">{aspect.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-sm font-bold ${getAspectColor(
                        review.sentimentScores.aspects[aspect.key],
                      )}`}
                    >
                      {review.sentimentScores.aspects[aspect.key].toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">/5</span>
                  </div>
                </div>
              ))}
            </div>

            {review.sentimentScores.analyzedAt && (
              <p className="text-xs text-gray-500 mt-3">
                Analyzed: {formatDate(review.sentimentScores.analyzedAt)}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs text-gray-600">
            <span>Updated: {formatDate(review.updatedAt)}</span>
            <span className="text-blue-600 font-semibold">
              ID: {review.id} • Completely Anonymous
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
