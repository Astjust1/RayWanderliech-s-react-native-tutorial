'use strict';

var React = require('react');
var ReactNative = require('react-native');
var SearchPage = require('./components/SearchPage');
var SearchResults = require('./components/SearchResults');
var PropertyView = require('./components/PropertyView');

var _BackAndroid = ReactNative.BackAndroid;
var _navigator;

var styles = ReactNative.StyleSheet.create({
	text: {
		color: 'black',
		backgroundColor: 'white',
		fontSize: 30,
		margin : 80
	},
	container: {
		flex: 1
	}
});

class HelloWorld extends React.Component{
	constructor(props){
		super(props);

		this.state={};
	}
	render() {
		return ( 

			<ReactNative.View>

				<ReactNative.Image style={{width: 50, height: 50}} source={{uri:'https://assets.entrepreneur.com/content/16x9/822/1413823428-amazingly-free-stock-websites.jpg'}}/> 
			</ReactNative.View>

				//React.createElement(ReactNative.Image, {source: "https://assets.entrepreneur.com/content/16x9/822/1413823428-amazingly-free-stock-websites.jpg"});
				);
		}

	}

export default class PropertyFinder extends React.Component{

	constructor(props){
		super(props);

		this.state={};
	}
	componentDidMount(){
	 if(ReactNative.Platform.OS === "android"){
		_BackAndroid.addEventListener("hardwareBackPress", () =>{
			if(_navigator.getCurrentRoutes().length === 1 ){
				return false;
			}
			_navigator.pop();
			return true;
		});
	}
	}

	navigatorRenderScene(route, navigator){
		_navigator = navigator;
		console.log(_navigator);
		switch(route.id){
			case("SearchPage"):
				return( <SearchPage route={route} navigator={navigator}/>);
			case("SearchResults"):
				return(<SearchResults route={route} navigator={navigator}/>);
			case("PropertyView"):
				return(<PropertyView route={route} navigator={navigator}/>);
		}
		
	}

	render(){
		console.log(ReactNative.Platform.OS);
		if(ReactNative.Platform.OS === 'android'){
			return(

				<ReactNative.Navigator style={styles.container} initialRoute={{id: "SearchPage" ,title: 'Property Finder', component: SearchPage}}
				renderScene={this.navigatorRenderScene}/>

				);
		}else{
			return(
				<ReactNative.NavigatorIOS style={styles.container} initialRoute={{title: 'Property Finder', component: SearchPage}}/>
				);

		}
	}
}