"use client";

import { useState } from "react";
import { Database } from "@/lib/supabase/database.types";
import { ServiceSelection } from "./steps/service-selection";
import { DateSelection } from "./steps/date-selection";
import { TimeSelection } from "./steps/time-selection";
import { CustomerDetails } from "./steps/customer-details";
// @ts-ignore - Module exists but TypeScript can't resolve it
import { PaymentSelection } from "./steps/payment-selection";
// @ts-ignore - Module exists but TypeScript can't resolve it
import { BookingConfirmation } from "./steps/booking-confirmation";

type Service = Database["public"]["Tables"]["services"]["Row"];

interface BookingWidgetProps {
  barberId: string;
  services: Service[];
  travelEnabled: boolean;
}

export type BookingStep =
  | "service"
  | "date"
  | "time"
  | "details"
  | "payment"
  | "confirmation";

export interface BookingData {
  serviceId: string;
  date: string;
  timeSlot: { start: string; end: string };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  locationType: "in-shop" | "home-visit";
  customerAddress?: string;
  paymentMethod: "on-site" | "online";
  bookingId?: string;
}

export function BookingWidget({
  barberId,
  services,
  travelEnabled,
}: BookingWidgetProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("service");
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({});

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const goToNextStep = () => {
    const steps: BookingStep[] = [
      "service",
      "date",
      "time",
      "details",
      "payment",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const steps: BookingStep[] = [
      "service",
      "date",
      "time",
      "details",
      "payment",
      "confirmation",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {(
            ["service", "date", "time", "details", "payment"] as BookingStep[]
          ).map((step, index) => {
            const steps: BookingStep[] = [
              "service",
              "date",
              "time",
              "details",
              "payment",
            ];
            const currentIndex = steps.indexOf(currentStep);
            const stepIndex = steps.indexOf(step);
            const isActive = stepIndex === currentIndex;
            const isCompleted = stepIndex < currentIndex;

            return (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : isCompleted
                        ? "border-green-600 bg-green-600 text-white"
                        : "border-gray-300 dark:border-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted
                        ? "bg-green-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Service</span>
          <span>Date</span>
          <span>Time</span>
          <span>Details</span>
          <span>Payment</span>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === "service" && (
        <ServiceSelection
          services={services}
          selectedServiceId={bookingData.serviceId}
          onSelect={(serviceId) => {
            updateBookingData({ serviceId });
            goToNextStep();
          }}
        />
      )}

      {currentStep === "date" && bookingData.serviceId && (
        <DateSelection
          barberId={barberId}
          serviceId={bookingData.serviceId}
          selectedDate={bookingData.date}
          onSelect={(date) => {
            updateBookingData({ date });
            goToNextStep();
          }}
          onBack={goToPreviousStep}
        />
      )}

      {currentStep === "time" && bookingData.serviceId && bookingData.date && (
        <TimeSelection
          barberId={barberId}
          serviceId={bookingData.serviceId}
          date={bookingData.date}
          selectedTimeSlot={bookingData.timeSlot}
          onSelect={(timeSlot) => {
            updateBookingData({ timeSlot });
            goToNextStep();
          }}
          onBack={goToPreviousStep}
        />
      )}

      {currentStep === "details" && (
        <CustomerDetails
          travelEnabled={travelEnabled}
          data={bookingData}
          onSubmit={(data) => {
            updateBookingData(data);
            goToNextStep();
          }}
          onBack={goToPreviousStep}
        />
      )}

      {currentStep === "payment" && (
        <PaymentSelection
          barberId={barberId}
          bookingData={bookingData as BookingData}
          onSuccess={(bookingId: string) => {
            updateBookingData({ bookingId });
            goToNextStep();
          }}
          onBack={goToPreviousStep}
        />
      )}

      {currentStep === "confirmation" && bookingData.bookingId && (
        <BookingConfirmation bookingId={bookingData.bookingId} />
      )}
    </div>
  );
}
