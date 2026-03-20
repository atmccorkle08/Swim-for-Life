import { NextResponse } from "next/server";
import { z } from "zod";
import mailchimp from "@/lib/mailchimp";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const listId = process.env.MAILCHIMP_LIST_ID;
    if (!listId) {
      return NextResponse.json(
        { success: false, message: "Newsletter service is not configured." },
        { status: 500 }
      );
    }

    await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
    });

    return NextResponse.json({
      success: true,
      message: "You're subscribed! Thanks for joining.",
    });
  } catch (error: unknown) {
    // Handle Mailchimp "Member Exists" error
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      (error as { status: number }).status === 400
    ) {
      const mcError = error as { response?: { body?: { title?: string } } };
      if (mcError.response?.body?.title === "Member Exists") {
        return NextResponse.json({
          success: true,
          message: "You're already on the list! Thanks for being a supporter.",
          alreadySubscribed: true,
        });
      }
    }

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
