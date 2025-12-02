import WarningIcon from '@mui/icons-material/Warning';

export default function LockView() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50 flex-col">
            <WarningIcon className="text-yellow-500 text-6xl mb-4" />
            <h1 className="text-2xl font-semibold text-gray-700 text-center">
                Daxili qrant müsabiqəsi başa çatıb.
            </h1>
        </div>
    );
}