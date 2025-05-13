import eventServices from "@/services/event.service";
import orderServices from "@/services/order.service";
import ticketServices from "@/services/ticket.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useDetailTransaction = () => {
  const router = useRouter();
  const orderId = router.query.id;

  const getOrderById = async () => {
    if (!orderId || typeof orderId !== "string") {
      throw new Error("Order ID belum tersedia");
    }
    const { data } = await orderServices.getOrderById(orderId);
    return data.data;
  };

  const { data: dataTransaction } = useQuery({
    queryKey: ["Transaction", orderId],
    queryFn: getOrderById,
    enabled: router.isReady && typeof orderId === "string",
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const getEventById = async () => {
    const { data } = await eventServices.getEventById(
      `${dataTransaction?.events}`,
    );
    return data.data;
  };

  const { data: dataEvent } = useQuery({
    queryKey: ["EventById", dataTransaction?.events],
    queryFn: getEventById,
    enabled: !!dataTransaction?.events,
  });

  const getTicketsById = async () => {
    const { data } = await ticketServices.getTicketsById(
      `${dataTransaction?.ticket}`,
    );
    return data.data;
  };

  const { data: dataTicket } = useQuery({
    queryKey: ["Tickets", dataTransaction?.ticket],
    queryFn: getTicketsById,
    enabled: !!dataTransaction?.ticket,
  });

  return {
    dataTransaction,
    dataEvent,
    dataTicket,
  };
};

export default useDetailTransaction;
