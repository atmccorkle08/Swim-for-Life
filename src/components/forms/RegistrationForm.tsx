"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { registrationSchema, type RegistrationData } from "@/lib/validations";

export default function RegistrationForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      hasSpecialNeeds: false,
      photoConsent: false as unknown as true,
      liabilityWaiver: false as unknown as true,
    },
  });

  const hasSpecialNeeds = watch("hasSpecialNeeds");

  const onSubmit = async (data: RegistrationData) => {
    setServerError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        setServerError(
          result.message || "Something went wrong. Please try again."
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-16 w-16 text-ocean mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold text-deep">
          Registration Submitted!
        </h3>
        <p className="mt-3 text-stone-600 max-w-md mx-auto">
          A coach will reach out within 48 hours to confirm your session.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            reset();
          }}
          className="mt-6 text-ocean font-semibold hover:underline"
        >
          Submit another registration
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {serverError}
        </div>
      )}

      {/* Child's Full Name */}
      <div>
        <label
          htmlFor="childName"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Child&apos;s Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="childName"
          type="text"
          {...register("childName")}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        />
        {errors.childName && (
          <p className="mt-1 text-sm text-red-600">{errors.childName.message}</p>
        )}
      </div>

      {/* Child's Age */}
      <div>
        <label
          htmlFor="childAge"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Child&apos;s Age <span className="text-red-500">*</span>
        </label>
        <input
          id="childAge"
          type="number"
          min={3}
          max={18}
          {...register("childAge", { valueAsNumber: true })}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        />
        {errors.childAge && (
          <p className="mt-1 text-sm text-red-600">{errors.childAge.message}</p>
        )}
      </div>

      {/* Parent/Guardian Full Name */}
      <div>
        <label
          htmlFor="parentName"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Parent/Guardian Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="parentName"
          type="text"
          {...register("parentName")}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        />
        {errors.parentName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.parentName.message}
          </p>
        )}
      </div>

      {/* Parent/Guardian Email */}
      <div>
        <label
          htmlFor="parentEmail"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Parent/Guardian Email <span className="text-red-500">*</span>
        </label>
        <input
          id="parentEmail"
          type="email"
          {...register("parentEmail")}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        />
        {errors.parentEmail && (
          <p className="mt-1 text-sm text-red-600">
            {errors.parentEmail.message}
          </p>
        )}
      </div>

      {/* Parent/Guardian Phone */}
      <div>
        <label
          htmlFor="parentPhone"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Parent/Guardian Phone <span className="text-red-500">*</span>
        </label>
        <input
          id="parentPhone"
          type="tel"
          {...register("parentPhone")}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        />
        {errors.parentPhone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.parentPhone.message}
          </p>
        )}
      </div>

      {/* Swim Experience Level */}
      <div>
        <label
          htmlFor="swimExperience"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Swim Experience Level <span className="text-red-500">*</span>
        </label>
        <select
          id="swimExperience"
          {...register("swimExperience")}
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        >
          <option value="">Select experience level</option>
          <option value="No experience">No experience</option>
          <option value="Beginner">Beginner</option>
          <option value="Some experience">Some experience</option>
        </select>
        {errors.swimExperience && (
          <p className="mt-1 text-sm text-red-600">
            {errors.swimExperience.message}
          </p>
        )}
      </div>

      {/* Special Needs Checkbox */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("hasSpecialNeeds")}
            className="w-4 h-4 rounded border-stone-300 text-ocean focus:ring-ocean"
          />
          <span className="text-sm text-stone-700">
            My child has special needs or requires accommodations
          </span>
        </label>
      </div>

      {/* Special Needs Details (conditional) */}
      {hasSpecialNeeds && (
        <div>
          <label
            htmlFor="specialNeedsDetails"
            className="block text-sm font-medium text-stone-700 mb-1"
          >
            Special Needs / Accommodations Details{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="specialNeedsDetails"
            rows={3}
            {...register("specialNeedsDetails")}
            className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
            placeholder="Please describe any accommodations your child may need..."
          />
          {errors.specialNeedsDetails && (
            <p className="mt-1 text-sm text-red-600">
              {errors.specialNeedsDetails.message}
            </p>
          )}
        </div>
      )}

      {/* Session Preference */}
      <div>
        <label
          htmlFor="sessionPreference"
          className="block text-sm font-medium text-stone-700 mb-1"
        >
          Session Preference{" "}
          <span className="text-stone-400 font-normal">(optional)</span>
        </label>
        <input
          id="sessionPreference"
          type="text"
          {...register("sessionPreference")}
          placeholder="e.g., Morning sessions preferred"
          className="w-full rounded-lg border border-stone-300 px-4 py-2.5 text-deep focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
        />
      </div>

      {/* Photo Release Consent */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("photoConsent")}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 text-ocean focus:ring-ocean"
          />
          <span className="text-sm text-stone-700">
            I consent to my child being photographed or videoed during lessons
            for use on the Swim for Life website and social media.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.photoConsent && (
          <p className="mt-1 text-sm text-red-600">
            {errors.photoConsent.message}
          </p>
        )}
      </div>

      {/* Liability Waiver */}
      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("liabilityWaiver")}
            className="w-4 h-4 mt-0.5 rounded border-stone-300 text-ocean focus:ring-ocean"
          />
          <span className="text-sm text-stone-700">
            I acknowledge that swimming involves inherent risks and agree to hold
            Swim for Life, its coaches, and North Palm Beach Country Club
            harmless from any liability.{" "}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.liabilityWaiver && (
          <p className="mt-1 text-sm text-red-600">
            {errors.liabilityWaiver.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-ocean text-white rounded-full px-8 py-3 font-semibold hover:bg-ocean-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Registration"
        )}
      </button>
    </form>
  );
}
