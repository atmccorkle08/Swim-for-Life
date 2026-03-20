import { NextResponse } from "next/server";
import { registrationSchema } from "@/lib/validations";
import { insertRegistration } from "@/lib/db";
import { appendRegistration } from "@/lib/google-sheets";
import { sendConfirmationEmail, sendCoachNotification } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Server-side validation
    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // Insert into Supabase (primary — must succeed)
    try {
      await insertRegistration(data);
    } catch (error) {
      console.error("Supabase registration error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Something went wrong. Please try again.",
        },
        { status: 500 }
      );
    }

    // Send emails (non-critical — log errors but don't fail)
    try {
      await sendConfirmationEmail(data);
    } catch (error) {
      console.error("Confirmation email error:", error);
    }

    try {
      await sendCoachNotification(data);
    } catch (error) {
      console.error("Coach notification email error:", error);
    }

    // Sync to Google Sheets (non-critical backup for coaches)
    try {
      await appendRegistration(data);
    } catch (error) {
      console.error("Google Sheets sync error:", error);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
