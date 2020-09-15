import igdb from 'igdb-api-node'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View ,FlatList,TextInput,ActivityIndicator, ShadowPropTypesIOS} from 'react-native';
import { connect } from 'react-redux'
import apicalypse from 'apicalypse';
import Constants from 'expo-constants';
import GameCard from "./GameCard"
import DropdownMenu from 'react-native-dropdown-menu';
import { Ionicons } from '@expo/vector-icons'
import FavoritesPage from './FavoritesPage';

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)

const igdbKey="6c7f65361fdabb3d8b6dbe17eda25d77"

const types = {
    UPDATE_SEARCH_GAMES: "UPDATE_SEARCH_GAMES",
    APPEND_SEARCH_GAMES: "APPEND_SEARCH_GAMES",
    UPDATE_FAVORITE_GAMES:"UPDATE_FAVORITE_GAMES",
}

function mapDispatchToProps(dispatch) {
    return {
        updateSearchGames: (games) => dispatch({ type: types.UPDATE_SEARCH_GAMES, payload: games }),
        appendSearchGames: (games) => dispatch({ type: types.APPEND_SEARCH_GAMES, payload: games }),
        getInitalFavoriteGames: (id) => dispatch({ type: types.UPDATE_FAVORITE_GAMES, payload: id }),
    }
}

function mapStateToProps(state) {

    return {
        games: state.searchGames,
        id:state.userID,
        fav:state.favoriteGames,
        firebase: state.firebase
    }
}



function keyExtractor(item){
    //console.log(item)
    return item.id.toString()
  }

  
   
    
  
function SearchScreen(props) {
    useEffect(() => {
        //getGameData(null,null,0)
        getInitialData()
        getGameData(genreSearch,keyword,offset)
        //console.log(props.games)
        
        

    }, [])

    let [genreSearch,setGenre]= useState(null)
    let [keyword,setKeyword]= useState(null)
    let [offset,setOffset]= useState(null)
    let [loading,setLoading]= useState(false)
    let [refreshing,setRefreshing] = useState(false)
    let [listEmpty,setListEmpty]= useState(false)
    function renderGameCard(item){
        return(
            <GameCard game={item} navigation={props.navigation}/>
        )
    }

    
    function getInitialData(){
        
        props.firebase.database().ref('users/'+props.id).once('value',(snapshot)=>{
            if(snapshot.val()!=null){
            props.getInitalFavoriteGames(snapshot.val().favorites)
            //console.log(snapshot.val().favorites)
            }
        })
      }
    async function getGameData(genre,keyword,offset) {
        //console.log(genre)
        //console.log(keyword)
        let filterString=`cover!=null`
        setLoading(true)
        //genre
        const genreFetch = await igdb(igdbKey).fields("name").limit(100).request('/genres')
        if(genre!=null&& genre!="Any Genre"){
        for(var i=0;i<genreFetch.data.length;i++){
            if(genreFetch.data[i].name==genre){
                 var genreNumber=genreFetch.data[i].id
                 
            }
        }
        
        filterString+=`&genres=${genreNumber}`
    }
       
    if(keyword!=null){
        filterString+=`&name~ *"${keyword}"*`
    }
    //console.log(genreFetch.data)
    
        const gameFetch = await igdb(igdbKey).fields("name,cover,age_ratings,similar_games")
        .where(filterString+`&age_ratings!=9371`+`&age_ratings!=9370`+`&age_ratings!=20787`+`&age_ratings!=22265`+`&age_ratings!=9369`+`&age_ratings!=9372`+`&age_ratings!=20788`+`&id!=67166`)
        .limit(20)
        .sort("popularity",'desc')
        
        //.search(keyword)
        .offset(offset)
        .request('/games');
        
    
       
      //console.log(gameFetch.data)
    
        //GETS COVER URL AND ADDS TO GAME OBJECT
       for(var i=0;i<gameFetch.data.length;i++){
        
        if(typeof gameFetch.data[i]['cover']==='number'){
        let gameId=gameFetch.data[i].id
        const gameFetchWithImage = await igdb(igdbKey).fields("url,height,width").where(`game = ${gameId}`)
        .request('/covers');
        
        gameFetch.data[i].imageUrl= gameFetchWithImage.data
           }
           else{
            gameFetch.data[i].imageUrl= "none"
           }
       }
    
      
    //console.log(gameFetch.data)
    if(offset==null){
    props.updateSearchGames(gameFetch.data)
    }
    else if(offset=!null){
        //console.log("appending")
    props.appendSearchGames(gameFetch.data)
    }    
     
    if(gameFetch.data.length==0){
        setListEmpty(true)
        //console.log(listEmpty)
    }
    else{
        setListEmpty(false)
        //console.log(listEmpty)
    }
    setLoading(false)
    setRefreshing(false)
    };

    
var genreData= [["Any Genre","Racing","Sport","Arcade","Platform","Indie","Shooter","Role-playing (RPG)","Fighting","Strategy","Simulator", "Adventure","Music"]]

const flatListRef = React.useRef()

    //const toTop = () => {
        // use current
        //flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    //}

    function renderFooter() {
        if (!loading) return null;
    
        return (
          <View
            style={{
              paddingVertical: 20,
              borderTopWidth: 1,
              borderColor: "#CED0CE"
            }}
          >
            <ActivityIndicator animating size="large" />
          </View>
        );
      }

    function renderEmptyContainer(){
        if(!loading){
        return(
            <View style={styles.emptyContainer}>
            <Text style={styles.emptyStyle}> No Games Found :( </Text>
            </View>
        )
            }
        return(null)
    }
    let data=""
    if(!refreshing){
        data=props.games
    }
    
    return(
        
    <View style={styles.container}>
        <View style={styles.textInputContainer}>
        <Ionicons name={"ios-search"} size={25} color={"white"} />
        <TextInput
          style={styles.textInput}
          
          multiline={false}
          placeholder= "  Type Your Keyword Here To Refine Results"
          placeholderTextColor="#abbabb"
          value={keyword}
          onSubmitEditing={(TextInputValue)=>{
            setRefreshing(true)
            getGameData(genreSearch,keyword,null)
            setOffset(null)
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
        }}
          onChangeText={(TextInputValue)=>{
          //setRefreshing(true)
          setKeyword(TextInputValue)
          //console.log(TextInputValue)
          //setOffset(null)
          //flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
          
          
            }}
        />
        </View>
        <DropdownMenu
        style={styles.dropdown}
        bgColor={'black'}
        tintColor={'white'}
        activityTintColor={'purple'}
        data={genreData}
        optionTextStyle={{fontSize:25}}
        option
    
        handler={(selection,row)=>{{
            var temp =genreData[0][row]
            //console.log(temp)
            //props.updateGenre(temp)
            setGenre(temp)
            setRefreshing(true)
            setOffset(null)
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
            getGameData(temp,keyword,null)
            
        }}}
        >
          
      <FlatList 
      renderItem = {renderGameCard}
      data= {data}
      keyExtractor= {keyExtractor}
      ListFooterComponent={renderFooter}
      style={{borderColor:"black", borderWidth:2 ,flex:3}}
      onEndReached={()=>{
          if(!listEmpty&&!loading){
          setOffset(offset+20)
          getGameData(genreSearch,keyword,offset+20)
          }
          
          //console.log("endReached")
      }}
      ref={flatListRef}
      onEndThreshold={15}
      ListEmptyComponent={renderEmptyContainer}
      
      >
      </FlatList>
      
      </DropdownMenu>
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
       
        alignContent:"flex-start",
        backgroundColor: '#1A2532',
      },
    gameCardContainer:{
        flex:1,
        
        borderColor:"black",
        borderWidth:0
    },
    text:{
        fontSize:20
    },
    dropdown:{
       backgroundColor:"black"
    },
    textInputContainer:{
        flex: .05,
        flexDirection:"row",
        alignItems:"center",
        borderWidth:0,
        borderColor:"black",
        paddingTop:5,
        backgroundColor:"black",
        paddingLeft: 6

    },
    textInput:{
        flex: 1,
        paddingLeft:6,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        
        
    },
    emptyContainer:{
        flex:1,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        borderWidth:0,
        
    },
    emptyStyle:{
        fontSize:20,
        color:"white"
    }

})