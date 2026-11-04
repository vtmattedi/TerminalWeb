import adventureImage from '../ConsoleAdventure/Game/Assets/Adventure.png'
import adventure2Image from '../ConsoleAdventure/Game/Assets/Adventure2.png'
import classesImage from '../ConsoleAdventure/Game/Assets/Classes.png'
import geniesImage from '../ConsoleAdventure/Game/Assets/Genies.png'
import consoleAdventureLogo from '../ConsoleAdventure/Game/Assets/Logo.png'
import slainImage from '../ConsoleAdventure/Game/Assets/Slain.png'
import slain2Image from '../ConsoleAdventure/Game/Assets/Slain2.png'
import warriorImage from '../ConsoleAdventure/Game/Assets/Warrior.png'

import rtsimReadmeIntro from '../RTSim/image/Readme/1746375077163.png'
import rtsimReadmeScheduler from '../RTSim/image/Readme/1748068650195.png'
import rtsimReadmeTimeline from '../RTSim/image/Readme/1748069926791.png'

import mattediWorksLogo from '../MattediWorks/assets/images/logo.svg'
import mattediWorksLogoWithName from '../MattediWorks/assets/images/logoWithName.svg'
import mattediWorksLogoWhite from '../MattediWorks/assets/images/logo_white.png'
import mattediWorksLoadingLogo from '../MattediWorks/MWLoading/logoWithName.svg'

import sansationBold from '../MattediWorks/assets/fonts/Sansation_Bold.ttf'
import sansationBoldItalic from '../MattediWorks/assets/fonts/Sansation_Bold_Italic.ttf'
import sansationItalic from '../MattediWorks/assets/fonts/Sansation_Italic.ttf'
import sansationLight from '../MattediWorks/assets/fonts/Sansation_Light.ttf'
import sansationLightItalic from '../MattediWorks/assets/fonts/Sansation_Light_Italic.ttf'
import sansationRegular from '../MattediWorks/assets/fonts/Sansation_Regular.ttf'

export const terminalAssets = {
  public: {
    icon: '/mattediworks-icon.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    favicon: '/mattediworks-icon.svg',
    manifest: '/site.webmanifest',
    legacyManifest: '/manifest.json',
    siteManifest: '/site.webmanifest',
  },
  consoleAdventure: {
    logo: consoleAdventureLogo,
    characters: {
      classes: classesImage,
      warrior: warriorImage,
    },
    fallbackScreenshots: [
      adventureImage,
      adventure2Image,
      geniesImage,
      slainImage,
      slain2Image,
    ],
  },
  rtsim: {
    readmeScreenshots: [
      rtsimReadmeIntro,
      rtsimReadmeScheduler,
      rtsimReadmeTimeline,
    ],
  },
  mattediWorks: {
    logo: mattediWorksLogo,
    logoWithName: mattediWorksLogoWithName,
    logoWhite: mattediWorksLogoWhite,
    loadingLogo: mattediWorksLoadingLogo,
    fonts: {
      bold: sansationBold,
      boldItalic: sansationBoldItalic,
      italic: sansationItalic,
      light: sansationLight,
      lightItalic: sansationLightItalic,
      regular: sansationRegular,
    },
  },
}

export const consoleAdventureFallbackImages = terminalAssets.consoleAdventure.fallbackScreenshots
