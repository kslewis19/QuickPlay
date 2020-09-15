import React, { useState, useEffect} from 'react'
import Moment from 'react-moment';
import moment from 'moment'
import igdb from 'igdb-api-node'
import { Text, View, StyleSheet, Image,ActivityIndicator,ScrollView,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'

export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage)

const igdbKey="6c7f65361fdabb3d8b6dbe17eda25d77"
const types = {
    APPEND_FAVORITE_GAMES:"APPEND_FAVORITE_GAMES",
  }

function mapStateToProps(state) {

    return {
        gameData: state.detailsId,
        fav: state.favoriteGames
        
    }
}
function mapDispatchToProps(dispatch){
    return{
        addToFavorites: (game) => dispatch({ type: types.APPEND_FAVORITE_GAMES, payload: game }),
        getInitalFavoriteGames: (id)=> dispatch(handler(id)),
    }
}

function handler(id){
    //console.log("handled")
    return dispatch => {
        return new Promise((resolve, reject) => {
          dispatch({
            type: types.UPDATE_FAVORITE_GAMES,
            payload: id
          });
    
          resolve()
        });
      }
   
    
}
 function DetailsPage(props) {
    useEffect(() => {
        getGameData()
        checkAdded()

    }, [])
 function checkAdded(){

    //console.log(props.gameData.id)
    for(let i=0; i<props.fav.length;i++){
        if(props.fav[i].id==props.gameData.id){

            setAdded(true)
        }
    }
 }
    let [gameFetchData,setGameFetchData]= useState(null)
    let [loading, setLoading]= useState(true)
    let [added,setAdded]= useState(false)
    async function getGameData() {
        
        
     setLoading(true)
    
        const gameFetch = await igdb(igdbKey).fields("name,first_release_date,summary,aggregated_rating,aggregated_rating_count,time_to_beat,genres,similar_games")
        .where(`id=${props.gameData.id}`)
        .limit(1)
        .request('/games');
        
        if(gameFetch.data[0].genres!=null){
            //console.log(gameFetch.data[0].genres[0])
            const genreFetch = await igdb(igdbKey).fields("name").limit(100).where(`id=${gameFetch.data[0].genres[0]}`).request('/genres')
            //console.log(genreFetch.data[0].name)
            gameFetch.data[0].genreName=genreFetch.data[0].name
        }
        
    
       
     

        
        var time = moment(gameFetch.data[0].first_release_date*1000).format("MM-DD-YYYY") 
        //console.log(time) 
        gameFetch.data[0].formattedDate=time
        if(gameFetch.data[0].aggregated_rating==null){
            gameFetch.data[0].aggregated_rating= "No Rating "
        }
        else{
            gameFetch.data[0].aggregated_rating= Math.round(gameFetch.data[0].aggregated_rating)+"%"
        }

        setGameFetchData(gameFetch.data[0])

       //console.log(gameFetch.data[0])
      
    
       setLoading(false)
    };

function renderButton(){

    
      
    
    if(added==true){
        return(

            <View style={styles.buttonStyle }>
                <Text style={{color:"white", fontSize: 25}}>             Added  </Text>
                <Ionicons name={'ios-checkmark'} size={40} color={"white"} />
            </View>
        )
    }
    else{
    return(
        
        <TouchableOpacity onPress={ ()=>{
            //call dispatch
            //console.log("+"+props.fav)
            
            props.addToFavorites(props.gameData)
            
            setAdded(true)

         }
        }>
            <View style={styles.buttonStyle}>
                <Text style={{color:"white", fontSize: 25}}> Add to Favorites  </Text>
                <Ionicons name={"ios-add"} size={40} color={"white"} />
            </View>
            </TouchableOpacity>
            
    )
    }
}

//console.log(props.gameData)
if(loading==true){
 return(
    <View style={styles.container}>
        <ActivityIndicator animating size="large" />
    </View>
 )
}
if(gameFetchData.formattedDate=="Invalid date"){
    gameFetchData.formattedDate= "Unknown"
}
return(
    <View style={styles.container}>
        <View style={styles.upperContainer}>
            <View style={styles.coverContainer}>
                <View style={styles.coverStyle}>
                    <Image source={{uri:"https:" +props.gameData.imageUrl[0].url}} style={{height:155, width:140}}></Image>
                </View>
                <View style={styles.genreContainer}>
                    <Text style={{color:"#abbabb", fontSize: 17}}>Genre: {gameFetchData.genreName} </Text>
                </View>
                
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={{color:"white", fontSize: 25}}> {props.gameData.name} </Text>
                </View>
                <View style={styles.releaseRatingContainer}>
                    <Text style={{color:"#abbabb", fontSize: 17}}>Rating: {gameFetchData.aggregated_rating} ({gameFetchData.aggregated_rating_count}) </Text>
                    <Text style={{color:"#abbabb", fontSize: 16}}>Release Date:  {gameFetchData.formattedDate} </Text>
                </View>
            </View>
            
        </View>
        <View style={styles.summaryContainer}>
            <Text style={{color:"#abbabb", fontSize: 25, paddingBottom:5}}>Summary:</Text>
            <ScrollView style={styles.scrollView}>
            <Text style={{color:"#abbabb", fontSize: 13,flexShrink:1}}> {gameFetchData.summary}</Text>
            </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
            {renderButton()}
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
      upperContainer:{
        flex:1.3,
        flexDirection:"row",
        borderWidth:3,
        borderColor:"grey",
      },
      summaryContainer:{
        flex:2.5,
        borderWidth:0,
        borderColor:"white",
        paddingLeft: 10,
        paddingRight:10,
        paddingTop:10,
        
      },
      buttonContainer:{
        flex:.6,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:0,
        borderColor:"blue",
      },
      coverContainer:{
        flex:.7,
        borderWidth:0,
        borderColor:"red",
      },
      coverStyle:{
        flex:3,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        borderWidth:0,
        borderColor:"red",
      },
      infoContainer:{
        flex:1,
        borderWidth:0,
        borderColor:"red",
      },
      titleContainer:{
        flex:2,
        borderWidth:2,
        justifyContent:"center",
        borderColor:"grey",
        paddingLeft:5,
      },
      genreContainer:{
        flex:1,
        flexDirection:"column",
        justifyContent:"center",
        borderWidth:2,
        borderColor:"grey",
      },
      releaseRatingContainer:{
        flex:1,
        borderWidth:2,
        justifyContent:"center",
        borderColor:"grey",
      },
      buttonStyle:{
        flexDirection:"row",
        alignItems:"center",
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor:'purple',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#1A2532',
        width:"75%"
        

      },
      scrollView:{
          borderColor:"red",
          borderWidth:0,
          paddingLeft:10,
          paddingRight:10,
      }




    })
