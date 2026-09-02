import { Contact } from "@/app/types/types";

export async function fetchContacts(): Promise<Contact[]>{
        const res = await fetch("http://localhost:3000/test-json-data/mock_db.json");
        if(!res.ok) throw new Error ("Failed to fetch contacts");
        const data = await res.json();
        return data;
}