import Dialog, { DialogFooter, DialogButton,SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import React, { useState, useEffect} from 'react'
import { Text, View, StyleSheet, Image,Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'
import Swipeable from 'react-native-swipeable-row'

const types = {
   
   DELETE_FAVORITE:"DELETE_FAVORITE",
   SET_RATING:"SET_RATING"
   
 }

 export default connect(null,  mapDispatchToProps)(FavoriteCard)
 function mapDispatchToProps(dispatch) {
   return {
       deleteFavorite: (id) => dispatch({ type: types.DELETE_FAVORITE, payload: id }),
       setRating:(rating, id)=> dispatch({type:types.SET_RATING, rating:rating, id:id})
   }
}


function FavoriteCard(props){
   let [alerting,setAlerting]= useState(false)
   let [visable, setVisable] =useState(false)
   const rightContent =  
   <View style={{backgroundColor:"red", paddingTop:40, flexDirection:"row" ,justifyContent:"flex-start",alignContent:"center", width:400 }}>
   <FontAwesome name={"trash"} size={35} color={"white"} style={{alignSelf:"center",paddingLeft:20,paddingBottom:35}}/>

    </View>
 
 function checkVisability(){
   return visable
  
 }
 function closePopup(){
    setVisable(false)
 }

function createRateButton(){
   if(props.item.item.userRating==null){
 return(
   
   <TouchableOpacity style={styles.rateButton} onPress={()=>{setVisable(true)}}>
      <View style= {{flex:1, flexDirection:"column",justifyContent:"center", alignItems:"center"}}>
      <Text style={{color:"white", fontSize:15}}> Rate </Text>
      </View>
   </TouchableOpacity>

 )
}
else if(props.item.item.userRating==true){
   return(
      <TouchableOpacity onPress={()=>{setVisable(true)}}>
     <FontAwesome name={"thumbs-up"} size={30} color={"green"} style={{alignSelf:"center",paddingLeft:0,paddingBottom:0}}/>
   </TouchableOpacity>
   )
}
else{
   return(
      <TouchableOpacity onPress={()=>{setVisable(true)}} >
     <FontAwesome name={"thumbs-down"} size={30} color={"red"} style={{alignSelf:"center",paddingLeft:0,paddingBottom:0}}/>
   </TouchableOpacity>
   )
}

}


function deleteAction(){
   //console.log(props.item.item.id)
   if(alerting==false){
   setAlerting(true)
   Alert.alert(
      "Are you sure you want to delete ",
      `${props.item.item.name}`,
      [
        {
          text: "Cancel",
          onPress: () => {console.log("Cancel Pressed"),setAlerting(false)},
          style: "cancel"
        },
        { text: "Delete", onPress: () =>{ props.deleteFavorite(props.item.item.id)
          setAlerting(false) }}
      ],
      { cancelable: false }
    );
   }
   
   
}

 //console.log(props.item.item)
    return(
       <View>
      <Dialog
      dialogAnimation={new SlideAnimation({
         slideFrom: 'bottom',
       })}
    visible={checkVisability()}
    footer={
      <DialogFooter>
        <DialogButton
          text="Yes"
          style={{backgroundColor:"grey"}}
          textStyle={{color:"green", fontSize:20}}
          onPress={() => {
             closePopup()
            props.setRating(true,props.item.item.id)
         }}
        />
        <DialogButton
          text="No"
          style={{backgroundColor:"grey"}}
          textStyle={{color:"red", fontSize:20}}
          onPress={() => {
             closePopup()
             props.setRating(false,props.item.item.id)
         }}
        />
      </DialogFooter>
    }
  >
  <DialogContent style={{backgroundColor:"grey"}}>
   <Text style={{fontSize:25, paddingTop:10, alignSelf:"center",color:"purple"}}> Do you like {props.item.item.name}?</Text>
    </DialogContent>
  </Dialog>

      <Swipeable rightContent={rightContent} rightActionActivationDistance= {120} onRightActionRelease={()=>{deleteAction()}} >
     <View style={styles.gameCardContainer}>

      <View style={styles.rateSection}>
         {createRateButton()}
      </View>
      <View style={styles.infoSection}>
         <Image source={{uri:"https:" +props.item.item.imageUrl[0].url}} style={{height:100, width:110}}></Image>
         <Text style={styles.text}>{props.item.item.name}</Text>
      </View>
            

        </View>
        </Swipeable>
</View>
    )
}
const styles = StyleSheet.create({
    
   gameCardContainer:{
       flex:1,
       flexDirection:"row",
       justifyContent:"space-between",
       
       borderColor:"grey",
       borderWidth:2
   },
   text:{
       paddingLeft:10,
       fontSize:18,
       color:"white",
       alignSelf:"center",
       
       flexShrink:1
   },
  rateSection:{
     flex:.5,
     borderColor:"white",
     padding:5,
     paddingTop:30,
     paddingBottom:30,
     justifyContent:"center",
     alignItems:"center",
   borderWidth:0,
  }, 
  infoSection:{
   flex:2,
   borderColor:"white",
   flexDirection:"row",
    borderWidth:0,
  },
  rateButton:{
   flex:1,
   flexDirection:"column",
   backgroundColor:"purple",
   width:"75%",
   borderColor:"red",
   borderWidth:0
  }


})