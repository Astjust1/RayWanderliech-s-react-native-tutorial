'use strict';

import React, { Component } from 'react'

import {StyleSheet,Text,TextInput,View,TouchableHighlight,ActivityIndicator,Image, Platform} from 'react-native';

var SearchResults = require('./SearchResults');

var styles = StyleSheet.create({
	description: {
		marginBottom : 20,
		fontSize:18,
		textAlign: 'center',
		color: '#656565'
	},
	container: {
		padding:30,
		marginTop : 65,
		alignItems: 'center'
	},
	flowRight: {
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'stretch'
	},
	buttonText:{
		fontSize: 18,
		color: 'white',
		alignSelf: 'center'
	},
	button: {
		height: 36,
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	button2: {
		height: 36,
		flexDirection: 'row',
		backgroundColor: '#48BBEC',
		borderColor: '#48BBEC',
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 10,
		alignSelf: 'stretch',
		justifyContent: 'center'
	},
	searchInput: {
		height:40,
		padding: 4,
		marginRight: 5,
		flex: 4,
		fontSize: 18,
		borderWidth: 1,
		borderColor: '#48BBEC',
		borderRadius: 8,
		color: '#48BBEC'
	},
	image: {
		width: 217,
		height: 138
	}
});

function urlForQueryAndPage(key, value, pageNumber){
	var data = {
		country: 'uk',
		pretty: '1',
		encoding: 'json',
		listing_type: 'buy',
		action: 'search_listings',
		page: pageNumber
	};
	data[key] = value;

	//Functional programming! Applying the logic in map to each member of data to build the query
	var querystring = Object.keys(data).map(key=> key + '=' + encodeURIComponent(data[key])).join('&');

	return 'http://api.nestoria.co.uk/api?' + querystring;
}

class SearchPage extends Component {
	constructor(props){
		super(props);
		//So in the constructor as in other languages you can set default properties
		//to be used later
		this.state = {
			searchString: 'london',
			isLoading: false,
			message: ''
		};

		this._handleResponse=this._handleResponse.bind(this);
	}
	onSearchTextChanged(event){
		console.log('onSearchTextChanged');
		this.setState({searchString: event.nativeEvent.text});
		console.log(this.state.searchString);
	}

	_executeQuery(query){
		console.log(query);
		this.setState({isLoading: true});
		/*
		 The => just replaces an explicit call to an anonymous function
		 ex: .then(response => response.json()) is the same as
		 .then(function(response){
			response.json();
		 })
		 */
		fetch(query)
		.then(response => response.json())
		.then(json => this._handleResponse(json.response))
		.catch(error=> 
			this.setState({
				isLoading: false,
				message: 'Something went cray cray' + error
			}));
	}
	onSearchPressed(){
		var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
		this._executeQuery(query);
	}

	_handleResponse(response){
		this.setState({isLoading:false, message: ''});
		if (response.application_response_code.substr(0,1) === '1'){
			console.log('Properties found: ' + response.listings.length);
			this.props.navigator.push({
				id: 'SearchResults',
				title: 'Results',
				component: SearchResults,
				passProps: {listings: response.listings}
			});
		}else{
			this.setState({message: 'Location not recognized: please try again'});
		}
	}

	onLocationPressed(){
		navigator.geolocation.getCurrentPosition(
			location => {
				var search = location.coords.latitude + ',' + location.coords.longitude;
				this.setState({searchString : search});
				var query = urlForQueryAndPage('centre_point', search,1);
				this._executeQuery(query);
			},
			error => {
				this.setState({
					message: "There was a problem obtaining your location: " + error
				});
			});
	}

	render(){

		var spinner = this.state.isLoading ? (<ActivityIndicator size='large'/>) : (<View/>);
		console.log('SearchPage.render');
		return(
			<View style={styles.container}>
				<Text style={styles.description}>
					Search for houses to buy!
				</Text>
				<Text style={styles.description}>
					Search by place-name,postcode or search by your location.
				</Text>
				<View style={styles.flowRight}>
					<TextInput
						style={styles.searchInput}
						value={this.state.searchString}
						onChange={this.onSearchTextChanged.bind(this)}
						placeholder='Search via name or postcode'/>
					<TouchableHighlight style={styles.button}
						underlayColor='#99d9f4'
						onPress={this.onSearchPressed.bind(this)}>
						<Text style={styles.buttonText}>Go</Text>
					</TouchableHighlight>
				</View>
				<TouchableHighlight style={styles.button2}
					underlayColor='#99d9f4'
					onPress={this.onLocationPressed.bind(this)}>
					<Text style={styles.buttonText}>Location</Text>
				</TouchableHighlight>
				<Image source={require('../resources/house.png')} style={styles.image}/>
				{spinner}
							<Text style={styles.description}>{this.state.message}</Text>
			</View>
			);
	}
}

module.exports = SearchPage;