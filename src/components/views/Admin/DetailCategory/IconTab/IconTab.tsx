import InputFile from "@/components/ui/InputFIle";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Spinner,
} from "@heroui/react";
import Image from "next/image";
import useIconTab from "./useIconTab";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import { ICategory } from "@/types/Category";

interface PropTypes {
  currentIcon: string;
  onUpdate: (data: ICategory) => void;
  isPendingUpdate: boolean;
  isSuccessUpdate: boolean;
}

const IconTab = (props: PropTypes) => {
  const { currentIcon, onUpdate, isPendingUpdate, isSuccessUpdate } = props;
  const {
    handleDeleteIcon,
    handleUploadIcon,
    isPendingMutateDeleteFile,
    isPendingMutateUploadFile,

    controlUpdateIcon,
    handleSubmitUpdateIcon,
    errorsUpdateIcon,
    resetUpdateIcon,

    preview,
  } = useIconTab();

  useEffect(() => {
    if (isSuccessUpdate) {
      resetUpdateIcon();
    }
  }, [isSuccessUpdate]);

  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Category Icon</h1>
        <p className="w-full text-small text-default-400">
          Manage icon of this category
        </p>
      </CardHeader>
      <CardBody>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmitUpdateIcon(onUpdate)}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-default-700">Current Icon</p>
            <Skeleton
              isLoaded={!!currentIcon}
              className="aspect-square rounded-lg"
            >
              <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                {currentIcon && (
                  <Image
                    src={currentIcon}
                    alt="icon"
                    fill
                    className="!relative"
                  />
                )}
              </div>
            </Skeleton>
          </div>

          <Controller
            name="icon"
            control={controlUpdateIcon}
            render={({ field: { onChange, ref } }) => (
              <InputFile
                name="icon"
                onUpload={(files) => handleUploadIcon(files, onChange)}
                onDelete={() => handleDeleteIcon(onChange)}
                isUploading={isPendingMutateUploadFile}
                isDeleting={isPendingMutateDeleteFile}
                inputRef={ref}
                isInvalid={errorsUpdateIcon.icon !== undefined}
                errorMessage={errorsUpdateIcon.icon?.message}
                isDropable
                label={
                  <p className="mb-2 text-sm font-medium text-default-700">
                    Upload New Icon
                  </p>
                }
                preview={typeof preview === "string" ? preview : ""}
              />
            )}
          />

          <Button
            color="danger"
            className="mt-2 disabled:bg-default-500"
            type="submit"
            disabled={isPendingMutateUploadFile || isPendingUpdate || !preview}
          >
            {isPendingUpdate ? (
              <Spinner size="sm" color="white" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default IconTab;
