import IntroFooter from './footer/IntroFooter';
import IntroHeader from './header/IntroHeader';
import IntroMain from './introMain/IntroMain';

export default function Intro() {
    return (
        <div className="min-h-screen flex flex-col">
            <IntroHeader />
            <IntroMain />
            <IntroFooter />
        </div>
    );
}