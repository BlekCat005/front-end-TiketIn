import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from "@heroui/react";
import { Controller } from "react-hook-form";
import InputFile from "@/components/ui/InputFIle";
import { useEffect } from "react";
import useAddEventModal from "./useAddEventModal";
import { ICategory } from "@/types/Category";
import { IRegency } from "@/types/Event";
import {
  DateValue,
  getLocalTimeZone,
  now,
  ZonedDateTime,
} from "@internationalized/date";

interface PropTypes {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  refetchEvents: () => void;
}

const AddEventModal = (props: PropTypes) => {
  const { isOpen, onClose, onOpenChange, refetchEvents } = props;
  const {
    control,
    errors,
    handleAddEvent,
    handleSubmitForm,
    isPendingMutateAddEvent,
    isSuccessMutateAddEvent,
    setValue,

    preview,
    handleUploadBanner,
    isPendingMutateUploadFile,
    handleDeleteBanner,
    isPendingMutateDeleteFile,
    handleOnClose,

    dataCategory,
    dataRegion,
    searchRegency,
    handleSearchRegion,
  } = useAddEventModal();

  useEffect(() => {
    if (isSuccessMutateAddEvent) {
      onClose();
      refetchEvents();
    }
  }, [isSuccessMutateAddEvent]);

  const disabledSubmit =
    isPendingMutateAddEvent ||
    isPendingMutateUploadFile ||
    isPendingMutateDeleteFile;

  useEffect(() => {
    setValue("startDate", now(getLocalTimeZone()));
    setValue("endDate", now(getLocalTimeZone()));
  }, [onOpenChange]);

  return (
    <Modal
      onOpenChange={onOpenChange}
      isOpen={isOpen}
      placement="center"
      scrollBehavior="inside"
      onClose={() => handleOnClose(onClose)}
    >
      <form onSubmit={handleSubmitForm(handleAddEvent)}>
        <ModalContent className="m-4">
          <ModalHeader>Add Event</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold">Information</p>
              <div className="flex flex-col gap-2">
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoFocus
                      label="Name"
                      variant="bordered"
                      isInvalid={errors.name !== undefined}
                      errorMessage={errors.name?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Slug"
                      variant="bordered"
                      isInvalid={errors.slug !== undefined}
                      errorMessage={errors.slug?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="category"
                  render={({ field: { onChange, ...field } }) => (
                    <Autocomplete
                      {...field}
                      defaultItems={dataCategory?.data.data || []}
                      label="Category"
                      variant="bordered"
                      isInvalid={errors.category !== undefined}
                      errorMessage={errors.category?.message}
                      onSelectionChange={(value) => onChange(value)}
                      placeholder="Search category"
                    >
                      {(category: ICategory) => (
                        <AutocompleteItem key={`${category._id}`}>
                          {category.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Start Date"
                      variant="bordered"
                      value={field.value as any}
                      hideTimeZone
                      showMonthAndYearPickers
                      isInvalid={errors.startDate !== undefined}
                      errorMessage={errors.startDate?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="endDate"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="End Date"
                      variant="bordered"
                      value={field.value as any}
                      hideTimeZone
                      showMonthAndYearPickers
                      isInvalid={errors.endDate !== undefined}
                      errorMessage={errors.endDate?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="isPublish"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Status"
                      variant="bordered"
                      isInvalid={errors.isPublish !== undefined}
                      errorMessage={errors.isPublish?.message}
                      disallowEmptySelection
                    >
                      <SelectItem key="true">Publish</SelectItem>
                      <SelectItem key="false">Draft</SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Featured"
                      variant="bordered"
                      isInvalid={errors.isFeatured !== undefined}
                      errorMessage={errors.isFeatured?.message}
                      disallowEmptySelection
                    >
                      <SelectItem key="true">Yes</SelectItem>
                      <SelectItem key="false">No</SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="isOnline"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Online / Offline"
                      variant="bordered"
                      isInvalid={errors.isOnline !== undefined}
                      errorMessage={errors.isOnline?.message}
                      disallowEmptySelection
                    >
                      <SelectItem key="true">Online</SelectItem>
                      <SelectItem key="false">Offline</SelectItem>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Description"
                      variant="bordered"
                      isInvalid={errors.description !== undefined}
                      errorMessage={errors.description?.message}
                    />
                  )}
                />
              </div>

              <p className="text-sm font-bold">Location</p>
              <div className="mb-4 flex flex-col gap-4">
                <Controller
                  control={control}
                  name="region"
                  render={({ field: { onChange, ...field } }) => (
                    <Autocomplete
                      {...field}
                      defaultItems={
                        dataRegion?.data.data && searchRegency !== ""
                          ? dataRegion.data.data
                          : []
                      }
                      label="City"
                      onInputChange={(search) => handleSearchRegion(search)}
                      variant="bordered"
                      isInvalid={errors.region !== undefined}
                      errorMessage={errors.region?.message}
                      onSelectionChange={(value) => onChange(value)}
                      placeholder="Search city"
                    >
                      {(regency: IRegency) => (
                        <AutocompleteItem key={`${regency.id}`}>
                          {regency.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  )}
                />
                <Controller
                  control={control}
                  name="latitude"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Latitude"
                      variant="bordered"
                      isInvalid={errors.latitude !== undefined}
                      errorMessage={errors.latitude?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="longitude"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Longitude"
                      variant="bordered"
                      isInvalid={errors.longitude !== undefined}
                      errorMessage={errors.longitude?.message}
                    />
                  )}
                />
              </div>
              <p className="text-sm font-bold">Banner</p>
              <Controller
                name="banner"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <InputFile
                    {...field}
                    name="banner"
                    onUpload={(files) => handleUploadBanner(files, onChange)}
                    onDelete={() => handleDeleteBanner(onChange)}
                    isUploading={isPendingMutateUploadFile}
                    isDeleting={isPendingMutateDeleteFile}
                    isInvalid={errors.banner !== undefined}
                    errorMessage={errors.banner?.message}
                    isDropable
                    preview={typeof preview === "string" ? preview : ""}
                  />
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => handleOnClose(onClose)}
              disabled={disabledSubmit}
            >
              Cancel
            </Button>
            <Button color="danger" type="submit" disabled={disabledSubmit}>
              {isPendingMutateAddEvent ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Create Event"
              )}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default AddEventModal;
