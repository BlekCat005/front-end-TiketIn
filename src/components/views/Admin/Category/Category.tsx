import DataTable from "@/components/ui/DataTable";
import { useDisclosure } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect } from "react";
import { COLUMN_LIST_CATEGORY } from "./Category.constants";
import useCategory from "./useCategory";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import useChangeUrl from "@/hooks/useChangeUrl";
import DropdownAction from "@/components/commons/DropdownAction";

const Category = () => {
  const { push, isReady, query } = useRouter();

  const {
    dataCategory,
    isLoadingCategory,
    isRefetchingCategory,
    refetchCategory,

    selectedId,
    setSelectedId,
  } = useCategory();

  const addCategoryModalDisclosure = useDisclosure();
  const deleteCategoryModalDisclosure = useDisclosure();

  const { setUrl } = useChangeUrl();

  useEffect(() => {
    if (isReady) {
      setUrl();
    }
  }, [isReady]);

  const renderCell = useCallback(
    (category: Record<string, unknown>, columnKey: Key) => {
      const cellValue = category[columnKey as keyof typeof category];

      switch (columnKey) {
        case "icon":
          return (
            <Image src={`${cellValue}`} alt="icon" width={100} height={200} />
          );

        case "actions":
          return (
            <DropdownAction
              onPressButtonDetail={() =>
                push(`/admin/category/${category._id}`)
              }
              onPressButtonDelete={() => {
                setSelectedId(`${category._id}`);
                deleteCategoryModalDisclosure.onOpen();
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
          columns={COLUMN_LIST_CATEGORY}
          data={dataCategory?.data || []}
          emptyContent="Category is empty"
          buttonTopContentLabel="Create Category"
          onClickButtonTopContent={addCategoryModalDisclosure.onOpen}
          totalPages={dataCategory?.pagination.totalPages}
          isLoading={isLoadingCategory || isRefetchingCategory}
        />
      )}
      <AddCategoryModal
        refetchCategory={refetchCategory}
        {...addCategoryModalDisclosure}
      />
      <DeleteCategoryModal
        refetchCategory={refetchCategory}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        {...deleteCategoryModalDisclosure}
      />
    </section>
  );
};

export default Category;
