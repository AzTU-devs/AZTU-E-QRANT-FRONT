import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import AzTULogo from "../../../../public/aztu-logo-light.png";
import GrantLogo from "../../../../public/e-grant-logo-light.png";

export default function IntroHeader() {
    return (
        <header
            className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[rgb(20,30,79)]/95 shadow-sm border-b border-white/10"
        >
            <div className="flex items-center gap-6">
                <a href="https://aztu.edu.az/az" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 transition-transform hover:scale-105">
                    <img src={AzTULogo} alt="AzTU" className="h-10 md:h-12 w-auto object-contain" />
                </a>
                <div className="h-8 w-[1px] bg-white/20 hidden sm:block"></div>
                <img src={GrantLogo} alt="Grant" className="h-10 md:h-12 w-auto object-contain hidden sm:block" />
            </div>

            <Link to={"/signin"} className="group">
                <div className='flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10'>
                    <p className='hidden md:block text-white font-medium'>Daxili qrant portalı</p>
                    <LoginIcon className="text-white transition-transform group-hover:translate-x-1" sx={{ fontSize: 24 }} />
                </div>
            </Link>
        </header>
    );
}