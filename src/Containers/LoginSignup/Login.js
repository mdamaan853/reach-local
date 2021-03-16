import React from 'react';
import LoginPage from './LoginSignup';
import utils from '../../Services/utility-service';
import { YoutubeVideo } from '../../Components/Youtube/YouTubeVideo';
import './LoginSignup.css';

export default function Login(props) {
    return (

        <React.Fragment>
            {
            window.location.href === "https://reachlocalads.com/login" &&
                utils.isMobile &&
                <section className="login-container">
                    <LoginPage marginTop="8%" currState={props.currState} toggleLogin={props.toggleLogin} />
                    <article className="login" style={{ background: "#ffffff" }}>
                        <p className="video-header">Run Hyperlocal Targeting Campaigns with us</p>
                        <YoutubeVideo title="Run Hyperlocal Targeting Campaigns with us" url="zJoxS295JG8" width="100%" paddingTop="50%" iframeWidth="100%" iframeHeight="100%" />
                        <hr />
                        <p className="video-header">360 Degree Marketing on a single platform</p>
                        <YoutubeVideo url="1u6zW3nqVRA" width="100%" paddingTop="50%" iframeWidth="100%" iframeHeight="100%" />
                    </article>
                </section>
            }

            { window.location.href === "https://reachlocalads.com/login" && 
                !utils.isMobile &&
                <section className="login-container flex flex-direction--row flex-wrap">
                    <article className="login" style={{ flexGrow: "1" }}>
                        <div className="videoBox">
                            {/* <div style={{background: "#ffffff"}}> */}
                            <p className="video-header text--center text-large">Run Hyperlocal Targeting Campaigns with us</p>
                            <YoutubeVideo title="Run Hyperlocal Targeting Campaigns with us" url="zJoxS295JG8" left="20%" right="20%" width="100%" paddingTop="0%" iframeWidth="60%" iframeHeight="80%" />
                            {/* </div>     */}
                        </div>
                        <hr />
                        <div className="videoBox">
                            {/* <div style={{background: "#ffffff"}}> */}
                            <p className="video-header text--center text-large">360 Degree Marketing on a single platform</p>
                            <YoutubeVideo title="360 Degree Marketing on a single platform" url="1u6zW3nqVRA" left="20%" right="20%" width="100%" paddingTop="0%" iframeWidth="60%" iframeHeight="80%" />
                            {/* </div> */}
                        </div>
                    </article>
                    <article style={{ flexGrow: "1" }}>
                        <LoginPage marginTop="25%" currState={props.currState} toggleLogin={props.toggleLogin} />
                    </article>
                </section>
            }
            {
            window.location.href !== "https://reachlocalads.com/login" &&
            <section className="login-container">
                <LoginPage marginTop="8%" currState={props.currState} toggleLogin={props.toggleLogin} />
            </section>
            }
        </React.Fragment>
    )
}