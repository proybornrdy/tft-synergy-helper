import React from 'react';
import './synergy_champ.css';

import champData from './jsonData/champions.json';
import classData from './jsonData/classes.json';
import originData from './jsonData/origins.json';

import ReadData from './readData';


class Synergy extends React.Component {

    constructor (props){
        super(props);
        this.state = {
            dataLink : 'https://ddragon.leagueoflegends.com/cdn/9.12.1/img/champion/',
            selectedChamp : [],
            generatedChamp: [],
            gainedSynergy: {},
            sort:"syn"
        }
        this.champClick = this.champClick.bind(this);
        this.buildTeam =this.buildTeam.bind(this);
        this.printSynergy = this.printSynergy.bind(this);
        this.sortCostClick = this.sortCostClick.bind(this);
        this.sortSynClick = this.sortSynClick.bind(this);
    }

    printGenerated(){
        var champList = this.state.generatedChamp;
        var link = this.state.dataLink;
        const self = this;
        console.log("sadfasf",ReadData.getData)
        if (!champList>0){
            return (<td className = "select-container" width="50"></td>)
        }
        else{
            var list = champList.map(function(champ){
                return  (
                        <td className = "select-container" >
                        <img
                        id={champ}
                        className={'champ-Frame '}
                        src = {link + champ+ '.png'}
                        onClick={self.champClick}/>
                        </td>
                )
            })
        }

        return (list)
    }

    printSelected(){
        var champList = this.state.selectedChamp;
        var link = this.state.dataLink;
        const self = this;
        if (!champList>0){
            return (<td className = "select-container" width="50"></td>)
        }
        else{
            var list = champList.map(function(champ){
                return  (
                        <td className = "select-container" >
                        <img
                        id={champ}
                        className={'champ-Frame '}
                        src = {link + champ+ '.png'}
                        onClick={self.champClick}/>
                        </td>
                )
            })
        }

        return (list
        )
    }

    printSynergy(){
        var data = this.state.gainedSynergy;
        var synergies = Object.keys(data);
        var complete = [];
        var partial = [];
        if(synergies.length>0){
            for (var i in synergies){
                if (synergies[i]+'' == "completed"){
                    complete.push.apply(complete,data["completed"]);
                }
                else{
                    partial.push(synergies[i]+" ("+data[synergies[i]]+")");
                }
            }

            var a = complete.map(function(comp){
                return <p className="synergyContainer">{comp.toUpperCase()}</p>
            });
            var b = partial.map(function(syn){
                return <p className="synergyContainer partial">{syn.toUpperCase()}</p>
            });
            return(
                <span>{a}{b}</span>
            );
        }
    }


    champSort(){

        var champCosts = this.champsByCost(Object.keys(champData));
        var link =this.state.dataLink;
        const self = this;

        if(this.state.sort === "cost"){
            var champlist = [];
            for (var i in champCosts){
                var champions = champCosts[i];
                var champPortraits = champions.map(function(champ){

                    return (
                        <td key={champ}>
                            <img
                            id={champ}
                            className={'champ-Frame ' +'cost'+i }
                            src = {link + champ+ '.png'}
                            onClick={self.champClick}/>
                        </td>
                    )
                })
                champlist.push(<tr key={i}>{champPortraits}</tr>)
            }
            return(<table className = "champion-list"><tbody>{champlist}</tbody></table>)
        }
        else{
            var classSynergies = Object.keys (classData);
            var originSynergies = Object.keys(originData);

            var classList = {};
            var originList ={};

            for (i in classSynergies){
                classList [classSynergies[i]] = this.findSynergyChamp(classSynergies[i]);
            }
            for (i in originSynergies){
                originList [originSynergies[i]] = this.findSynergyChamp(originSynergies[i]);
            }

            var cList =[];
            for(i in classList){
                champions= classList[i];
                champPortraits = champions.map(function(champ){
                    return (
                        <td key={champ}>
                            <img
                            id={champ}
                            className={'champ-Frame '}
                            src = {link + champ+ '.png'}
                            onClick={self.champClick}
                            />
                        </td>
                    )

                })
                cList.push(
                    <table key = {i+" class"}><caption className = "group" align="top">{i.toUpperCase()}</caption>
                    <tbody>
                    <tr key={i}>{champPortraits}</tr>
                    </tbody>
                    </table>
                )
            }

            var oList =[];
            for(i in originList){

                champions= originList[i];
                champPortraits = champions.map(function(champ){
                    return (
                        <td key={champ}>
                            <img
                            id={champ}
                            className={'champ-Frame '}
                            src = {link + champ+ '.png'}
                            onClick={self.champClick}
                            />
                        </td>
                    )
                })
                oList.push(
                    <table key = {i+" origin"} ><caption className = "group" align="top">{i.toUpperCase()}</caption>
                    <tbody>
                    <tr key={i}>{champPortraits}</tr>
                    </tbody>
                    </table>
                )
            }


            return(
                <table className = "champion-list" ><tbody>
                    <tr>
                        <td>
                            <table>
                            <caption align="top">Classes</caption>
                            <tbody><tr><td>{cList}</td></tr></tbody></table>
                        </td>
                        <td>
                            <table>
                            <caption align="top">Origins</caption>
                            <tbody><tr><td>{oList}</td></tr></tbody></table>
                        </td>
                    </tr>
                </tbody></table>
            )
        }
    }
    sortCostClick(e){
        var cursort = this.state.sort;
        if(!(cursort === "cost")){
            this.setState({
                sort:"cost"
            })
        }
    }
    sortSynClick(e){
        var cursort = this.state.sort;
        if(cursort === "cost"){
            this.setState({
                sort:"syn"
            })
        }
    }

    champClick(e){
        var test = this.state.selectedChamp;
        var gen = this.state.generatedChamp;

        if(test.length<10){
            if (!test.includes(e.target.id)){
                e.target.className += " clicked"
                test.push(e.target.id)
                this.setState(state => ({
                    selectedChamp: test
                }));
            }else{
                e.target.className = e.target.className.replace(' clicked', '');
                test.splice(test.indexOf(e.target.id),1);
                this.setState(state => ({
                    selectedChamp: test
                }));
            }

        }
    }


    champsByCost(champList){
        //give champion colored frame based on their cost

        var costData = {};

        for (var i  in champList){
            var cost = champData[champList[i]]["cost"];
            costData[cost] = (costData[cost]||[]);
            costData[cost].push(champList[i])

        }
        return costData;
    }

    buildTeam(){

        var generatedList = [];
        var selectedList = this.state.selectedChamp;
        var champList =[];
        var maxChampCount = 9;

        if(Object.keys(selectedList).length>0){
            var validSpot = maxChampCount - selectedList.length;
            champList.push.apply(champList, selectedList);
            champList.push.apply(champList, generatedList);

            while(validSpot > 0){ //change to while(validSpot > 0)

                var neededSynergies = this.getPlayerHandInfo(champList);
                //neededSynergies = [quality, quantity]
                //quality mainly focuses on reaching max bonuses on required synergy
                //quantity focuses on reaching many partial bonuses

                var qualitySynergies ={};
                for (var i = 1; i <=validSpot ; i++){
                    if( (typeof neededSynergies[0][i] !== 'undefined') && neededSynergies[0][i].length > 0 ){
                        qualitySynergies[i] = neededSynergies[0][i];
                    }
                }

                var random = Object.keys(qualitySynergies);
                //console.log(qualitySynergies , validSpot)
                if(random.length > 0){
                    random = random[Math.floor(Math.random()*random.length)]; //random == needed champ to reach max bonus
                    var selectedSynergy = qualitySynergies[random];
                    selectedSynergy = selectedSynergy[Math.floor(Math.random()*selectedSynergy.length)];

                    var selectedChamp = this.findSynergyChamp(selectedSynergy);
                    selectedChamp = this.findSynergyNotInHand(champList, selectedChamp);
                    for(i = 0; i<=random-1; i++){
                        var randomChamp = selectedChamp[Math.floor(Math.random()*selectedChamp.length)];
                        selectedChamp.splice( selectedChamp.indexOf(randomChamp), 1 );
                        champList.push(randomChamp)

                    }
                    validSpot -= random;
                }else{

                    var quantitySynergies = {};
                    for(i = 1; i<=validSpot;i++){
                        if((typeof neededSynergies[1][i] !== 'undefined') && neededSynergies[1][i].length > 0){
                            quantitySynergies[i] = neededSynergies[1][i];
                        }
                    }

                    random = Object.keys(quantitySynergies);

                    if(random.length > 0){
                        random = random[Math.floor(Math.random()*random.length)];
                        selectedSynergy = quantitySynergies[random];
                        if(random.length === 2){
                                selectedSynergy.push.apply(selectedSynergy,["guardian","dragon"])
                        }
                    }else{
                        random = 1;
                        selectedSynergy = ["exile", "robot"]
                    }
                    selectedSynergy = selectedSynergy[Math.floor(Math.random()*selectedSynergy.length)];

                    selectedChamp = this.findSynergyChamp(selectedSynergy);
                    selectedChamp = this.findSynergyNotInHand(champList, selectedChamp);

                    for(i = 0; i<=random-1; i++){
                        var randomChamp = selectedChamp[Math.floor(Math.random()*selectedChamp.length)];
                        selectedChamp.splice( selectedChamp.indexOf(randomChamp), 1 );
                        champList.push(randomChamp)
                    }
                    validSpot -= random;
                }
            }

            for (i in champList){
                //console.log(champList[i],originList)
                if (!selectedList.includes(champList[i])){
                    generatedList.push(champList[i]);
                }
            }


            var synCurrStat = this.getPlayerHandInfo(champList)[0];
            var currSynergy = [];

            for (i=1; i<=5;i++){
                if(synCurrStat[i].length>0){
                    currSynergy.push.apply(currSynergy,synCurrStat[i]);
                }
            }

            var synCount = {}
            for (i in currSynergy){
                synCount[currSynergy[i]] = 0;
            }

            for (i in champList){
                for(var j in champData[champList[i]]["origin"]){
                    synCount[champData[champList[i]]["origin"][j].toLowerCase()] +=1;
                }
                for(j in champData[champList[i]]["class"]){
                    synCount[champData[champList[i]]["class"][j].toLowerCase()] +=1;
                }
            }



            var synMap = this.getSynergyInfo(currSynergy);

            var synResult = {};
            for (i in currSynergy){
                for (var j in synMap[currSynergy[i]]){
                    if (synCount[currSynergy[i]]>=synMap[currSynergy[i]][j]){
                        synResult[currSynergy[i]] = synMap[currSynergy[i]][j]
                    }
                }
            }

            synResult["completed"] = synCurrStat["completed"]


            this.setState((state) =>{
                return{
                    generatedChamp:generatedList,
                    gainedSynergy: synResult
                };
            });
        }else{
            this.setState((state) =>{
                return{
                    selectedChamp : [],
                    generatedChamp: [],
                    gainedSynergy: {}
                };
            });
        }


    }

    findSynergyChamp(synergy){
        //find all champions with given synergy

        synergy = synergy.charAt(0).toUpperCase() + synergy.slice(1)
        var result = [];
        var champList = Object.keys(champData);

        for(var champ in champList){
            var champInfo = champData[champList[champ]];
            if(champInfo['class'].includes(synergy)){
                result.push(champInfo['key']);
            }else if(champInfo['origin'].includes(synergy)){
                result.push(champInfo['key']);
            }
        }
        return result;
    }

    findSynergyNotInHand(hand, champList){
        // from given champ list return champions thats not in player's hand

        var result = [];
        for (var index in champList){

            if(!hand.includes(champList[index])){
                result.push(champList[index])
            }
        }
        return result;
    }

    getPlayerHandInfo(championList){
        //get details on champions player has


        var quantitySynergyProgress = {
            1:[],
            2:[],
            3:[],
            "completed":[]
        }
        var qualitySynergyProgress = {
            1:[],
            2:[],
            3:[],
            4:[],
            5:[],
            "completed":[]
        }

        var synergyCount = {}
        for (var index in championList){
            var champInfo = champData[championList[index]];
            var origins = champInfo["origin"];
            var classes = champInfo["class"];
            for(var originIndex in origins){
                var champOrigin = origins[originIndex].toLowerCase();
                synergyCount[champOrigin] = (synergyCount[champOrigin]||0)+1;
            }
            for(var classIndex in classes){
                var champClass = classes[classIndex].toLowerCase();
                synergyCount[champClass] = (synergyCount[champClass]||0)+1;
            }
        }

        var synergyLevelMap = this.getSynergyInfo(Object.keys(synergyCount));
        for( var synergy in synergyLevelMap){
            var currSynergyCount = synergyCount[synergy]
            for(var i = 0; i<= synergyLevelMap[synergy].length-1;i++){
                if(currSynergyCount <= synergyLevelMap[synergy][i]){
                    var diff = synergyLevelMap[synergy][i] -currSynergyCount;
                    var maxDiff =
                        synergyLevelMap[synergy][synergyLevelMap[synergy].length-1]
                        - currSynergyCount;

                    if(diff === 1){
                        quantitySynergyProgress[1].push(synergy)
                    }else if (diff === 2) {
                        quantitySynergyProgress[2].push(synergy)
                    }else if (diff === 3) {
                        quantitySynergyProgress[3].push(synergy)
                    }else if (diff === 0) {
                        quantitySynergyProgress['completed'].push(synergy)
                    }

                    if(maxDiff === 1){
                        qualitySynergyProgress[1].push(synergy)
                    }else if (maxDiff === 2) {
                        qualitySynergyProgress[2].push(synergy)
                    }else if (maxDiff === 3) {
                        qualitySynergyProgress[3].push(synergy)
                    }else if (maxDiff === 4) {
                        qualitySynergyProgress[3].push(synergy)
                    }else if (maxDiff === 5) {
                        qualitySynergyProgress[5].push(synergy)
                    }else if (maxDiff === 0) {
                        qualitySynergyProgress['completed'].push(synergy)
                    }

                    break;
                }
            }

        }



        return [qualitySynergyProgress, quantitySynergyProgress];

    }

    getSynergyInfo(synergyList){

        var synergyData = {};
        for (var index in synergyList){
            var synergy = synergyList[index];
            if(!classData[synergy]){
                //synergy not in classdata. Check originData
                var synergyLevels = [];
                for( var bonusRankIndex in originData[synergy]["bonuses"]){
                    synergyLevels.push(originData[synergy]["bonuses"][bonusRankIndex]["needed"]);
                }
                synergyData[synergy] = synergyLevels;
            }else{
                //synergy in classData
                synergyLevels = [];
                for( bonusRankIndex in classData[synergy]["bonuses"]){
                    synergyLevels.push(classData[synergy]["bonuses"][bonusRankIndex]["needed"]);
                }
                synergyData[synergy] = synergyLevels;
            }
        }
        return synergyData;

    }



    render(){
        const selected = this.state.selectedChamp>0;
        return(
            <div>
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
                <div className = "main-body">
                    <div className = "result-wrapper sticky">
                        <div className = "center" >
                            {/*
                                this part is done by code.
                                Depending on User's selection
                                for default display empty area
                            */}
                            <table className = "resultTable-wrapper padding ">
                                <colgroup>
                                    <col span="1" width="25%"/>
                                    <col span="1"/>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <td className="padding">
                                            <p>Team Result</p>
                                        </td>
                                        <td className="right padding"><button onClick={this.buildTeam}> BUILD </button></td>
                                    </tr>
                                </thead>
                                    <tbody >
                                        <tr height = "135">
                                            <td className="padding">
                                                <table className="selected-champ-wrapper">
                                                    <caption align="top">Selected</caption>
                                                    <tbody height="77">
                                                        <tr className = "border" height="72">

                                                            {/*need if statement here for empty cell <td><img/></td>*/}
                                                            <td><table><tbody><tr>
                                                                {this.printSelected()}
                                                            </tr></tbody></table></td>

                                                        </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                            <td>
                                                <table>
                                                    <caption align="top">Generated</caption>
                                                    <tbody>
                                                        <tr height="72">
                                                            {/*get list of champs generated in <td><img/></td>*/}
                                                            {this.printGenerated()}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2">
                                                {this.printSynergy()}
                                            </td>
                                        </tr>
                                    </tbody>


                            </table>
                        </div>
                    </div>
                    <div className = "sort-nav-wrapper">
                        <div className="center">
                        {/* http://jsfiddle.net/Kf6dD/ */}
                            <div className="sort-nav">
                                <div>
                                    <button onClick={this.sortSynClick}>sort by Synergy </button>
                                    <button onClick={this.sortCostClick} >sort by Cost</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "champion-list-wrapper ">
                        <div className ="center">
                            {this.champSort()}
                        </div>

                    </div>
                </div>
                <div>
                ~~~!~!~!~
                </div>
            </div>
        );
    }
}

export default Synergy;
