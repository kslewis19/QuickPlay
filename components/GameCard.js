import * as React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

export default connect(null, mapDispatchToProps)(GameCard)

const types = {
   
    UPDATE_DETAILS_ID: "UPDATE_DETAILS_ID",
}  



function mapDispatchToProps(dispatch) {
    return {
        updateId: (id) =>dispatch(handler(id)),
    }
}

function handler(id){
    //console.log("handled")
    return dispatch => {
        return new Promise((resolve, reject) => {
          dispatch({
            type: types.UPDATE_DETAILS_ID,
            payload: id
          });
    
          resolve()
        });
      }
   
    
}

function GameCard(props) {
   
//console.log(props.game.item.id)

let url=""
if(props.game.item.imageUrl[0].url!=null){
 url =props.game.item.imageUrl[0].url
}
else{
url="//upload.wikimedia.org/wikipedia/commons/b/b9/No_Cover.jpg"
}





 return(
    <TouchableOpacity onPress={()=>{
       props.updateId(props.game.item)
       .then(() => {
        props.navigation.navigate('DetailsPage')
      })
       
        }}>
 <View style={styles.gameCardContainer}>
     
    <Image source={{uri:"https:" +url}} style={{height:100, width:110}}></Image>
    <View style={styles.textContainer}>
   <Text style={styles.text}>{props.game.item.name}</Text>
   </View>
   <FontAwesome name={"angle-right"} size={25} color={"white"} style={{alignSelf:"center",paddingLeft:10}}/>
    </View>
    </TouchableOpacity>
 )
    }
    


const styles = StyleSheet.create({
    
    gameCardContainer:{
        flex:1,
        flexDirection:"row",
        justifyContent:"space-evenly",
        padding:10,
        width:"100%",
        borderColor:"black",
        borderBottomWidth:0
    },
    text:{
        paddingLeft:10,
        fontSize:17,
        color:"white",
        alignSelf:"center",
        flexShrink:1
    },
    textContainer:{
        flex:1,
        flexDirection: "row"

    }
})

