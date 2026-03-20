import { z } from "zod";

export const registrationSchema = z
  .object({
    childName: z.string().min(1, "Child's name is required"),
    childAge: z
      .number({ error: "Age must be a number" })
      .int({ error: "Age must be a whole number" })
      .min(3, { error: "Minimum age is 3" })
      .max(18, { error: "Maximum age is 18" }),
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
      { error: "Please select a swim experience level" }
    ),
    hasSpecialNeeds: z.boolean(),
    specialNeedsDetails: z.string().optional(),
    sessionPreference: z.string().optional(),
    photoConsent: z.literal(true, {
      error: "Photo release consent is required",
    }),
    liabilityWaiver: z.literal(true, {
      error: "Liability waiver acknowledgment is required",
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
