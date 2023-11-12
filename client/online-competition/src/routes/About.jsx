import '../styles/About.css'

const About = () => {
    return (
        <div className='about'>
            <h1>Rólunk</h1>
            <p className='about-p'>Csapatunk a <strong>DSZC Mechwart András Gépipari és Informatikai Technikum</strong> tanulóiból áll.</p>
            <p className='about-p'>Felkészítő tanárunk <strong>Hagymási Gyula Levente</strong>.</p>

            <div className="cards">
                <div className="card">
                    <h2>Géczi Kornél</h2>
                    <p>Kedvenc érdeklődési köreim legfőbképp a webprogramozás, a foci, a darts, Németország és annak helyei.</p>
                    <p>Szabadidőmben szeretek programozással foglalkozni, valamint szeretek utazni, kirándulni és futni.</p>
                </div>
                <div className="card">
                    <h2>Györfi Marcell</h2>
                    <p>Érdeklődöm az informatika, a tudomány, és a filmek iránt.</p>
                    <p>Szabadidőmben programozok, játszok, vagy gitározok.</p>
                </div>
                <div className="card">
                    <h2>Balogh Tamás</h2>
                    <p>Érdeklődési köröm a programozás, legfőképpen az alacsony szintű nyelveken, mindig is érdekelt mi áll a dolgok hátterében.</p>
                    <p>Szabad időmben leginkább videójátékokkal játszok, vagy pedig a C programozási nyelvet tanulom.</p>
                </div>
            </div>
        </div>
    );
}

export default About;