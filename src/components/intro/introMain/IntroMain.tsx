import { motion, Variants } from 'framer-motion';
import TargetIcon from '@mui/icons-material/AdsClick';
import PeopleIcon from '@mui/icons-material/Groups';
import StarIcon from '@mui/icons-material/Star';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
    },
};

export default function IntroMain() {
    const text = 'Azərbaycan Texniki Universiteti (AzTU) daxili qrant müsabiqəsi elan edir';
    const letters = text.split('');

    const titleContainer: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.02 * i },
        }),
    };

    const letterVariants: Variants = {
        hidden: {
            y: 20,
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 10,
                stiffness: 150,
            },
        },
    };

    return (
        <main className="w-full bg-gray-50/50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[rgb(20,30,79)] py-20 px-4 sm:px-5 md:px-16 lg:px-20 text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-400 blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-600 blur-[120px]"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        variants={titleContainer}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center text-3xl md:text-5xl font-bold mb-5 tracking-tight"
                    >
                        {letters.map((char, index) => (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                aria-hidden={char === ' '}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="text-lg md:text-xl text-brand-100 max-w-3xl mb-10 leading-relaxed"
                    >
                        Azərbaycan Texniki Universiteti (AzTU) elmi-tədqiqat işlərinin və innovasiyaların dəstəklənməsi və inkişafı məqsədilə daxili qrant müsabiqəsi elan edir.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.8 }}
                    >
                        <a
                            href="/signin"
                            className="inline-flex items-center gap-2 bg-white text-[rgb(20,30,79)] px-5 py-4 rounded-full font-bold text-lg transition-all hover:bg-brand-50 hover:scale-105 shadow-xl"
                        >
                            İndi müraciət et <ArrowForwardIcon />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Info Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-7xl mx-auto px-4 sm:px-5 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
                {/* Purpose Card */}
                <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-brand-100 text-[rgb(20,30,79)] rounded-xl flex items-center justify-center mb-4">
                        <TargetIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[rgb(20,30,79)] mb-4">Müsabiqənin məqsədi</h3>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li className="flex gap-2">
                            <span className="text-brand-500">•</span>
                            AzTU və tərəfdaş institutların sənaye və praktik əhəmiyyətli işlərinə dəstək vermək
                        </li>
                        <li className="flex gap-2">
                            <span className="text-brand-500">•</span>
                            Elmi-tədqiqat ekosistemini gücləndirmək və innovativ ideyaları reallaşdırmaq
                        </li>
                        <li className="flex gap-2">
                            <span className="text-brand-500">•</span>
                            Tədqiqatçıların motivasiyasını və elmi potensialını yüksəltmək
                        </li>
                    </ul>
                </motion.div>

                {/* Eligibility Card */}
                <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-brand-100 text-brand-700 rounded-xl flex items-center justify-center mb-4">
                        <PeopleIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[rgb(20,30,79)] mb-4">Kimlər iştirak edə bilər?</h3>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li className="flex gap-2">
                            <span className="text-brand-500">•</span>
                            AzTU-nun professor-müəllim heyəti, doktorantları və magistrləri
                        </li>
                        <li className="flex gap-2">
                            <span className="text-brand-500">•</span>
                            İnformasiya Texnologiyaları və İdarəetmə Sistemləri İnstitutunun əməkdaşları
                        </li>
                    </ul>
                </motion.div>

                {/* Priorities Card */}
                <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mb-4">
                        <StarIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[rgb(20,30,79)] mb-4">Prioritet istiqamətlər</h3>
                    <ul className="space-y-2 text-gray-600 text-sm">
                        <li>1. Rəqəmsal texnologiyalar</li>
                        <li>2. Müdafiə sənayesi işləmələri</li>
                        <li>3. Yeni materiallar</li>
                        <li>4. Yaşıl enerji və ətraf mühit</li>
                        <li>5. Yeni qurğu və cihaz layihələndirmələri</li>
                    </ul>
                </motion.div>

                {/* Budget Card */}
                <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 bg-green-100 text-green-700 rounded-xl flex items-center justify-center mb-4">
                            <AccountBalanceWalletIcon />
                        </div>
                        <h3 className="text-xl font-bold text-[rgb(20,30,79)] mb-4">Maliyyə və Müddət</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">Büdcə</span>
                                <span className="text-gray-700 font-medium">Maks. 30,000 AZN / layihə</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold">Müddət</span>
                                <span className="text-gray-700 font-medium">6 - 12 ay</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-xs text-gray-400 italic">Ümumi fond: 300,000 AZN</p>
                </motion.div>

                {/* Principles Card */}
                <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-2">
                    <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-xl flex items-center justify-center mb-4">
                        <ListAltIcon />
                    </div>
                    <h3 className="text-xl font-bold text-[rgb(20,30,79)] mb-4">Əsas Prinsiplər</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-gray-600 text-sm">
                        <p>• Kiçik yaradıcı kollektivlər (maks. 7 nəfər)</p>
                        <p>• Təcrübəli və beynəlxalq nüfuzlu rəhbərlər</p>
                        <p>• Digər fondlar tərəfindən maliyyələşməyən mövzular</p>
                        <p>• Texniki və elmi ekspertiza mərhələləri</p>
                        <p>• Hər şəxs üçün yalnız bir layihə</p>
                        <p>• Şəffaf və çarpaz elmi qiymətləndirmə</p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Application Section */}
            <section className="bg-gray-100 py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-block p-3 bg-brand-100 text-[rgb(20,30,79)] rounded-full mb-4">
                        <AppRegistrationIcon fontSize="large" />
                    </div>
                    <h2 className="text-3xl font-bold text-[rgb(20,30,79)] mb-4">Müraciət qaydası və vaxtı</h2>
                    <p className="text-gray-600 mb-5 leading-relaxed">
                        Layihə təklifləri <span className="font-bold text-gray-900">30 oktyabr 2025-ci il</span> tarixinədək AzTU-nun rəsmi qrant portalı vasitəsilə qəbul ediləcək.
                    </p>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 inline-block">
                        <a href="http://e-grant.aztu.edu.az/signin" className="text-xl font-semibold text-[rgb(20,30,79)] hover:underline">
                            e-grant.aztu.edu.az
                        </a>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2">
                        <h2 className="text-3xl font-bold text-[rgb(20,30,79)] mb-4 flex items-center gap-3">
                            <ContactSupportIcon fontSize="large" /> Əlaqə
                        </h2>
                        <p className="text-gray-600 mb-5">
                            Əlavə məlumat üçün AzTU Tədqiqat və İnkişaf Departamenti ilə əlaqə saxlaya bilərsiniz.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[rgb(20,30,79)]">
                                    <ScheduleIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">İş vaxtı</p>
                                    <p className="text-gray-700">09:00 - 18:00</p>
                                </div>
                            </div>
                            <a href="tel:+994125383383" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[rgb(20,30,79)] transition-colors group-hover:bg-[rgb(20,30,79)] group-hover:text-white">
                                    <PhoneIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Telefon</p>
                                    <p className="text-gray-700 font-semibold group-hover:text-[rgb(20,30,79)] transition-colors">(+994 12) 538-33-83</p>
                                </div>
                            </a>
                            <a href="mailto:grant@aztu.edu.az" className="flex items-center gap-4 group">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[rgb(20,30,79)] transition-colors group-hover:bg-[rgb(20,30,79)] group-hover:text-white">
                                    <EmailIcon />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">E-poçt</p>
                                    <p className="text-gray-700 font-semibold group-hover:text-[rgb(20,30,79)] transition-colors">grant@aztu.edu.az</p>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="md:w-1/2 bg-[rgb(20,30,79)] text-white p-10 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-white/5 blur-3xl"></div>
                        <h3 className="text-2xl font-bold mb-4">Sualınız var?</h3>
                        <p className="text-brand-100 mb-5 leading-relaxed">
                            Bütün suallarınızı elektron poçt ünvanımıza göndərə bilərsiniz. Komandamız operativ şəkildə cavablandıracaqdır.
                        </p>
                        <a href="mailto:grant@aztu.edu.az" className="inline-block bg-white text-[rgb(20,30,79)] px-4 py-3 rounded-xl font-bold transition-transform hover:scale-105 shadow-lg">
                            Məktub yazın
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
