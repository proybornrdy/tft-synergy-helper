import React from 'react';
import Data from './assets/en_us_TFT'
import ContentManage from './ContentManage'

class DataManage extends React.Component{

    constructor (props){
        super(props);
        this.state = {
            champsByCost:{},
            champsBySynergy:{}
        }
    }

    createData=()=>{
        const championIDs = Object.keys(Data.champions);
        let origins =[];
        let classes =[];
        for (var champID in Data.champions){
            const champTrait = Data.champions[champID].traits;
            origins.push(champTrait[0]);
            classes.push(champTrait[champTrait.length-1]);
        }

        let championCostList = {};
        championCostList = this.sortDataByCost(championIDs);

        let championSynergyList = {};
        championSynergyList = this.sortDataBySynergy(origins,classes);




        this.setState({
            champsByCost:championCostList,
            champsBySynergy:championSynergyList
        })

    }

    sortDataByCost=(championIDs)=>{
        let result= {};
        for (var index in championIDs){
            const champID = championIDs[index];
            const champInfo = this.getSpecificChampData(champID);
            const cost = champInfo.cost;
            result['cost'+cost] = (result['cost'+cost]||[]);
            result['cost'+cost].push(champID)
        }

        return result;

    }

    sortDataBySynergy=(origins, classes)=>{
        let result = {
            "origins":{},
            "classes":{}
        };
        let trait="";
        for(var index in origins){
            trait = origins[index];
            result["origins"][trait] = result["origins"][trait]||[];
        }
        for(index in classes){
            trait = classes[index];
            result["classes"][trait] = result["classes"][trait]||[];
        }

        const champData = Data.champions;
        for( var champID in champData){
            const champTraitsInfo = champData[champID].traits;
            for(index in champTraitsInfo){
                if(Object.keys(result["origins"]).includes(champTraitsInfo[index])){
                    result["origins"][champTraitsInfo[index]] = result["origins"][champTraitsInfo[index]] ||[];
                    result["origins"][champTraitsInfo[index]].push(champID);
                }else{
                    result["classes"][champTraitsInfo[index]] = result["classes"][champTraitsInfo[index]] ||[];
                    result["classes"][champTraitsInfo[index]].push(champID);
                }
            }
        }
        //sort by cost
        for (trait in result["origins"]){
            const temp = this.sortDataByCost(result["origins"][trait])
            let updatedList = [];
            for(var i=1;i<=5;i++){
                if(typeof temp['cost'+i] !== 'undefined'){
                    updatedList.push.apply(updatedList,temp['cost'+i])
                }
            }
            result["origins"][trait] = updatedList;
        }
        for (trait in result["classes"]){
            const temp = this.sortDataByCost(result["classes"][trait])
            let updatedList = [];
            for(i=1;i<=5;i++){
                if(typeof temp['cost'+i] !== 'undefined'){
                    updatedList.push.apply(updatedList,temp['cost'+i])
                }
            }
            result["classes"][trait] = updatedList;
        }

        return result;

    }

    getSpecificChampData=(champID)=>{
        return( Data.champions[champID]);
    }

    getSpecificTraitData = (trait)=>{
        for(var i in Data.traits){
            if(Data.traits[i].name === trait){
                return(Data.traits[i]);
            }
        }

    }
    getChampWithTrait = (trait)=>{
        let result = [];
        for (var champ in Data.champions){

            if(Data.champions[champ]["traits"].includes(trait)){
                result.push(champ);
            }

        }
        return result;
    }

    componentWillMount(){
        this.createData();
    }

    render(){
        return(
            <div>
                <ContentManage
                    db={this.state}
                    getChampInfo={this.getSpecificChampData}
                    getTraitInfo={this.getSpecificTraitData}
                    getTraitChampList = {this.getChampWithTrait}
                />
            </div>
        )
    }



}
export default DataManage;
