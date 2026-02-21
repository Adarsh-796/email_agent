"use server";

import { revalidatePath } from "next/cache";
import { modifyEmailLabelsOptions } from "./gmail";

async function handleStarAction(
  messageId: string,
  options: modifyEmailLabelsOptions,
) {
  const { BASEURL } = process.env;
  const url = `${BASEURL}/api/labels`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId, options }),
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error handling star action:", error);
  }
}

export { handleStarAction };
