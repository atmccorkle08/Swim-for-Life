import { z } from "zod";

export const registrationSchema = z
  .object({
    childName: z.string().min(1, "Child's name is required"),
    childAge: z
      .number({ invalid_type_error: "Age must be a number" })
      .int("Age must be a whole number")
      .min(3, "Minimum age is 3")
      .max(18, "Maximum age is 18"),
    parentName: z.string().min(1, "Parent/guardian name is required"),
    parentEmail: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    parentPhone: z
      .string()
      .min(1, "Phone number is required")
      .regex(
        /^[\d\s\-().+]+$/,
        "Please enter a valid phone number"
      ),
    swimExperience: z.enum(
      ["No experience", "Beginner", "Some experience"],
      { errorMap: () => ({ message: "Please select a swim experience level" }) }
    ),
    hasSpecialNeeds: z.boolean(),
    specialNeedsDetails: z.string().optional(),
    sessionPreference: z.string().optional(),
    photoConsent: z.literal(true, {
      errorMap: () => ({ message: "Photo release consent is required" }),
    }),
    liabilityWaiver: z.literal(true, {
      errorMap: () => ({ message: "Liability waiver acknowledgment is required" }),
    }),
  })
  .refine(
    (data) => {
      if (data.hasSpecialNeeds) {
        return (
          data.specialNeedsDetails !== undefined &&
          data.specialNeedsDetails.trim().length > 0
        );
      }
      return true;
    },
    {
      message: "Please describe any special needs or accommodations",
      path: ["specialNeedsDetails"],
    }
  );

export type RegistrationData = z.infer<typeof registrationSchema>;
