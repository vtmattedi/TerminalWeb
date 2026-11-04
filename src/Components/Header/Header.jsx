import { useEffect, useState } from 'react';
import './Header.css';
import { terminalAssets } from '../../assets/terminalAssets';

const brandLogo = terminalAssets.mattediWorks.logo;
const Header = ({ title }) => {

    const [mouseHover, setMouseHover] = useState(false);
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);
    const onMouseEnter = () => {
        setMouseHover(true);
    }
    const onMouseLeave = () => {
        setMouseHover(false);
    }

    const isCompact = width < 1040;
    const headerClassName = [
        'm_headerDiv',
        isCompact && mouseHover ? 'm_headerDiv--stacked' : '',
    ].filter(Boolean).join(' ');

    const imageContainerClassName = [
        'm_img_c',
        mouseHover ? 'm_img_c--hidden' : '',
    ].filter(Boolean).join(' ');

    const cardClassName = [
        'm_card',
        mouseHover ? 'm_card--visible' : '',
        isCompact ? 'm_card--centered' : '',
    ].filter(Boolean).join(' ');

    return (
        <div className={headerClassName}>
            <div className={imageContainerClassName} onMouseEnter={onMouseEnter}>
                <img src={brandLogo} className="m_image" alt="MattediWorks logo" />
            </div>
            <div className={cardClassName}
                onMouseLeave={onMouseLeave} >
                <img src={brandLogo} className="m_image" alt="MattediWorks logo" />
                <span className='m_cardText'>
                    MattediWorks
                </span>
            </div>
            <div className='m_titleDiv'>
                <h1 className='m_title'>
                    {title}
                </h1>
            </div>
        </div>
    );
};

export default Header;
