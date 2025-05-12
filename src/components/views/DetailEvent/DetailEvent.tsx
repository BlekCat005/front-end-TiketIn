import {
  BreadcrumbItem,
  Breadcrumbs,
  Skeleton,
  Tab,
  Tabs,
} from "@heroui/react";
import useDetailEvent from "./useDetailEvent";
import { FaClock, FaLocationDot } from "react-icons/fa6";
import { convertTime } from "@/utils/date";
import Image from "next/image";
import { ITicket } from "@/types/Ticket";
import DetailEventTicket from "./DetailEventTicket";
import DetailEventCart from "./DetailEventCart";
import Script from "next/script";
import environment from "@/config/environment";

const DetailEvent = () => {
  const {
    dataEvent,
    dataTicket,
    dataTicketInCart,
    cart,
    handleAddToCart,
    handleChangeQuantity,
    mutateCreateOrder,
    isPendingCreateOrder,
  } = useDetailEvent();
  return (
    <div className="max-w-full overflow-x-hidden px-4 md:px-8 lg:px-0">
      <Script
        src={environment.MIDTRANS_SNAP_URL}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
        onLoad={() => {
          console.log("Midtrans Snap script telah dimuat!");
        }}
      />
      <Skeleton
        className="mb-4 h-6 w-1/4 rounded-lg"
        isLoaded={!!dataEvent?.name}
      >
        <div className="mb-4">
          <Breadcrumbs className="whitespace-nowrap py-2 text-sm md:text-base">
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/event">Event</BreadcrumbItem>
            <BreadcrumbItem className="break-words md:max-w-none md:truncate">
              {dataEvent?.name}
            </BreadcrumbItem>
          </Breadcrumbs>
        </div>
      </Skeleton>

      <section className="mt-16 flex flex-col gap-5 md:mt-12 md:gap-10 lg:mt-8 lg:flex-row">
        <div className="w-full lg:w-4/6">
          <Skeleton
            isLoaded={!!dataEvent?.name}
            className="mb-4 h-8 rounded-lg"
          >
            <h1 className="mb-4 text-xl font-semibold text-danger md:text-2xl">
              {dataEvent?.name}
            </h1>
          </Skeleton>
          <Skeleton
            className="mb-4 h-6 w-full rounded-lg md:w-1/2"
            isLoaded={!!dataEvent?.startDate || !!dataEvent?.endDate}
          >
            <div className="mb-4 flex items-center gap-2 text-sm text-foreground-500 md:text-base">
              <FaClock className="flex-shrink-0" size={16} />
              <p className="line-clamp-1">
                {convertTime(dataEvent?.startDate)} -{" "}
                {convertTime(dataEvent?.endDate)}
              </p>
            </div>
          </Skeleton>
          <Skeleton
            className="mb-6 h-6 w-full rounded-lg md:w-1/2"
            isLoaded={!!dataEvent?.isOnline || !!dataEvent?.location}
          >
            <div className="mb-6 flex items-center gap-2 text-sm text-foreground-500 md:text-base">
              <FaLocationDot className="flex-shrink-0" size={16} />
              <p className="line-clamp-2">
                {dataEvent?.isOnline ? "Online" : "Offline"}{" "}
                {dataEvent?.isOnline
                  ? ""
                  : ` - ${dataEvent?.location?.address}`}
              </p>
            </div>
          </Skeleton>
          <Skeleton
            className="mb-3 aspect-video w-full md:mb-4"
            isLoaded={!!dataEvent?.banner}
          >
            <Image
              alt="cover"
              src={dataEvent?.banner ?? "/default-banner.jpg"} // Fallback ke gambar default
              className="aspect-video w-full rounded-lg object-cover"
              width={1920}
              height={1080}
            />
          </Skeleton>
          <Tabs
            aria-label="Tab Detail Event"
            fullWidth
            className="text-sm md:text-base"
          >
            <Tab key="Description" title="Description">
              <h2 className="text-lg font-semibold text-foreground-700 md:text-xl">
                About Event
              </h2>
              <Skeleton
                className="mt-2 h-32 w-full rounded-lg"
                isLoaded={!!dataEvent?.description}
              >
                <p className="text-sm text-foreground-500 md:text-base">
                  {dataEvent?.description}
                </p>
              </Skeleton>
            </Tab>
            <Tab key="Ticket" title="Ticket">
              <h2 className="text-lg font-semibold text-foreground-700 md:text-xl">
                Ticket
              </h2>
              <div className="mt-2 flex flex-col gap-4 md:gap-8">
                {dataTicket?.map((ticket: ITicket) => (
                  <DetailEventTicket
                    key={`ticket-${ticket._id}`}
                    ticket={ticket}
                    cart={cart}
                    handleAddToCart={() => handleAddToCart(`${ticket._id}`)}
                  />
                ))}
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="sticky top-4 mt-5 w-full self-start lg:mt-0 lg:w-2/6">
          <DetailEventCart
            cart={cart}
            dataTicketInCart={dataTicketInCart}
            onChangeQuantity={handleChangeQuantity}
            onCreateOrder={mutateCreateOrder}
            isLoading={isPendingCreateOrder}
          />
        </div>
      </section>
    </div>
  );
};

export default DetailEvent;
