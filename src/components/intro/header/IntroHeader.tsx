import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import AzTULogo from "../../../../public/aztu-logo-light.png";
import GrantLogo from "../../../../public/e-grant-logo-light.png";

export default function IntroHeader() {
    return (
        <header
            className="flex items-center justify-between px-4 py-3 border-b border-black/10 bg-[rgb(20,30,79)]"
        >
            <div className="flex items-center gap-4">
                <a href="https://aztu.edu.az/az" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    <img src={AzTULogo} alt="AzTU" className="w-[100px]" />
                </a>
                <img src={GrantLogo} alt="Grant" className="w-[100px]" />
            </div>

            <Link to={"/signin"}>
                <div className='flex items-center cursor-pointer whitespace-nowrap'>
                    <p className='hidden md:block text-white mr-2'>Daxili qrant müsabiqəsi</p>
                    <LoginIcon style={{ fontSize: 35, color: "#fff" }} />
                </div>
            </Link>
        </header>
    );
}