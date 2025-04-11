import DataTable from "@/components/ui/DataTable";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Key, ReactNode, useCallback, useEffect } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { COLUMN_LIST_CATEGORY } from "./Category.constants";
import { LIMIT_LISTS } from "@/constants/list.constants";
import useCategory from "./useCategory";
import InputFile from "@/components/ui/InputFIle";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

const Category = () => {
  const { push, isReady, query } = useRouter();
  const {
    currentPage,
    currentLimit,
    dataCategory,
    isLoadingCategory,
    isRefetchingCategory,
    refetchCategory,
    setURL,
    handleChangeLimit,
    handleChangeLimitFromSelect,
    handleChangePage,
    handleClearSearch,
    handleSearch,

    selectedId,
    setSelectedId,
  } = useCategory();

  const addCategoryModalDisclosure = useDisclosure();
  const deleteCategoryModalDisclosure = useDisclosure();

  useEffect(() => {
    if (isReady) {
      setURL();
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
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <CiMenuKebab className="text-default-700" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  key="detail-category-button"
                  onPress={() => push(`/admin/category/${category._id}`)}
                >
                  Detail Category
                </DropdownItem>
                <DropdownItem
                  key="delete-category"
                  className="text-danger-500"
                  onPress={() => {
                    setSelectedId(`${category._id}`);
                    deleteCategoryModalDisclosure.onOpen();
                  }}
                >
                  Delete Category
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
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
          currentPage={Number(currentPage)}
          limit={String(currentLimit)}
          onChangePage={handleChangePage}
          onChangeLimit={handleChangeLimitFromSelect}
          onChangeSearch={handleSearch}
          onClearSearch={handleClearSearch}
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
