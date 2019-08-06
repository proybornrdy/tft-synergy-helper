import React from 'react';
import './Banner.css';

class Banner extends React.Component{


    render(){
        return(
            <div className ="banner-wrapper">
                <div className = "banner">
                    <div className = "top-right">
                        <div className = "nav-language">
                            <h6><strike>Korean</strike></h6>
                            <h6>English</h6>
                        </div>
                    </div>
                    <div className = "bottom">
                        <div>
                            <h1>TEAM FIGHT TATICS</h1>
                            <h2> Team Builder</h2>
                        </div>
                        <div className = "nav-mainmenu">
                            <div >
                                <h5>Champions</h5>
                                <h5><strike>Items</strike></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Banner;
