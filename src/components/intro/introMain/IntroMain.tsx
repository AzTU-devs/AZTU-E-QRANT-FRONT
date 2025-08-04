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
                        Azərbaycan Texniki Universiteti (AzTU) elmi-tədqiqat işlərinin və innovasiyaların dəstəklənməsi və inkişafı məqsədilə daxili qrant müsabiqəsi elan edir.
                    </h2>
                    {/* <p
                        style={{
                            fontSize: '0.875rem',
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
                    </p> */}
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl text-primary-900 mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müsabiqənin məqsədi
                    </h2>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            textAlign: "left",
                            color: "rgba(0, 0, 0, 0.6)"
                        }}
                        className="max-w-full sm:max-w-[90%]"
                    >
                        <ul className='list-disc'>
                            <li>AzTU və tərəfdaş institutların (İnformasiya Texnologiyaları İnstitutu və İdarəetmə Sistemləri İnstitutu) sənaye və praktik əhəmiyyətli elmi-tədqiqat işlərinə, ixtiralarına və yeni texnoloji işləmələrinə dəstək vermək;
                            </li>
                            <li>Universitetin elmi-tədqiqat ekosistemini gücləndirmək, innovativ ideyaların reallaşmasına dəstək vermək;
                            </li>
                            <li>Elmi-tədqiqat potensialını yüksəltmək, professor-müəllim heyətinin, doktorant və magistrlərin tədqiqat işlərinə motivasiyasını artırmaq.
                            </li>
                        </ul>
                    </p>

                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mt-8 mb-5"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müsabiqədə kimlər iştirak edə bilər
                    </h2>

                    <div className='flex sm:flex-row justify-between items-start w-full gap-6'>
                        <ul
                            className='list-decimal pl-5 flex justify-between items-center w-full'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.5,
                            }}
                        >
                            <li className='mb-2'>
                                AzTU-nun professor-müəllim heyəti, doktorantları və magistrləri.
                            </li>
                            <li>
                                İnformasiya Texnologiyaları İnstitutu və İdarəetmə Sistemləri İnstitutunun əməkdaşları.
                            </li>
                        </ul>
                    </div>
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müsabiqənin prioritet istiqamətləri
                    </h2>
                    <p style={{
                        fontSize: '0.875rem',
                        textAlign: "left",
                        color: "rgba(0, 0, 0, 0.6)",
                        marginBottom: "10px"
                    }}
                        className="max-w-full sm:max-w-[90%]">
                        Müsabiqə çərçivəsində təqdim edilən layihələr aşağıdakı sahələr üzrə aparılan sənaye, praktik və innovativ elmi-tədqiqat işləri, ixtiralar və yeni texnoloji işləmələrlə bağlı olmalıdır:

                    </p>
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
                            <li className='mb-2'>Rəqəmsal texnologiyaların elmi-nəzəri və tətbiqi problemləri</li>
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
                            <li className='mb-2'>Tətbiqi əhəmiyyətli yeni qurğu və cihaz layihələndirmələri</li>
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
                        Maliyyə vəsaiti və müddət:
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
                            <li className='mb-2'>Hər bir layihə üçün ayrılacaq maliyyənin miqdarı: maksimum 30 000 (otuz min) AZN;</li>
                            <li className='mb-2'> Layihələrin icra müddəti: 6-12 ay;</li>
                            <li className='mb-2'>Qrant müsabiqəsi üçün nəzərdə tutulam ümumi məbləğ: 300 000 (üç yüz min) AZN.</li>
                        </ul>
                    </div>
                </section>

                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Cari müsabiqənin keçirilməsinin əsas prinsipləri
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-6'>
                        <ol
                            className='list-decimal pl-5 sm:w-1/2'
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            <li className='ml-5'>
                                Müsabiqəyə professor-müəllim heyəti, tədqiqatçı-alimlər və gənc tədqiqatçılar müraciət edə bilərlər.
                            </li>
                            <li className='ml-5 list-decimal'>
                                Qrant müsabiqəsi yalnız AzTU, İnformasiya Texnologiyaları İnstitutu və İdarəetmə Sistemləri İnstitutunun alimlərindən təşkil olunmuş elmi yaradıcı kollektivlər tərəfindən təqdim edilmiş layihələr üçün nəzərdə tutulur.

                            </li>
                            <li className='ml-5 list-decimal'>
                                Birgə qrant layihəsi ilə müsabiqədə iştirak etmək istəyən AzTU və institutların alimləri sənədlərin təqdim edilməsindən əvvəl müzakirələr apararaq, qrant layihəsinin mövzusunu, şərtlərini və digər müvafiq məsələləri qarşılıqlı şəkildə razılaşdırmalıdırlar.

                            </li>
                            <li className='ml-5 list-decimal'>
                                Müsabiqəyə alimlərdən təşkil olunmuş kiçik saylı (7 nəfərədək, layihə rəhbəri və icraçılar daxil olmaqla) müvəqqəti yaradıcı kollektivlər tərəfindən həyata keçiriləcək fundamental və tətbiqi xarakterli elmi-tədqiqat layihələri qəbul olunur.

                            </li>
                            <li className='ml-5 list-decimal'>
                                Layihə rəhbəri və icraçılar kifayət qədər təcrübəli, beynəlxalq əlaqələrə malik, nüfuzlu elmi nəşrlərdə dərc olunmuş məqalələri olan alimlər olmalıdır.
                            </li>
                        </ol>
                        <ol
                            className='list-decimal pl-5 sm:w-1/2'
                            start={6}
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "start",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}
                        >
                            <li className='ml-5'>
                                Elmi-tədqiqat qurumlarının planları üzrə mövzunun layihədə təkrarlanmasına yol verilmir.
                            </li>
                            <li className='ml-5 list-decimal'>
                                Digər fond və qurumlar tərəfindən maliyyələşdirilən mövzular üzrə layihələr müsabiqəyə qəbul olunmur.
                            </li>
                            <li className='ml-5 list-decimal'>
                                Cari müsabiqədə hər bir şəxs yalnız bir layihə üzrə qrant iddiaçısı ola bilər (rəhbər və ya icraçı qismində).
                            </li>
                            <li className='ml-5 list-decimal'>
                                Müsabiqəyə təqdim olunmuş layihələr qaydalara uyğun olaraq texniki və elmi ekspertiza mərhələlərindən keçirilir. Bu zaman tərəflərin çarpaz elmi ekspertizası da nəzərdə tutulur.
                            </li>
                            <li className='ml-5 list-decimal'>
                                Qrant layihəsi çərçivəsində elmi məqsədlər üçün tələb olunan əsas vəsaitlər (elmi cihazlar, avadanlıq və qurğular, ləvazimat və qeyri-maddi aktivlər və s.), iş və xidmətlər layihənin ümumi büdcəsinin 30%-dən (vergi və rüsumlar daxil olmaqla), ezamiyyətlər isə 10%-dən artıq ola bilməz.
                            </li>
                        </ol>
                    </div>
                </section>
                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Müraciət qaydası və vaxtı
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-6'>
                        <p
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "left",
                                maxWidth: '100%',
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.6,
                            }}
                            className="max-w-full sm:max-w-[90%]"
                        >
                            Layihə təklifləri <span style={{ fontWeight: 600 }}>30 oktyabr 2025-ci il</span> tarixinədək AzTU-nun rəsmi &nbsp;
                            <a href="http://e-grant.aztu.edu.az/signin" style={{ fontWeight: 600 }}>qrant portalı http://e-grant.aztu.edu.az/</a> &nbsp;
                            vasitəsilə qəbul ediləcək.
                            <br />
                            Müraciətlər yalnız bu portal üzərindən həyata keçiriləcək. Qəbul edilmiş layihələr komissiya tərəfindən qiymətləndirildikdən sonra nəticələr elan olunacaq.
                        </p>
                    </div>
                </section>
                <section className='w-full max-w-6xl px-4 sm:px-0 mt-10'>
                    <h2
                        className="text-center self-center font-medium text-lg sm:text-xl mb-2"
                        style={{ color: "rgb(20, 30, 79)" }}
                    >
                        Əlaqə
                    </h2>
                    <div className='flex flex-col sm:flex-row justify-between items-start gap-6'>
                        <p
                            style={{
                                fontSize: '0.875rem',
                                textAlign: "left",
                                maxWidth: '100%',
                                color: "rgba(0, 0, 0, 0.6)",
                                lineHeight: 1.6,
                            }}
                            className="max-w-full sm:max-w-[90%]"
                        >
                            Əlavə məlumat üçün AzTU Tədqiqat və İnkişaf Departamenti ilə əlaqə saxlaya bilərsiniz: <br />
                            Telefon: <span style={{ fontWeight: 600 }}>(+994 12) 538-33-83</span><br />
                            Email: <a href="mailto:grant@aztu.edu.az"><span style={{ fontWeight: 600 }}>grant@aztu.edu.az</span></a><br />
                            Ünvan: Azərbaycan Texniki Universiteti, Bakı, Azərbaycan<br />
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}