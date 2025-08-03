import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';

export default function IntroMain() {
    const text = 'Azərbaycan Texniki Universiteti (AzTU) daxili qrant müsabiqəsi elan edir';
    const letters = text.split('');

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.01, delayChildren: 0.01 * i },
        }),
    };

    const child: Variants = {
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
        <>
            <main className='w-full px-4 sm:px-8 md:px-16 lg:px-20 py-8 flex flex-col justify-center items-center'>
                <section className='w-full max-w-6xl flex flex-col justify-start items-center px-4 sm:px-0'>
                    <h1
                        style={{
                            fontSize: '1.875rem', // 30px
                            color: "rgb(20, 30, 79)",
                            marginBottom: 30,
                        }}
                        className="flex justify-center items-center text-center self-center"
                    >
                        <motion.div
                            style={{ display: 'flex', fontSize: '2rem', fontWeight: 'bold' }}
                            variants={container}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-wrap justify-center"
                        >
                            {letters.map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={child}
                                    aria-hidden={char === ' '}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </h1>
                    <h2
                        className="text-center self-center text-lg sm:text-xl font-medium"
                        style={{
                            color: "rgb(20, 30, 79)",
                            marginBottom: 10
                        }}
                    >
                        Azərbaycan Texniki Universiteti (AzTU) elmi-tədqiqat işlərinin və innovasiyaların dəstəklənməsi və inkişafı  üçün qrant müsabiqəsi elan edir.
                    </h2>
                    <p
                        style={{
                            fontSize: '0.875rem', // 14px
                            textAlign: "left",
                            maxWidth: '100%',
                            color: "rgba(0, 0, 0, 0.6)",
                            lineHeight: 1.6,
                        }}
                        className="max-w-full sm:max-w-[90%]"
                    >
                        Qrant müsabiqəsi çərçivəsində AzTU-da çalışan professor-müəllim heyətinin, doktorantlar və magistrlər
                        elmi-tədqiqat layihələri qəbul olunur. Qrant müsabiqəsi AzTU-da aparılan sənaye və praktik əhəmiyyətli
                        elmi-tədqiqat işlərinin, ixtiraların və yeni texnoloji işləmələrin sayını artırmaq üçün nəzərdə tutulub.
                        Qrant müsabiqəsində əsas məqsəd AzTU-nun daxili imkanları hesabına müsabiqə əsasında ayrılan maliyyə vəsaiti
                        hesabına tədqiqat ekosisteminin formalaşdırılması elmi səviyyəni yüksəltmək və yeganə meyar olan tədqiqatın
                        elmi əhəmiyyətini rəhbər tutaraq alimlərin özləri tərəfindən təklif olunan mövzular üzrə tədqiqatları dəstəkləməkdir.
                        Layihələrin maliyyə həcmi maksimum dəyəri 30000 (otuz min) AZN-dək və icra müddəti 6 - 12 ay qədərdir.
                    </p>
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl text-primary-900 mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müsabiqədə kimlər iştirak edə bilər:
                    </h2>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            textAlign: "left",
                            color: "rgba(0, 0, 0, 0.6)"
                        }}
                        className="max-w-full sm:max-w-[90%]"
                    >
                        Müsabiqədə yalnız AzTU-da çalışan əməkdaşlar, doktorantlar və magistrlərdən ibarət maksimum&nbsp;
                        <span className="font-bold">7</span>&nbsp;
                        nəfər müvəqqəti işçi qrup şəklində iştirak edə bilərlər.
                        Hər bir iştirakçı layihə rəhbəri tərəfindən layihə sistemə təqdim edildikdən sonra sistemə&nbsp;
                        <Link to={"/signin"}>
                            <span className="font-bold underline">daxil</span>&nbsp;
                        </Link>
                        olaraq “icraçı (layihə komandasının üzvü)” kimi sorğu göndərməlidir. Sorğusu təsdiqlənməyən şəxslər layihədə iştirak edə bilməzlər.
                    </p>

                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mt-8 mb-5"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müraciət üçün son tarix:
                    </h2>

                    <div className='flex flex-col sm:flex-row justify-center items-start w-full gap-6'>
                        <ul
                            className='list-decimal pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>
                                Layihə təkliflərin təqdim olunması üçün son tarix <span className="font-bold">30.10.2025</span>-ci il.
                            </li>
                            <li>
                                Layihə təklifləri <span className="font-bold">AzTU</span>-nun saytında elan olunan&nbsp;
                                <Link to={"/signin"}>
                                    <span className="font-bold underline cursor-pointer">elektron platforma</span>
                                </Link>
                                &nbsp; üzərindən qəbul edilir.
                            </li>
                        </ul>
                        <ul
                            className='list-disc pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>
                                Layihə təklifi forması və əlavələr (formalar) electron platformada daxil edilməklə
                                bərabər elektron formada (pdf formatda) &nbsp;<span className="font-bold">qrant@aztu.edu.az</span>&nbsp;elektron-poçt ünvanına göndərməlidir.
                            </li>
                            <li>
                                Bütün layihələr, bir qayda olaraq&nbsp;<span className="font-bold">2</span>&nbsp;
                                nüsxədə,&nbsp;<span className="font-bold">Azərbaycan dilində</span>&nbsp;,&nbsp;
                                <span className="font-bold">&nbsp;elektron formada</span> (PDF formatda) təqdim edilməlidir.
                            </li>
                        </ul>
                    </div>
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Layihə təkliifləri aşağıdakı prioritet istiqamətlərə uyğun olmalıdır:
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-6'>
                        <ol
                            className='list-decimal pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>Rəqəmsal texnologiylaraın sahələr üzrə tətbiqi;</li>
                            <li className='mb-2'>Müdafiə sənayesi təyinatlı texnoloji işləmələr</li>
                            <li className='mb-2'>Yeni materiallar və texnologiyalar</li>
                        </ol>
                        <ol
                            className='list-decimal pl-5 sm:w-1/2'
                            start={4}
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>Yaşıl enerji, ətraf mühit və davamlı inkişaf məsələləri</li>
                            <li className='mb-2'>Tətbiqi əhəmiyyətli, yeni qurğu, cihaz layihələndirmələri</li>
                        </ol>
                    </div>
                    <p
                        className="italic font-medium mt-3 text-center"
                        style={{ width: '100%' }}
                    >
                        Hər bir prioritet istiqamət üzrə minimum bir layihənin qalib olması nəzərdə tutulur.
                    </p>
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müsabiqəyə təqdim olunan layihələr aşağıdakı tələblərə cavab verməlidir:
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-6'>
                        <ul
                            className='list-disc pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>Layihə sənədlərinin (ərizə, layihə təklifi, xərclər smetası, icra planı) tələb olunan formalara uyğunluğu;</li>
                            <li className='mb-2'>Layihədə təklif olunan işlər hər hansı qrant və digər mənbələrdən maliyyələşdirilən layihələrin predmeti olmamalıdır;</li>
                            <li className='mb-2'>Layihə büdcəsinin&nbsp;<span className="font-bold">30 000 AZN</span>-dən çox olmaması;</li>
                        </ul>
                        <ul
                            className='list-disc pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>Hər bir iddiaçı müsabiqədə yalnız&nbsp;<span className="font-bold">bir</span>&nbsp;layihədə iştirakçısı ola bilər;</li>
                            <li className='mb-2'>İştirakçıların daha əvvəl icra etdikləri layihələrin səmərəliliyi;</li>
                        </ul>
                    </div>
                    <p
                        className="italic font-medium mt-3 text-center"
                        style={{ width: "100%" }}
                    >
                        Müsabiqənin nəticələri elan olunan tarixdən&nbsp;<span className="font-bold">2 ay</span>&nbsp;sonra açıqlanacaqdır;
                    </p>
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        AZTU daxili qrantını almaq məqsədilə müsabiqədə iştirak üçün&nbsp;
                        <span className="font-bold underline">
                            <Link to={"/signin"}>
                                ƏRİZƏ
                            </Link>
                        </span>&nbsp;ilə müraciət olunur.
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-6'>
                        <ul
                            className='list-disc pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            <li className='mb-2 font-bold'>
                                Ərizədə aşağıdakı məlumatlar əks olunmalıdır:
                            </li>
                            <li className='ml-5 list-disc'>
                                layihənin elmi istiqaməti və qarşıya qoyulan problem üzrə qısa icmal;
                            </li>
                            <li className='ml-5 list-disc'>
                                layihənin məqsədi, qarşıya qoyulan məsələləri, aktuallığının əsaslandırılması;
                            </li>
                            <li className='ml-5 list-disc'>
                                layihənin məzmununu tam əks etdirən açar sözlər;
                            </li>
                            <li className='ml-5 list-disc'>
                                layihənin elmi ideyası;
                            </li>
                            <li className='ml-5 list-disc'>
                                layihədən gözlənilən nəticələr, onların elmi və təcrübi əhəmiyyəti.
                            </li>
                        </ul>
                        <ul
                            className='list-disc pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            <li className='mb-2 font-bold'>
                                Ərizəyə aşağıdakı sənədlər əlavə olunur:
                            </li>
                            <li className='ml-5 list-disc'>
                                layihə üzrə tədqiqatın detallı təqvim planı;
                            </li>
                            <li className='ml-5 list-disc'>
                                iddiaçılar haqqında ətraflı məlumat;
                            </li>
                            <li className='ml-5 list-disc'>
                                qrant layihəsi üzrə xərclərin əsaslandırılmış smetası.
                            </li>
                        </ul>
                    </div>
                </section>
            </main>
        </>
    );
}