import { Link } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import AzTULogo from "../../../../public/aztu-logo-light.png";
import GrantLogo from "../../../../public/e-grant-logo-light.png";

export default function IntroHeader() {
    return (
        <header
            className="flex flex-row justify-between items-center flex-wrap gap-4"
            style={{
                borderBottom: "1px solid rgb(0, 0, 0, 0.1)",
                paddingInline: 20,
                paddingBlock: 10,
                backgroundColor: "rgb(20, 30, 79)"
            }}>
            <div className="flex flex-row flex-wrap justify-center items-center gap-4 mb-2">
                <a href="https://aztu.edu.az/az" target="_blank">
                    <img src={AzTULogo} alt="AzTU" className="w-[100px] mr-0 md:mr-[20px] mb-2 md:mb-0" />
                </a>
                <img src={GrantLogo} alt="Grant" className="w-[100px]" />
            </div>
            <div className='flex justify-center items-center'>
                <ul className='flex justify-between items-center'>
                    <li style={{ fontSize: 20, fontWeight: 500, marginInline: 20, color: "#fff", cursor: "pointer" }}>
                        <a href="https://aztu.edu.az/az" target='_blank'>AzTU</a>
                    </li>
                    <li style={{ fontSize: 20, fontWeight: 500, marginInline: 20, color: "#fff", cursor: "pointer" }}>Müsabiqə</li>
                </ul>
            </div>
            <Link to={"/signin"}>
                <div className='flex justify-center items-center cursor-pointer'>
                    <p style={{ color: "#fff", marginRight: 10 }} className='hidden md:block'>Daxili qrant müsabiqəsi</p>
                    <LoginIcon style={{ fontSize: 35, color: "#fff" }} />
                </div>
            </Link>
        </header>
    )
}
