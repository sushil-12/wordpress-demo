import { useUserContext } from '@/context/AuthProvider';
import { formatString } from '@/lib/utils';
import { Edit3Icon } from 'lucide-react';
import { Card } from 'primereact/card'
import { Link, useParams } from 'react-router-dom'

const PluginComponent = () => {
    const { domain } = useParams();
    const { setCurrentDomain, currentDomain } = useUserContext();
    {/* @ts-ignore */ }
    setCurrentDomain(domain)
    return (
        <div className="common-container">
            {/* @ts-ignore */}
            <div className=''>
                <div className="border-b border-gray-200 bg-white  py-2 flex justify-between">
                    {/* @ts-ignore */}
                    <h3 className="text-base font-semibold leading-6 text-gray-900 flex gap-3"> {formatString(domain)} Plugins</h3>
                </div>
                <div className="grids mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                    <Link to={`/${domain}/manage-custom-fields`}>
                        <Card title="Custom Fields" className='p-6 bg-primary-500 text-white hover:bg-light-blue hover:text-primary-500 hover:cursor-pointer' >
                            <p className="m-0 font-medium flex gap-4">
                                <Edit3Icon /> Manage Custom Fields
                            </p>
                        </Card>
                    </Link>
                </div>

            </div>

        </div>
    )
}

export default PluginComponent
