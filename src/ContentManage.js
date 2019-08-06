import React from 'react';
import './ContentManage.css';
import Banner from './Banner';

class ContentManage extends React.Component{

    //From DataMAnage.js
    //this.props.db --> contains two dict
    //  champsByCost where keys = 'cost'+i  && value = list of championID
    //  champsBySynergy where keys = trait && value = list of championID
    //this.props.getChampInfo --> takes param of champID and returns champion data
    //this.props.getTraitInfo --> takes param of trait-name and returns its data

    constructor (props){
        super(props);
        this.state = {
            pbeChampions:["164", "126", "254", "222"],
            selectedChampions:[],
            generatedChampions:[],
            selectedSynergy:[],
            maxChamp:10,
            dataLink:'https://ddragon.leagueoflegends.com/cdn/9.12.1/img/champion/',
            selectOpt:'synergy'
        }
    }



    getCurrSynergy=(champIDs)=>{
        //returns detail of current synergy status
        //each synergy is used as a key
        //and values are in list such that [current Amount, appliedEffect, nextEffectReq, maxEffectReq]

        let championIDs = champIDs;
        let synergies = {};
        for (var index in championIDs){
            var champData = this.props.getChampInfo(championIDs[index]);
            for(var j in champData.traits){
                synergies[champData.traits[j]] = (synergies[champData.traits[j]]||0)+1;
            }
        }
        let appliedSynergy = {"complete":[], "incomplete":[], "partial":[]};
        for (var synergy in synergies){
            let synergyData = this.props.getTraitInfo(synergy);
            const maxTraitValue = synergyData.effects[synergyData.effects.length-1].minUnits;
            const minTraitValue = synergyData.effects[0].minUnits;

            let curAmount = synergies[synergy];
            let maxEffectReq = maxTraitValue - curAmount;
            let appliedEffect = 0;
            let nextEffectReq = 0;

            if(maxTraitValue <= synergies[synergy]){
                appliedSynergy["complete"][synergy]=maxTraitValue;
            }else if (minTraitValue> curAmount) {
                nextEffectReq = minTraitValue-curAmount
                appliedSynergy["incomplete"][synergy] = [curAmount, appliedEffect, nextEffectReq,maxEffectReq];

            }else{
                for (index in synergyData.effects){
                    if(synergies[synergy]>= synergyData.effects[index].minUnits
                        && synergies[synergy]<= synergyData.effects[index].maxUnits){

                        appliedEffect = synergyData.effects[index].minUnits;
                        nextEffectReq = synergyData.effects[index].maxUnits+1 - curAmount;
                        appliedSynergy["partial"][synergy]=[curAmount, appliedEffect,nextEffectReq, maxEffectReq];
                    }
                }
            }
        }

        return appliedSynergy;
    }

    getChampPortraitLink=(champID)=>{
        const champData = this.props.getChampInfo(champID);
        let champName = champData.name;
        champName = champName.replace(/\s+/g, '');
        champName = champName.replace("'", '');

        //special case due to Database typo
        if( champName ==="ChoGath" || champName ==="KhaZix" ){
            let temp = champName.charAt(0).toUpperCase() + champName.substring(1).toLowerCase();
            champName = temp;
        }


        const portraitLink = this.state.dataLink + champName + '.png'
        return portraitLink;
    }

    html_createChampPortrait=(champID , key)=>{
        const imgLink = this.getChampPortraitLink(champID);
        let className = 'champImg';
        if (this.state.selectedChampions.includes(champID)){
            className = 'champImg active';
        }

        if (!this.state.pbeChampions.includes(champID)){
            return(
                <img
                className={className}
                name={champID}
                key={key}
                src = {imgLink}
                alt = {champID}
                onClick={() => this.btn_imgClick(champID)}/>
            )
        }else{
            return(
                <div className='pbeChamp' key={key}>

                    <img
                    className={className}
                    name={champID}
                    src = {imgLink}
                    alt = {champID}
                    onClick={() => this.btn_imgClick(champID)}/>
                    <p className = 'pbeSign'>PBE</p>
                </div>
            )
        }

    }

    html_createChampGroupContainer=(champIDs, key = null)=>{
        let champImgs = [];
        for(var index in champIDs){
            const champImg = this.html_createChampPortrait(champIDs[index] , index);
            champImgs.push(champImg);
        }
        const generated = this.state.generatedChampions;
        const selected = this.state.selectedChampions;
        if(key === "Generated" && generated.length===0){
            return(
                <div className = "genselBox" key = {key}>
                    <div className = "champGroup" key = {key}>
                        <h5>{key}</h5>
                        <button className = "buildBtn" onClick = {this.btn_teamBuild}> Build </button>
                    </div>
                    <div className = "btnCase">
                    </div>
                </div>
            )
        }else if(key === "Generated" ){
            return(
                <div className = "genselBox" key = {key}>
                    <div className = "champGroup" key = {key}>
                        <h5>{key}</h5>
                        {champImgs}
                    </div>
                    <div className = "btnCase">
                        <button className="test" onClick = {this.btn_teamBuild}>reBuild</button>
                    </div>
                </div>
            )
        }

        if(key === "Selected" && selected.length===0){
            key = "Selected " + this.state.selectedChampions.length + "/"+ this.state.maxChamp ;
            return(
                <div className = "genselBox" key = {key}>
                    <div className = "champGroup" key = {key}>
                        <h5>{key}</h5>
                        {champImgs}
                    </div>
                    <div className = "btnCase">

                    </div>
                </div>
            )
        }else if(key === "Selected" && selected.length>0){
            key = "Selected " + this.state.selectedChampions.length + "/"+ this.state.maxChamp ;
            return(
                <div className = "genselBox" key = {key}>
                    <div className = "champGroup" key = {key}>
                        <h5>{key}</h5>
                        {champImgs}
                    </div>
                    <div className = "btnCase">
                        <button className="test" onClick = {this.btn_reset}>reset</button>
                    </div>
                </div>
            )
        }
        return(
            <div className = "champGroup" key = {key}>
                <h5 className="synergyClick">{key}</h5>
                {champImgs}
            </div>
        )

    }

    html_createChampList=(option)=>{
        if (option === "synergy"){
            let originData = this.props.db.champsBySynergy["origins"];
            let classData = this.props.db.champsBySynergy["classes"];
            let originChamps =[];
            for(var synergy in originData){
                let champIDs = originData[synergy];
                originChamps.push(this.html_createChampGroupContainer(champIDs, synergy))
            }

            let classChamps =[];
            for(synergy in classData){
                let champIDs = classData[synergy];
                classChamps.push(this.html_createChampGroupContainer(champIDs, synergy))
            }
            return(
                <div className = "container">
                    <h3>Origin</h3>
                    <div className = "champSubContainer">
                        {originChamps}
                    </div>
                    <h3>Class</h3>
                    <div className = "champSubContainer">
                        {classChamps}
                    </div>
                </div>
            )

        }else{
            let data = {};
            let champDisplay = [];
            data = this.props.db.champsByCost;
            for(var i = 1; i<=5 ; i++){
                let key = 'cost'+i;
                let champIDs = data[key];
                let htmlFormat = (
                    <div className="champSubContainer" key = {key}>
                        <div>
                            {this.html_createChampGroupContainer(champIDs,'Cost: '+i)}
                        </div>
                    </div>
                )

                champDisplay.push(htmlFormat)
            }

            return(
                <div className = "container">
                    {champDisplay}
                </div>
            )
        }
    }

    html_resultGenerator=()=>{
        const selected = this.state.selectedChampions;
        const generated = this.state.generatedChampions;
        const stateSyn = this.state.selectedSynergy;
        const html_selected = this.html_createChampGroupContainer(selected,'Selected')
        const html_generated = this.html_createChampGroupContainer(generated,'Generated')
        let champs = [...selected,...generated];
        let synergy = this.getCurrSynergy(champs);
        let synHtml = [];
        for (var syn in synergy){
            if(syn === "complete" && Object.keys(synergy[syn]).length>0){
                for (var subSyn in synergy[syn] ){
                    let className = "synergy complete";
                    if (stateSyn.includes(subSyn)){
                        className += " synBorder";
                    }
                    synHtml.push(
                        <span key ={subSyn} id = {subSyn} className ={className} onClick={this.btn_ClickSyn}>
                        {subSyn + " (" + synergy[syn][subSyn] + ")"}
                        </span>
                    )
                }

            }else if (syn !=="incomplete" && syn !== "complete"){

                for (subSyn in synergy[syn] ){
                    let className = "synergy partial";
                    if (stateSyn.includes(subSyn)){
                        className += " synBorder";
                    }
                    synHtml.push(
                        <span key ={subSyn} id = {subSyn} className ={className} onClick={this.btn_ClickSyn}>
                        {subSyn + " (" + synergy[syn][subSyn][1] + ")"}
                        </span>

                    )
                }

            }
        }
        let newBtn = [];
        let synString = <h5>Synergy</h5>;
        if (this.state.generatedChampions.length>0){
            synString = <h5>Synergy -<p>(select Synergy you want to build with)</p></h5>
        }
        if(this.state.selectedSynergy.length>0){
            newBtn.push(<button className="synBtn" key ="buidlSyn" onClick = {this.btn_buildWithSyn}> Build With <br/> Synergy </button>)            
        }

        return(
            <div className="container resultBox">
                <div className="overideContainer">
                    {html_selected}
                    {html_generated}

                    <div >
                        <div className="synergyBox inline">
                            <span className = "inline">
                                {synString}
                            </span>
                            <div className="synContainer">
                            {synHtml}
                            </div>
                        </div>
                    {newBtn}
                    </div>


                </div>
            </div>
        )
    }

    btn_toggleSort=()=> {
        if(this.state.selectOpt === "synergy"){
            this.setState({
                selectOpt:"cost"
            });
        }else{
            this.setState({
                selectOpt:"synergy"
            });
        }
    }
    btn_reset =()=>{
        this.setState({
            selectedChampions:[],
            generatedChampions:[],
            selectedSynergy:[]
        })
    }

    btn_ClickSyn =(synergy)=> {
        let stateSyn = [];
        if(this.state.selectedSynergy.length>0){
            stateSyn = [...this.state.selectedSynergy];
        }

        if(!stateSyn.includes(synergy.target.id)){
            stateSyn.push(synergy.target.id);
        }else {
            stateSyn.splice(stateSyn.indexOf(synergy.target.id),1)
        }
        this.setState({
            /*generatedChampions:newGen,*/
            selectedSynergy:stateSyn
        })
    }
    btn_buildWithSyn = ()=>{
        const stateGen = this.state.generatedChampions;
        const stateSyn =[...this.state.selectedSynergy];

        let champToMove =[];
        for(var synIndex in stateSyn){
            let synergy = stateSyn[synIndex];
            for (var index in stateGen){
                let champData = this.props.getChampInfo(stateGen[index]);
                if(champData.traits.includes(synergy)){
                    if(!champToMove.includes(stateGen[index])){
                        champToMove.push(stateGen[index]);
                    }
                }
            }
        }

        for (index in champToMove){
            this.btn_imgClick(champToMove[index]);
        }


        // let gen = [...this.state.generatedChampions];
        // let newGen = [];
        // for (index in gen){
        //     if(!champToMove.includes(gen[index])){
        //         newGen.push(gen[index])
        //     }
        // }
        // this.setState({
        //     generatedChampions:newGen,
        //     selectedSynergy:[]
        // })
        const selChamps=this.state.selectedChampions;
        this.btn_teamBuild(null,[...selChamps,...champToMove]);
    }

    btn_imgClick=(champID)=>{
        const selected = this.state.selectedChampions;
        const generated = [...this.state.generatedChampions];
        if(!selected.includes(champID) ){
            if(selected.length < this.state.maxChamp){ //add selected champ to selected
                this.setState(function(prevState){
                    return{
                        selectedChampions:[...prevState.selectedChampions,champID],
                        selectedSynergy:[]
                    }
                });
            }
            if(generated.includes(champID)){ //remove champ from generated since champ moved to selectedList

                generated.splice(generated.indexOf(champID),1);

                this.setState(function(prevState){
                    return{
                        generatedChampions:generated
                    }
                });

            }
            else if(!generated.includes(champID) && generated.length>0){
                this.setState(function(prevState){
                    return{
                        generatedChampions:[]
                    }
                });
            }

        }else{
            let newSelected = [...selected];
            newSelected.splice(newSelected.indexOf(champID),1);
            this.setState({
                selectedChampions:newSelected
            });
        }
    }

    btn_teamBuild=(e, selected = null)=>{

        if (selected === null){
            selected = this.state.selectedChampions;
        }
        const maxChampCount = this.state.maxChamp;
        let generated = [];
        let workingCopy =[];

        if(Object.keys(selected).length>0){
            var validSpot = maxChampCount - selected.length;
            workingCopy = [...selected,...generated];

            while(validSpot>0){
                var synergyData = this.getCurrSynergy(workingCopy);
                let incompleteSynergy = synergyData["incomplete"];
                let partialSynergy = synergyData["partial"];


                let totalSynergy = Object.assign({}, incompleteSynergy, partialSynergy);

                let synergyToFind = [];
                let countCheck=10000;
                for (var synergy in totalSynergy){
                    if (totalSynergy[synergy][3] <countCheck){
                        countCheck = totalSynergy[synergy][3];
                        synergyToFind=[synergy];
                    }else if(totalSynergy[synergy][3] === countCheck){
                        synergyToFind.push(synergy);
                    }
                }
                let selectedSynergy = synergyToFind[Math.floor(Math.random() * synergyToFind.length)]
                let traitChamps = this.props.getTraitChampList(selectedSynergy);
                let possibleChamps =[]
                for (var index in traitChamps){
                    if (!workingCopy.includes(traitChamps[index])){
                        possibleChamps.push(traitChamps[index]);
                    }
                }
                let champID =possibleChamps[Math.floor(Math.random() * possibleChamps.length)];
                workingCopy.push(champID);
                generated.push(champID);
                validSpot -=1;
            }
            this.setState({
                generatedChampions:workingCopy.splice(selected.length),
                selectedSynergy:[]
            })

        }

    }


    render(){
        return(
            <div name = "Web Page">
                <Banner />
            {/*console.log(this.state.selectedChampions)*/}
                {this.html_resultGenerator()}
                <div className = "container">
                    <button className="sortNavBtn"
                            disabled = {this.state.selectOpt === "synergy"}
                            onClick={this.btn_toggleSort}
                    >
                        Synergy
                    </button>
                    <button className="sortNavBtn"
                            disabled = {this.state.selectOpt === "cost"}
                            onClick={this.btn_toggleSort}
                    >
                    Cost
                    </button>
                </div>
                {this.html_createChampList(this.state.selectOpt)}

            </div>
        )
    }
}

export default ContentManage;
