import categoryServices from "@/services/category.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const useDetailCategory = () => {
  const { query, isReady } = useRouter();

  console.log("isReady:", isReady);
  console.log("query.id:", query.id);

  const getcategoryById = async (id: string) => {
    const { data } = await categoryServices.getCategoryById(id);

    return data.data;
  };

  const { data: dataCategory } = useQuery({
    queryKey: ["Category", query.id],
    queryFn: () => getcategoryById(`${query.id}`),
    enabled: isReady,
  });

  return { dataCategory };
};

export default useDetailCategory;
