"use client";
import { fetchContacts } from "@/lib/api/fetchContacts";
import { useQuery } from "@tanstack/react-query";

export default function useContacts() {
    return useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContacts,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });
}