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

  const { data: dataTransaction } = useQuery({
    queryKey: ["Transaction", orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const { data } = await orderServices.getOrderById(orderId);
      return data.data;
    },
    enabled: !!orderId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

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

  return {
    dataTransaction,
    dataEvent,
    dataTicket,
  };
};

export default useDetailTransaction;
