import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Spinner,
} from "@heroui/react";
import Image from "next/image";
import useImageTab from "./useImageTab";
import { Controller } from "react-hook-form";
import { useEffect } from "react";
import { IBanner } from "@/types/Banner";
import InputFile from "@/components/ui/InputFIle";

interface PropTypes {
  currentImage: string;
  onUpdate: (data: IBanner) => void;
  isPendingUpdate: boolean;
  isSuccessUpdate: boolean;
}

const ImageTab = (props: PropTypes) => {
  const { currentImage, onUpdate, isPendingUpdate, isSuccessUpdate } = props;
  const {
    handleDeleteImage,
    handleUploadImage,
    isPendingMutateDeleteFile,
    isPendingMutateUploadFile,

    controlUpdateImage,
    errorsUpdateImage,
    handleSubmitUpdateImage,
    resetUpdateImage,

    preview,
  } = useImageTab();

  useEffect(() => {
    if (isSuccessUpdate) {
      resetUpdateImage();
    }
  }, [isSuccessUpdate]);
  return (
    <Card className="w-full p-4 lg:w-1/2">
      <CardHeader className="flex-col items-center">
        <h1 className="w-full text-xl font-bold">Banner Image</h1>
        <p className="w-full text-small text-default-400">
          Manage Image of this banner
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-6">
        {" "}
        {/* Tambah gap lebih besar */}
        <form
          className="flex flex-col gap-6"
          onSubmit={handleSubmitUpdateImage(onUpdate)}
        >
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-default-700">
              Current Image
            </p>
            <div className="relative aspect-video w-full">
              {" "}
              {/* Container dengan aspect ratio 16:9 */}
              <Skeleton
                isLoaded={!!currentImage}
                className="h-full w-full rounded-lg"
              >
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt="Current Banner Image"
                    fill
                    className="rounded-lg object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
              </Skeleton>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {" "}
            {/* Tambah wrapper untuk input file */}
            <Controller
              name="image"
              control={controlUpdateImage}
              render={({ field: { onChange, value, ...field } }) => (
                <InputFile
                  {...field}
                  onDelete={() => handleDeleteImage(onChange)}
                  onUpload={(files) => handleUploadImage(files, onChange)}
                  isUploading={isPendingMutateUploadFile}
                  isDeleting={isPendingMutateDeleteFile}
                  isInvalid={!!errorsUpdateImage.image}
                  errorMessage={errorsUpdateImage.image?.message}
                  isDropable
                  label={
                    <p className="mb-2 text-sm font-medium text-default-700">
                      Upload New Image
                    </p>
                  }
                  preview={typeof preview === "string" ? preview : ""}
                />
              )}
            />
          </div>

          <div className="mt-8">
            {" "}
            {/* Tambah wrapper khusus untuk button dengan margin top lebih besar */}
            <Button
              type="submit"
              color="danger"
              className="w-full disabled:bg-default-500"
              disabled={
                isPendingMutateUploadFile || isPendingUpdate || !preview
              }
            >
              {isPendingUpdate ? (
                <Spinner size="sm" color="white" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default ImageTab;
