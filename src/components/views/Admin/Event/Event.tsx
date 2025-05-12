import DataTable from "@/components/ui/DataTable";
import { Chip, useDisclosure } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect } from "react";
import useEvent from "./useEvent";
import useChangeUrl from "@/hooks/useChangeUrl";
import DropdownAction from "@/components/commons/DropdownAction";
import AddEventModal from "./AddEventModal";
import DeleteEventModal from "./DeleteEventModal";
import { COLUMN_LISTS_EVENT } from "./Event.constants";

const Event = () => {
  const { push, isReady, query } = useRouter();

  const {
    dataEvents,
    isLoadingEvents,
    isRefetchingEvents,
    refetchEvents,

    selectedId,
    setSelectedId,
  } = useEvent();

  const { setUrl } = useChangeUrl();

  const addEventModalDisclosure = useDisclosure();
  const deleteEventModalDisclosure = useDisclosure();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const renderCell = useCallback(
    (event: Record<string, unknown>, columnKey: Key) => {
      const cellValue = event[columnKey as keyof typeof event];

      switch (columnKey) {
        case "banner":
          return (
            <Image
              className="aspect-video w-36 rounded-lg object-cover"
              src={`${cellValue}`}
              alt="icon"
              width={200}
              height={100}
            />
          );
        case "isPublish":
          return (
            <Chip
              color={cellValue ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {cellValue ? "Published" : "Not Published"}
            </Chip>
          );
        case "actions":
          return (
            <DropdownAction
              onPressButtonDetail={() => push(`/admin/event/${event._id}`)}
              onPressButtonDelete={() => {
                setSelectedId(`${event._id}`);
                deleteEventModalDisclosure.onOpen();
              }}
            />
          );
        default:
          return cellValue as ReactNode;
      }
    },

    [push],
  );

  return (
    <section>
      {Object.keys(query).length > 0 && (
        <DataTable
          renderCell={renderCell}
          columns={COLUMN_LISTS_EVENT}
          data={dataEvents?.data || []}
          emptyContent="Event is empty"
          buttonTopContentLabel="Create Event"
          onClickButtonTopContent={addEventModalDisclosure.onOpen}
          totalPages={dataEvents?.pagination.totalPages}
          isLoading={isLoadingEvents || isRefetchingEvents}
        />
      )}

      <AddEventModal
        refetchEvents={refetchEvents}
        {...addEventModalDisclosure}
      />
      <DeleteEventModal
        refetchEvents={refetchEvents}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        {...deleteEventModalDisclosure}
      />
    </section>
  );
};

export default Event;
