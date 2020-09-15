import React from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { Provider } from 'react-redux'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from '@react-navigation/stack'
import { createStore } from 'redux'
import SearchScreen from './components/SearchScreen'
import DetailsPage from './components/DetailsPage'
import FavoritesPage from './components/FavoritesPage'
import RecommendationsPage from './components/RecommendationsPage'
import { applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Ionicons } from '@expo/vector-icons'
import * as firebase from 'firebase'
import Constants from 'expo-constants';
console.disableYellowBox = true;

const intialState = { searchGames: [] ,detailsId:{}, favoriteGames:[], firebase, userID: Constants.deviceId }
const types = {
  UPDATE_SEARCH_GAMES: "UPDATE_SEARCH_GAMES",
  APPEND_SEARCH_GAMES:"APPEND_SEARCH_GAMES",
  UPDATE_DETAILS_ID: "UPDATE_DETAILS_ID",
  APPEND_FAVORITE_GAMES:"APPEND_FAVORITE_GAMES",
  UPDATE_FAVORITE_GAMES:"UPDATE_FAVORITE_GAMES",
  DELETE_FAVORITE:"DELETE_FAVORITE",
  SET_RATING:"SET_RATING",

}

var firebaseConfig = {
  apiKey: "AIzaSyDqt73gXakoxj3b_4gm_A2w7a8sPd9wyzw",
  authDomain: "quickplay-9abbf.firebaseapp.com",
  databaseURL: "https://quickplay-9abbf.firebaseio.com",
  projectId: "quickplay-9abbf",
  storageBucket: "quickplay-9abbf.appspot.com",
  messagingSenderId: "212427261174",
  appId: "1:212427261174:web:e9266d44c84444f59e98d7",
  measurementId: "G-NXPKHR0MYZ"
};
if(firebase.apps.length==0){
  firebase.initializeApp(firebaseConfig);
  }
let store = createStore(reducer, intialState,applyMiddleware(thunk))

function reducer(state, action) {
  let newState = { ...state }
  if (action.type == types.UPDATE_SEARCH_GAMES) {
    newState={...state,
      searchGames:[...action.payload]}
      //console.log("hey")
  }
  if(action.type==types.APPEND_SEARCH_GAMES){
    newState={...state,
      searchGames:[...state.searchGames,...action.payload]}
  }

  if (action.type == types.UPDATE_DETAILS_ID) {
    //console.log(action.payload)
    newState={...state,
      detailsId:action.payload}
      
  }
  if (action.type==types.APPEND_FAVORITE_GAMES){
    //console.log(action.payload)
    
    //console.log("++++++++"+state.favoriteGames)
    newState={ ...state,
      favoriteGames:[ ...state.favoriteGames, action.payload]
      
    }
   
    firebase.database().ref('users/'+state.userID).set(
         
      {
      favorites:[ ...state.favoriteGames, action.payload]
      }
  )
  }

  if(action.type==types.UPDATE_FAVORITE_GAMES){
    newState={ ...state,
      favoriteGames:[...action.payload]
      
    }
  }

  if (action.type==types.DELETE_FAVORITE){
    let filtered = ()=>{
      
      return(
        
      state.favoriteGames.filter(fav=>{
        
        if(fav.id!=action.payload){
          
          return fav
        }
        
      }))
    }
    //console.log(filtered())
    
    newState={...state,
      favoriteGames:filtered()
    } 
  
    
    firebase.database().ref('users/'+state.userID).set(
         
      {
      favorites:newState.favoriteGames
      }
  )
  }
  if(action.type==types.SET_RATING){
    let rated = ()=>{
      return(
      state.favoriteGames.map(fav=>{
        if(fav.id==action.id){
          fav.userRating=action.rating
        }
        return fav
      }))
    }

    newState={...state,
    favoriteGames:rated()}

    firebase.database().ref('users/'+state.userID).set(
         
      {
      favorites:newState.favoriteGames
      }
  )
  }
  
 //console.log(newState.favoriteGames)
  //console.log(action.payload)
  
  return newState
}

const RootTab = createBottomTabNavigator()
const RootStack= createStackNavigator()
function QuickPlay(){
  return(
    <RootTab.Navigator initialRouteName="SearchScreen" screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color}) => {
        let iconName;
        let size=35
        if (route.name === 'Search') {
          iconName = "ios-search"
        } 
        else if(route.name ==='Favorites'){
          iconName = "ios-heart" 
        }
        else if(route.name=="Recommendations"){
          iconName= "md-thumbs-up"
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      }
      
    })}
    
    tabBarOptions={{
      activeTintColor: 'purple',
      inactiveTintColor: 'white',
      shadowColor: 'transparent',
      style: {
        backgroundColor: 'black',
        shadowColor: 'transparent',
        paddingTop: 3
      }
      
    }} >


      <RootTab.Screen name="Search" component={SearchScreen} />
      <RootTab.Screen name="Recommendations" component={RecommendationsPage} />
      <RootTab.Screen name= "Favorites" component={FavoritesPage}/>
    </RootTab.Navigator>
  )
}
const stackOptions = {
  

  headerStyle: {
      backgroundColor: "black",
      borderColor:"black",
      shadowColor: 'transparent',
  },
  
  headerTitleStyle: {
      fontWeight: 'bold',
      color: 'purple',
      fontSize: 25,
      flex:1,
      textAlign:"center"
  },
       
}



export default function App() {
  
  return (
    <Provider store={store}>
      <NavigationContainer>

        <RootStack.Navigator initialRouteName={"QuickPlay"} screenOptions={stackOptions} >
        <RootStack.Screen  name= "QuickPlay" component={QuickPlay}/>
        <RootStack.Screen  name= "DetailsPage" component={DetailsPage}/>
        </RootStack.Navigator>
    
      </NavigationContainer>
    </Provider>
  );
}


