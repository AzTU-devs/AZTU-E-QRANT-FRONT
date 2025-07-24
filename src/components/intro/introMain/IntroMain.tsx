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
            <main className='flex-1 p-[30px] flex flex-col justify-start items-center'>
                <section className='flex flex-col justify-center items-center'>
                    <h1
                        style={{
                            fontSize: 30,
                            color: "rgb(20, 30, 79)",
                            marginBottom: 30
                        }}
                        className="flex justify-center items-center"
                    >
                        <motion.div
                            style={{ display: 'flex', fontSize: '2rem', fontWeight: 'bold' }}
                            variants={container}
                            initial="hidden"
                            animate="visible"
                        >
                            {letters.map((char, index) => (
                                <motion.span key={index} variants={child}>
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </h1>
                    <h2 style={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "rgb(20, 30, 79)",
                        marginBottom: 10
                    }}>
                        Azərbaycan Texniki Universiteti (AzTU) elmi-tədqiqat işlərinin və innovasiyaların dəstəklənməsi və inkişafı  üçün qrant müsabiqəsi elan edir.
                    </h2>
                    <p style={{
                        fontSize: 15,
                        textAlign: "center",
                        width: "90%",
                        color: "rgba(0, 0, 0, 0.6)"
                    }}>
                        Qrant müsabiqəsi çərçivəsində AzTU-da çalışan professor-müəllim heyətinin, doktorantlar və magistrlər
                        elmi-tədqiqat layihələri qəbul olunur. Qrant müsabiqəsi AzTU-da aparılan sənaye və praktik əhəmiyyətli
                        elmi-tədqiqat işlərinin, ixtiraların və yeni texnoloji işləmələrin sayını artırmaq üçün nəzərdə tutulub.
                        Qrant müsabiqəsində əsas məqsəd AzTU-nun daxili imkanları hesabına müsabiqə əsasında ayrılan maliyyə vəsaiti
                        hesabına tədqiqat ekosisteminin formalaşdırılması elmi səviyyəni yüksəltmək və yeganə meyar olan tədqiqatın
                        elmi əhəmiyyətini rəhbər tutaraq alimlərin özləri tərəfindən təklif olunan mövzular üzrə tədqiqatları dəstəkləməkdir.
                        Layihələrin maliyyə həcmi maksimum dəyəri 30000 (iyirmi min) AZN-dək və icra müddəti 6 - 12 ay qədərdir.
                    </p>
                </section>
                <section className='flex flex-col items-center justify-center' style={{ width: "90%" }}>
                    <h2 style={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "rgb(20, 30, 79)",
                        marginBottom: 10,
                        marginTop: 20
                    }}>
                        Müsabiqədə kimlər iştirak edə bilər:
                    </h2>
                    <p style={{
                        fontSize: 15,
                        textAlign: "center",
                        width: "90%",
                        color: "rgba(0, 0, 0, 0.6)"
                    }}>
                        Müsabiqədə yalnız AzTU-da çalışan əməkdaşlar, doktorantlar və magistrlərdən ibarət maksimum
                        &nbsp; <span style={{ fontWeight: 700 }}>7</span> &nbsp;
                        nəfər müvəqqəti işçi qrup şəklində iştirak edə bilərlər.
                    </p>
                    <h2 style={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "rgb(20, 30, 79)",
                        marginBottom: 10,
                        marginTop: 20
                    }}>
                        Müraciət üçün son tarix:
                    </h2>
                    <div className='flex justify-center items-center'>
                        <ul
                            className='flex flex-col justify-start items-start'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Layihə təkliflərin təqdim olunması üçün son tarix <span style={{ fontWeight: 700 }}>30.09.2025</span>-ci il.
                            </li>
                            <li style={{ maxWidth: "80%" }}>
                                Layihə təklifləri <span style={{ fontWeight: 700 }}>AzTU</span>-nun saytında elan olunan &nbsp;
                                <Link to={"/"}>
                                    <span style={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>elektron platforma</span>
                                </Link>
                                &nbsp; üzərindən qəbul edilir.
                            </li>
                        </ul>
                        <ul
                            className='flex flex-col justify-center items-end'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Layihə təklifi forması və əlavələr (formalar) electron platformada daxil edilməklə
                                bərabər elektron formada (pdf formatda) &nbsp;<span style={{ fontWeight: 700 }}>qrant@aztu.edu.az</span>&nbsp;elektron-poçt ünvanına göndərməlidir.
                            </li>
                            <li style={{ maxWidth: "80%" }}>
                                Bütün layihələr, bir qayda olaraq&nbsp;<span style={{ fontWeight: 700 }}>2</span>&nbsp;
                                nüsxədə,&nbsp;<span style={{ fontWeight: 700 }}>Azərbaycan dilində</span>&nbsp;,&nbsp;
                                <span style={{ fontWeight: 700 }}>&nbsp;elektron formada</span> (PDF formatda) təqdim edilməlidir.
                            </li>
                        </ul>
                    </div>
                </section>
                <section className='flex flex-col items-center justify-center' style={{ width: "90%" }}>
                    <h2 style={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "rgb(20, 30, 79)",
                        marginBottom: 10,
                        marginTop: 20
                    }}>
                        Layihə təkliifləri aşağıdakı prioritet istiqamətlərə uyğun olmalıdır:
                    </h2>
                    <div className='flex justify-center items-center'>
                        <ol
                            className='flex flex-col justify-start items-start list-decimal'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Rəqəmsal texnologiylaraın sahələr üzrə tətbiqi;
                            </li>
                            <li style={{ maxWidth: "80%" }}>
                                Müdafiə sənayesi təyinatlı texnoloji işləmələr
                            </li>
                            <li style={{ maxWidth: "80%" }}>
                                Yeni materiallar və texnologiyalar
                            </li>
                        </ol>
                        <ol
                            className='flex flex-col justify-center items-end list-decimal'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}
                            start={4}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Yaşıl enerji, ətraf mühit və davamlı inkişaf məsələləri
                            </li>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Tətbiqi əhəmiyyətli, yeni qurğu, cihaz layihələndirmələri
                            </li>
                        </ol>
                    </div>
                    <p style={{
                        fontStyle: "italic",
                        fontWeight: 500,
                        marginTop: 10
                    }}>
                        Hər bir prioritet istiqamət üzrə bir layihənin qalib olması nəzərdə tulur.
                    </p>
                </section>
                <section className='flex flex-col items-center justify-center' style={{ width: "90%" }}>
                    <h2 style={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "rgb(20, 30, 79)",
                        marginBottom: 10,
                        marginTop: 20
                    }}>
                        Müsabiqəyə təqdim olunan layihələr aşağıdakı tələblərə cavab verməlidir:
                    </h2>
                    <div className='flex justify-center items-center'>
                        <ul
                            className='flex flex-col justify-start items-start list-disc'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Layihə sənədlərinin (ərizə, layihə təklifi, xərclər smetası, icra planı) tələb olunan formalara uyğunluğu;
                            </li>
                            <li style={{ maxWidth: "80%" }}>
                                Layihədə təklif olunan işlər hər hansı qrant və digər mənbələrdən maliyyələşdirilən layihələrin predmeti olmamalıdır;
                            </li>
                            <li style={{ maxWidth: "80%" }}>
                                Layihə büdcəsinin&nbsp;<span style={{ fontWeight: 700 }}>30 000 AZN</span>-dən çox olmaması;
                            </li>
                        </ul>
                        <ul
                            className='flex flex-col justify-end items-end list-disc'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                Hər bir iddiaçı müsabiqədə yalnız&nbsp;<span style={{ fontWeight: 700 }}>bir</span>&nbsp;layihədə iştirakçısı ola bilər;
                            </li>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                İştirakçıların daha əvvəl icra etdikləri layihələrin səmərəliliyi;
                            </li>
                        </ul>
                    </div>
                    <p style={{
                        fontStyle: "italic",
                        fontWeight: 500,
                        marginTop: 10
                    }}>
                        Müsabiqənin nəticələri elan olunan tarixdən&nbsp;<span style={{ fontWeight: 700 }}>2 ay</span>&nbsp;sonra açıqlanacaqdır;
                    </p>
                </section>
                <section className='flex flex-col items-center justify-center' style={{ width: "90%" }}>
                    <h2 style={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "rgb(20, 30, 79)",
                        marginBottom: 10,
                        marginTop: 20
                    }}>
                        AZTU daxili qrantını almaq məqsədilə müsabiqədə iştirak üçün&nbsp;<span style={{ fontWeight: 700 }}>ƏRİZƏ</span>&nbsp;ilə müraciət olunur.
                    </h2>
                    <div className='flex justify-center items-start'>
                        <ul
                            className='flex flex-col justify-start items-start list-disc'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%", marginBottom: 5 }}>
                                <span style={{ fontWeight: 700 }}>Ərizədə aşağıdakı məlumatlar əks olunmalıdır:</span>
                                <ul className='ml-[20px] list-disc'>
                                    <li>layihənin elmi istiqaməti və qarşıya qoyulan problem üzrə qısa icmal;</li>
                                    <li>layihənin məqsədi, qarşıya qoyulan məsələləri, aktuallığının əsaslandırılması;</li>
                                    <li>layihənin məzmununu tam əks etdirən açar sözlər;</li>
                                    <li>layihənin elmi ideyası;</li>
                                    <li>layihədən gözlənilən nəticələr, onların elmi və təcrübi əhəmiyyəti.</li>
                                </ul>
                            </li>
                        </ul>
                        <ul
                            className='flex flex-col justify-end items-end list-disc'
                            style={{
                                fontSize: 15,
                                textAlign: "start",
                                width: "90%",
                                color: "rgba(0, 0, 0, 0.6)",
                            }}>
                            <li style={{ maxWidth: "80%" }}>
                                <span style={{ fontWeight: 700 }}>Ərizəyə aşağıdakı sənədlər əlavə olunur:</span>
                                <ul className='ml-[20px] list-disc'>
                                    <li>layihə üzrə tədqiqatın detallı təqvim planı;</li>
                                    <li>iddiaçılar haqqında ətraflı məlumat;</li>
                                    <li>qrant layihəsi üzrə xərclərin əsaslandırılmış smetası.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </section>
            </main>
        </>
    )
}
