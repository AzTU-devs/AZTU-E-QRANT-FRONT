import XIcon from '@mui/icons-material/X';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CopyrightIcon from '@mui/icons-material/Copyright';
import InstagramIcon from '@mui/icons-material/Instagram';
import AzTULogo from "../../../../public/aztu-logo-light.png";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GrantLogo from "../../../../public/e-grant-logo-light.png";

export default function IntroFooter() {
    return (
        <footer className="border-t border-gray-200 flex flex-col justify-center items-center" style={{ backgroundColor: "rgb(29, 42, 108)" }}>
            <div className='w-full flex flex-col lg:flex-row justify-between items-center p-[40px] gap-10'>
                <div className="flex justify-center items-center">
                    <img src={AzTULogo} alt="AzTU" className="w-[150px] mr-[20px]" />
                    <img src={GrantLogo} alt="Grant" className="w-[150px]" />
                </div>
                <div>
                    <div className='flex flex-wrap justify-center items-center mb-[10px]'>
                        <a href="https://x.com/aztueduaz" target="_blank">
                            <XIcon style={{ color: "#fff", marginInline: 10, fontSize: 35 }} />
                        </a>
                        <a href="https://www.linkedin.com/school/aztueduaz/posts/?feedView=all" target="_blank">
                            <LinkedInIcon style={{ color: "#fff", marginInline: 10, fontSize: 35 }} />
                        </a>
                        <a href="https://www.youtube.com/channel/UCu_PoZ-9DKNYs3hxuK9pW1Q" target="_blank">
                            <YouTubeIcon style={{ color: "#fff", marginInline: 10, fontSize: 35 }} />
                        </a>
                        <a href="https://www.instagram.com/aztueduaz" target='_blank'>
                            <InstagramIcon style={{ color: "#fff", marginInline: 10, fontSize: 35 }} />
                        </a>
                        <a href="https://www.facebook.com/aztu1950.official/" target='_blank'>
                            <FacebookIcon style={{ color: "#fff", marginInline: 10, fontSize: 35 }} />
                        </a>
                        <a href="https://t.me/aztu_edu_az" target='_blank'>
                            <TelegramIcon style={{ color: "#fff", marginInline: 10, fontSize: 35 }} />
                        </a>
                    </div>
                    <div className='flex justify-center items-center'>
                        <a href="https://maps.app.goo.gl/uSbCPTZDsVBZZ4n16" className='flex justify-center items-center' target='_blank'>
                            <LocationOnIcon style={{ color: "#fff" }} />
                            <p className='text-white'>
                                <span style={{ fontWeight: 600, marginRight: 5 }}>Ünvan:</span>
                                H.Cavid prospekti 25, Baku, Azərbaycan AZ 1073 Azərbaycan Texniki Universiteti.
                            </p>
                        </a>
                    </div>
                </div>
                <div className='flex flex-col sm:flex-col sm:justify-center items-start gap-4'>
                    <a href="tel:+994125391305" className='flex justify-center items-center mb-[10px]'>
                        <PhoneIcon style={{ color: "#fff", marginRight: 10 }} />
                        <p className='text-white'>AzTU qaynar xətt: (+994 12) 539-13-05</p>
                    </a>
                    <a href="tel:+994125383383" className='flex justify-center items-center mb-[10px]'>
                        <PhoneIcon style={{ color: "#fff", marginRight: 10 }} />
                        <p className='text-white'>Qrant müsabiqəsi qaynar xətt: (+994 12) 538-33-83</p>
                    </a>
                    <a href="mailto:aztu@aztu.edu.az" className='flex justify-center items-center mb-[10px]'>
                        <MailIcon style={{ color: "#fff", marginRight: 10 }} />
                        <p className='text-white' style={{ fontSize: 15, fontWeight: 400 }} >AzTU E-poçt: aztu@aztu.edu.az</p>
                    </a>
                    <a href="mailto:qrant@aztu.edu.az" className='flex justify-center items-center'>
                        <MailIcon style={{ color: "#fff", marginRight: 10 }} />
                        <p className='text-white' style={{ fontSize: 15, fontWeight: 400 }} >Daxili Qrant E-poçt: qrant@aztu.edu.az</p>
                    </a>
                </div>
            </div>
            <div className='w-[90%] flex justify-center items-center' style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                padding: 40
            }}>
                <CopyrightIcon style={{ color: "#fff", marginRight: 10 }} />
                <p style={{ color: "#fff" }}>Azərbaycan Texniki Universiteti Daxili Qrant Müsabiqəsi. Bütün hüquqlar qorunur.</p>
            </div>
        </footer>
    )
}
