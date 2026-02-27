import { GeneralWorker } from "@/lib/worker/general-worker";
import { MyUIMessage } from "../chat/route";

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();
  try {
    await GeneralWorker(messages);
  } catch (error) {
    console.log(error);
  }
}
