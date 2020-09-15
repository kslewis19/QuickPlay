import React, { useState, useEffect} from 'react'
import { Text, View, StyleSheet,FlatList, Image,ActivityIndicator,TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { Ionicons } from '@expo/vector-icons'
import FavoriteCard from './FavoriteCard'


export default connect(mapStateToProps, null)(FavoritesPage)

function mapStateToProps(state) {

    return {
       
        fav:state.favoriteGames,
    }
}




function FavoritesPage(props) {

function renderFavCard(item){
    return(
   <FavoriteCard item={item}/>
    )
}
function keyExtractor(item){
    return item.id.toString()
}

function renderEmptyContainer(){
    
    return(
        <View style={styles.emptyContainer}>
        <Text style={styles.emptyStyle}> Try Searching For A Game To Add To Your Favorites </Text>
        </View>
    )
      
    
}



return(
    <View style={styles.container}>
        <Text style={{color:"white",alignSelf:"center",paddingBottom:10, fontSize:25}}> # Favorites: {props.fav.length} </Text>
        <Text style={{color:"gray", fontSize:20}}> Swipe Left to Delete </Text>
       <FlatList 
      renderItem = {renderFavCard}
      data= {props.fav}
      keyExtractor= {keyExtractor}
      style={{borderColor:"black", borderWidth:2 ,flex:3}}
     
      ListEmptyComponent={renderEmptyContainer}
      
      >
      </FlatList>
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
      emptyContainer:{
        flex:1,
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        borderWidth:0,
        paddingTop:20
        
    },
    emptyStyle:{
        fontSize:15,
        color:"grey"
    }
})