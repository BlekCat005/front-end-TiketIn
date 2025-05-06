import { ToasterContext } from "@/contexts/ToasterContext";
import useMediaHandling from "@/hooks/useMediaHandling";
import categoryServices from "@/services/category.service";
import ticketServices from "@/services/ticket.service";
import { ICategory } from "@/types/Category";
import { ITicket } from "@/types/Ticket";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Please input name for category"),
  price: Yup.string().required("Please input description for price"),
  quantity: Yup.string().required("Please input name for quantity"),
  description: Yup.string().required("Please input description for category"),
});

const useUpdateTicketModal = (id: string) => {
  const router = useRouter();
  const { setToaster } = useContext(ToasterContext);

  const {
    control,
    handleSubmit: handleSubmitForm,
    formState: { errors },
    reset,
    setValue: setValueUpdateTicket,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const updateTicket = async (payload: ITicket) => {
    const res = await ticketServices.updateTicket(id, payload);
    return res;
  };

  const {
    mutate: mutateUpdateTicket,
    isPending: isPendingMutateUpdateTicket,
    isSuccess: isSuccessMutateUpdateTicket,
  } = useMutation({
    mutationFn: updateTicket,
    onError: (error) => {
      setToaster({
        type: "error",
        message: error.message,
      });
    },
    onSuccess: () => {
      setToaster({
        type: "success",
        message: "Ticket updated successfully",
      });
      reset();
    },
  });

  const handleUpdateTicket = (data: ITicket) => {
    data.events = `${router.query.id}`;
    data.price = Number(data.price);
    data.quantity = Number(data.quantity);
    mutateUpdateTicket(data);
  };

  return {
    control,
    errors,
    reset,
    handleUpdateTicket,
    handleSubmitForm,
    isPendingMutateUpdateTicket,
    isSuccessMutateUpdateTicket,
    setValueUpdateTicket,
  };
};

export default useUpdateTicketModal;
