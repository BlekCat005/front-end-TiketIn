import DropdownAction from "@/components/commons/DropdownAction";
import { convertIDR } from "@/utils/currency";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@heroui/react";
import { Fragment, Key, ReactNode, useCallback, useState } from "react";
import { COLUMN_LIST_TICKET } from "./TicketTab.constants";
import DataTable from "@/components/ui/DataTable";
import useTicketTab from "./useTicketTab";
import AddTicketModal from "./AddTicketModal";
import DeleteTicketModal from "./DeleteTicketModal";
import { ITicket } from "@/types/Ticket";
import UpdateTicketModal from "./UpdateTicketModal";

const TicketTab = () => {
  const { dataTicket, refetchTicket, isPendingTicket, isRefetchingTicket } =
    useTicketTab();
  const addTicketModalDisclosure = useDisclosure();
  const deleteTicketModalDisclosure = useDisclosure();
  const updateTicketModalDisclosure = useDisclosure();

  const [selectedDataTicket, setSelectedDataTicket] = useState<ITicket | null>(
    null,
  );

  const renderCell = useCallback(
    (ticket: Record<string, unknown>, columnKey: Key) => {
      const cellValue = ticket[columnKey as keyof typeof ticket];

      switch (columnKey) {
        case "price":
          return `${convertIDR(cellValue as number)}`;
        case "actions":
          return (
            <DropdownAction
              onPressButtonDetail={() => {
                setSelectedDataTicket(ticket as ITicket);
                updateTicketModalDisclosure.onOpen();
              }}
              onPressButtonDelete={() => {
                setSelectedDataTicket(ticket as ITicket);
                deleteTicketModalDisclosure.onOpen();
              }}
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },

    [],
  );
  return (
    <Fragment>
      <Card className="w-full p-4">
        <CardHeader className="items-center justify-between">
          <div className="flex flex-col items-center">
            <h1 className="w-full text-xl font-bold">Event Ticket</h1>
            <p className="w-full text-small text-default-400">
              Manage ticket of this event
            </p>
          </div>
          <Button color="danger" onPress={addTicketModalDisclosure.onOpen}>
            Add New Ticket
          </Button>
        </CardHeader>
        <CardBody className="pt-0">
          <DataTable
            renderCell={renderCell}
            columns={COLUMN_LIST_TICKET}
            data={dataTicket || []}
            emptyContent="Ticket is empty"
            totalPages={1}
            isLoading={isPendingTicket || isRefetchingTicket}
            showSearch={false}
            showLimit={false}
            onClickButtonTopContent={addTicketModalDisclosure.onOpen}
          />
        </CardBody>
      </Card>
      <AddTicketModal
        {...addTicketModalDisclosure}
        refetchTicket={refetchTicket}
      />
      <DeleteTicketModal
        refetchTicket={refetchTicket}
        selectedDataTicket={selectedDataTicket}
        setSelectedDataTicket={setSelectedDataTicket}
        {...deleteTicketModalDisclosure}
      />
      <UpdateTicketModal
        refetchTicket={refetchTicket}
        selectedDataTicket={selectedDataTicket}
        setSelectedDataTicket={setSelectedDataTicket}
        {...updateTicketModalDisclosure}
      />
    </Fragment>
  );
};

export default TicketTab;
