"use server";

import { revalidatePath } from "next/cache";

async function handleStarAction(messageId: string, action: "star" | "unstar") {
  const { BASEURL } = process.env;
  const url = `http://localhost:3000/api/star`;
  console.log(messageId);
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId, action }),
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error handling star action:", error);
  }
}

export { handleStarAction };
