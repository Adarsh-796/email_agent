"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { modifyEmailLabelsOptions } from "./types";

async function handleLabelAction(
  messageId: string,
  options: modifyEmailLabelsOptions,
) {
  const { BASEURL } = process.env;
  const url = `${process.env.NEXT_PUBLIC_BASEURL}/api/labels`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId, options }),
      // cache: "no-store",
    });
    // revalidatePath("/");
    // revalidateTag("fetchEmails", "max");
  } catch (error) {
    console.error("Error handling label action:", error);
  }
}

export { handleLabelAction };
