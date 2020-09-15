
import React, { useState, useEffect} from 'react'
import Moment from 'react-moment';
import moment from 'moment'
import igdb from 'igdb-api-node'
import { Text, View, StyleSheet, Image,ActivityIndicator,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { Ionicons, FontAwesome } from '@expo/vector-icons'
import GameCard from "./GameCard"


export default connect(mapStateToProps, null)(RecommendationsPage)

const igdbKey="6c7f65361fdabb3d8b6dbe17eda25d77"

function mapStateToProps(state) {

    return {
        fav: state.favoriteGames
        
    }
}
function RecommendationsPage(props){
 let [recoms,setRecoms]= useState([])
 let [loading, setLoading]= useState(true)

    useEffect(() => {
        
      createRecommendations()

    }, [])

    async function createRecommendations(){
        setLoading(true)
        let filteredFavs = ()=>{
      
            return(
              
            props.fav.filter(fav=>{
              
              if(fav.userRating!=false){
                
                return fav
              }
              
            }))
          }
           //console.log(filteredFavs())
        if(filteredFavs().length<3){
            console.log("not enough favs")

            setLoading(false)
           
        }
        else{
            
        let randomFavs = filteredFavs().slice(0, 3).map(function () { 
            return this.splice(Math.floor(Math.random() * this.length), 1)[0];
            }, filteredFavs().slice());
            console.log(randomFavs)


            //First
        
            let sim1=randomFavs[0].similar_games[Math.floor(Math.random()*randomFavs[0].similar_games.length)]
            console.log(sim1)
            //Second
            let sim2=randomFavs[1].similar_games[Math.floor(Math.random()*randomFavs[0].similar_games.length)]
            console.log(sim2)
            //Third
            let sim3=randomFavs[2].similar_games[Math.floor(Math.random()*randomFavs[0].similar_games.length)]
            console.log(sim3)

            const gameFetch1 = await igdb(igdbKey).fields("name,cover,age_ratings,similar_games")
            .where(`id = ${(sim1)}`)
            .limit(1)
            .request('/games')

            const gameFetch2 = await igdb(igdbKey).fields("name,cover,age_ratings,similar_games")
            .where(`id = ${(sim2)}`)
            .limit(1)
            .request('/games');

            const gameFetch3 = await igdb(igdbKey).fields("name,cover,age_ratings,similar_games")
            .where(`id = ${(sim3)}`)
            .limit(1)
            .request('/games');

            let gameFetch= [gameFetch1.data[0],gameFetch2.data[0],gameFetch3.data[0]]
            //console.log(r)
            
            //GETS COVER URL AND ADDS TO GAME OBJECT
            for(var i=0;i<gameFetch.length;i++){
        
            if(typeof gameFetch[i]['cover']==='number'){
            let gameId=gameFetch[i].id
            const gameFetchWithImage = await igdb(igdbKey).fields("url,height,width").where(`game = ${gameId}`)
            .request('/covers');
        
                gameFetch[i].imageUrl= gameFetchWithImage.data
             }
                else{
            gameFetch[i].imageUrl= "none"
            }

                 }
        console.log(gameFetch)
        setRecoms(gameFetch)
        setLoading(false)




        }

       
        
    }
    function renderRec(){
        
        if(recoms.length<3){
            return(
                <View>
                    <Text style={{color:"purple", textAlign:"center"}}> Add at Least 3 Games to Your Favorites To Get Recommendations </Text>
                </View>
            )
        }
        else{
            let item1= {
                item: recoms[0]
            }
            let item2= {
                item: recoms[1]
            }
            let item3= {
                item: recoms[2]
            }
            return(
            <View style={{flex:1}}>
            <View style={{flex:1,flexDirection:"row",borderWidth:0,borderColor:"red", paddingTop:5}}>
            <GameCard game={item1} navigation={props.navigation}/>
            </View>

            <View style={{flex:1,flexDirection:"row",borderWidth:0,borderColor:"red"}}>
            <GameCard game={item2} navigation={props.navigation}/>
            </View>

            <View style={{flex:1,flexDirection:"row",borderWidth:0,borderColor:"red"}}>
            <GameCard game={item3} navigation={props.navigation}/>
            </View>
            </View>
            )
        }

    }
    

    if(loading==true){
        return(
           <View style={styles.container}>
               <ActivityIndicator animating size="large" />
               
           </View>
        )
       }
    return(
        <View style={styles.container}>
            <View style ={styles.titleContainer}>
                <Text style={styles.titleStyle}> Your Recommendations!</Text>
            </View>
            <View style ={styles.recContainer}>
                {renderRec()}
            </View>
            <View style={styles.reRollStyle}>
                <TouchableOpacity style={styles.refreshButton} onPress={()=>{
                    createRecommendations()
                }}>
                <FontAwesome name={"refresh"} size={30} color={"white"} />
                </TouchableOpacity>
            </View>
            <View style ={styles.texContainer}>
                <Text style={styles.textStyle}> Rate And Add More Games For Better Recommendations!</Text>
            </View>
        </View>
    )
 }

 const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:"column",
        
        height: "100%",
        width: "100%",
        justifyContent: 'flex-start',
        
        alignContent:"center",
        backgroundColor: '#1A2532',
      },
      
      titleContainer:{
        flex:.3,
        borderColor:"grey",
        borderWidth:2,
        justifyContent:"center"
        
      },
      recContainer:{
        flex:1.9,
        borderColor:"grey",
        borderWidth:2,
        
      },
      textContainer:{
        flex:.7,
        borderColor:"white",
        borderWidth:0,
        paddingTop:30
      },
      textStyle:{
          fontSize:20,
          color:"purple",
          textAlign:"center",
      },
       reRollStyle:{
        flex:.5,
        borderColor:"white",
        borderWidth:0,
        justifyContent:"center",
        alignItems:"center"
        
       },
      titleStyle:{
        fontSize:30,
        color:"white",
        textAlign:"center",
      },
      refreshButton:{
          flex:.5, 
          width:"45%",
          alignItems:"center",
          justifyContent:"center",
          backgroundColor:"purple"
      }

    })