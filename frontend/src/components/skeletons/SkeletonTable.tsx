import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface SkeletonTableProps {
    
    rowCount: number;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({ rowCount }) => {
    const items: any = Array.from({ length: rowCount }, (v, i) => i);

    const renderSkeleton = () => <Skeleton width="100%" height="1.5rem" />;
    
    const columns = [
        { field: 'code', width: '25%' },
        { field: 'name', width: '25%' },
        { field: 'category', width: '25%' },
        { field: 'quantity', width: '25%' },
    ];
    return (
        <div className="card">
            <DataTable value={items} className="p-datatable-striped" header={<Skeleton  width="100%" height="1.5rem" />}>
                {columns.map((column, index) => (
                    <Column key={index} field={column.field} style={{ width: column.width }} body={renderSkeleton} />
                ))}
            </DataTable>
        </div>
    );
};

export default SkeletonTable;