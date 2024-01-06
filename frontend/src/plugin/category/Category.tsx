import { FC, useEffect, useState } from 'react';
import CategoryForm from './CategoryForm';
import { useGetAllCategories } from '@/lib/react-query/queriesAndMutations';
import CategoryDataTable from '@/components/datatable/CategoryDatatable';
import Header from '@/components/ui/header';
import { Card } from 'primereact/card';
import { CategoryProvider } from './CategoryContext';
import { useParams } from 'react-router-dom';




const Category = () => {
  const {post_type} = useParams();
  const { mutateAsync: getAllCategories, isPending: isLoading } = useGetAllCategories();
  const [categories, setCategories] = useState(null);
  useEffect(() => {
    async function fetchCategories() {
      if(post_type){
        const categories = await getAllCategories(post_type);
        setCategories(categories.data.categories)
      }
    }
    fetchCategories();
  }, []);
  return (
    <div className='common-container'>
      <CategoryProvider>
        <Header title='Manage Categories' />
        <div className="flex p-0 ">
          <Card className="form_data " style={{ width: "34%" }} title="Category Form">
            <CategoryForm post_type={post_type} />
          </Card>
          <div className="data_table p-4" style={{ width: "66%" }}>
            <CategoryDataTable />
          </div>
        </div>
      </CategoryProvider>
    </div>
  );
}

export default Category;
