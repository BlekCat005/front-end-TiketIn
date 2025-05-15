import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import eventServices from "@/services/event.service";
import orderServices from "@/services/order.service";
import ticketServices from "@/services/ticket.service";

const useDetailTransaction = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && typeof router.query.id === "string") {
      setOrderId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  // Fetch transaction data
  const { data: dataTransaction, refetch: refetchTransaction } = useQuery({
    queryKey: ["Transaction", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data } = await orderServices.getOrderById(orderId);
      return data.data;
    },
    enabled: !!orderId,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Polling every 30 seconds to get updated status
  });

  // Fetch event data based on transaction
  const { data: dataEvent } = useQuery({
    queryKey: ["EventById", dataTransaction?.events],
    queryFn: async () => {
      const { data } = await eventServices.getEventById(
        dataTransaction!.events,
      );
      return data.data;
    },
    enabled: !!dataTransaction?.events,
  });

  // Fetch ticket data based on transaction
  const { data: dataTicket } = useQuery({
    queryKey: ["Tickets", dataTransaction?.ticket],
    queryFn: async () => {
      const { data } = await ticketServices.getTicketsById(
        dataTransaction!.ticket,
      );
      return data.data;
    },
    enabled: !!dataTransaction?.ticket,
  });

  // Handle logic if transaction status is 'completed'
  useEffect(() => {
    if (dataTransaction?.status === "completed") {
      // Here, you can add logic to display success message, enable download button, etc.
      console.log("Transaction completed!");
    }
  }, [dataTransaction?.status]);

  return {
    dataTransaction,
    dataEvent,
    dataTicket,
    refetchTransaction, // Expose refetch in case you want to manually trigger it
  };
};

export default useDetailTransaction;
