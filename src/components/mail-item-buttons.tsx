'use client'

import { Archive,Trash, Mail } from "lucide-react";
import { Button } from "./ui/button";

export default function MailItemButtons(){
    return(
        <>
        <Button variant={"ghost"}
            onClick={() => console.log("Archive")}
            className="h-8 w-8 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <Archive className="w-4 h-4 text-gray-700" />
          </Button>
          <Button variant={"ghost"}
            onClick={() => console.log("Delete")}
            className="h-8 w-8 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <Trash className="w-4 h-4 text-gray-700" />
          </Button>
          <Button variant={"ghost"}
            onClick={() => console.log("Mark as unread")}
            className="h-8 w-8 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <Mail className="w-4 h-4 text-gray-700" />
          </Button>
        </>
    )
}
