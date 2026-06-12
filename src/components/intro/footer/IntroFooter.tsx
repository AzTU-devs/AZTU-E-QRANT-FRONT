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
        <footer className="bg-[rgb(20,30,79)] text-white border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="flex flex-col items-start gap-4 col-span-1 md:col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-4">
                            <img src={AzTULogo} alt="AzTU" className="h-12 w-auto" />
                            <img src={GrantLogo} alt="Grant" className="h-12 w-auto" />
                        </div>
                        <p className="text-brand-100/70 text-sm leading-relaxed max-w-xs">
                            Azərbaycan Texniki Universiteti elmi potensialın inkişafı və innovativ tədqiqatların dəstəklənməsi üçün daxili qrant müsabiqələri təşkil edir.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: <FacebookIcon />, href: "https://www.facebook.com/aztu1950.official/" },
                                { icon: <InstagramIcon />, href: "https://www.instagram.com/aztueduaz" },
                                { icon: <LinkedInIcon />, href: "https://www.linkedin.com/school/aztueduaz/" },
                                { icon: <YouTubeIcon />, href: "https://www.youtube.com/channel/UCu_PoZ-9DKNYs3hxuK9pW1Q" },
                                { icon: <TelegramIcon />, href: "https://t.me/aztu_edu_az" },
                                { icon: <XIcon />, href: "https://x.com/aztueduaz" },
                            ].map((social, i) => (
                                <a key={i} href={social.href} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links / Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 border-b border-white/10 pb-2 inline-block">Məlumat</h4>
                        <ul className="space-y-4 text-sm text-brand-100/70">
                            <li><a href="#" className="hover:text-white transition-colors">Qaydalar və Şərtlər</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tez-tez verilən suallar</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Təlimatlar</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Nəticələr</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="text-lg font-bold mb-4 border-b border-white/10 pb-2 inline-block">Əlaqə</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <a href="https://maps.app.goo.gl/uSbCPTZDsVBZZ4n16" target="_blank" className="flex items-start gap-3 group">
                                    <LocationOnIcon className="text-brand-400 mt-1" />
                                    <span className="text-sm text-brand-100/70 group-hover:text-white transition-colors leading-relaxed">
                                        H.Cavid prospekti 25, Bakı, Azərbaycan AZ 1073
                                    </span>
                                </a>
                                <a href="tel:+994125391305" className="flex items-center gap-3 group">
                                    <PhoneIcon className="text-brand-400" />
                                    <span className="text-sm text-brand-100/70 group-hover:text-white transition-colors">
                                        AzTU: (+994 12) 539-13-05
                                    </span>
                                </a>
                                <a href="tel:+994125383383" className="flex items-center gap-3 group">
                                    <PhoneIcon className="text-brand-400" />
                                    <span className="text-sm text-brand-100/70 group-hover:text-white transition-colors">
                                        Qrant: (+994 12) 538-33-83
                                    </span>
                                </a>
                            </div>
                            <div className="space-y-4">
                                <a href="mailto:aztu@aztu.edu.az" className="flex items-center gap-3 group">
                                    <MailIcon className="text-brand-400" />
                                    <span className="text-sm text-brand-100/70 group-hover:text-white transition-colors">
                                        aztu@aztu.edu.az
                                    </span>
                                </a>
                                <a href="mailto:qrant@aztu.edu.az" className="flex items-center gap-3 group">
                                    <MailIcon className="text-brand-400" />
                                    <span className="text-sm text-brand-100/70 group-hover:text-white transition-colors">
                                        qrant@aztu.edu.az
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-100/50">
                    <div className="flex items-center gap-2">
                        <CopyrightIcon sx={{ fontSize: 16 }} />
                        <p>Azərbaycan Texniki Universiteti. Bütün hüquqlar qorunur.</p>
                    </div>
                    <p>Designed with excellence by AzTU</p>
                </div>
            </div>
        </footer>
    )
}

